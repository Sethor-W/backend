import { Op } from "sequelize";
import { invoiceStatusEnum } from "../enum/invoiceStatus.enum.js";
import {
  calculateExpirationDate,
  sendResponse,
  validateRequiredFields
} from "../helpers/utils.js";
import { Business } from "../models/common/business.js";
import { Invoice } from "../models/common/invoice.js";
import { User } from "../models/client/users.js";
import { UserBusiness } from "../models/business/usersBusiness.js";
import { Profile } from "../models/client/profile.js";
import { ProfileBusiness } from "../models/business/profileBusiness.js";
import { Branch } from "../models/common/branch.js";
import { EmployeesAssociatedBusinesses } from "../models/business/employeesAssocitedBusiness.js";
import { PaymentController } from "./payment.controller.js";

export class InvoiceController {
  /** *********************************************************************************
   ************************************************************************************
   * COLLECTORS
   **********************************************************************************
   **********************************************************************************/

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/create:
   *   post:
   *     summary: Create a new invoice with draft status
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - products
   *             properties:
   *               name:
   *                 type: string
   *                 description: Invoice name or description
   *               subtotal:
   *                 type: number
   *                 description: Subtotal amount
   *               sth:
   *                 type: number
   *                 description: STH amount
   *               totalIVA:
   *                 type: number
   *                 description: Total VAT amount
   *               totalGeneral:
   *                 type: number
   *                 description: Total amount including taxes
   *               products:
   *                 type: array
   *                 description: List of products in the invoice
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: Product ID
   *                     name:
   *                       type: string
   *                       description: Product name
   *                     quantity:
   *                       type: number
   *                       description: Quantity of product
   *                     price:
   *                       type: number
   *                       description: Unit price
   *               note:
   *                 type: string
   *                 description: Additional notes for the invoice
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *       400:
   *         description: Missing required fields or collector has no branch assigned
   *       404:
   *         description: Collector profile not found
   *       500:
   *         description: Server error
   */
  // POST invoices/:businessId/create
  static async createInvoice(req, res) {
    const {
      businessId
    } = req.params;
    const {
      userId
    } = req.user;
    const {
      name,
      subtotal,
      sth,
      totalIVA,
      totalGeneral,
      products,
      note
    } = req.body;

    try {
      // Validar la presencia de los campos requeridos
      const requiredFields = ["name", "products"];
      const missingFields = validateRequiredFields(req.body, requiredFields);
      if (missingFields.length > 0) {
        return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(", ")}`);
      }

      const profile = await UserBusiness.findByPk(userId, {
        include: [{
          model: ProfileBusiness,
          attributes: ['additionalData']
        }]
      });
      if (!profile) {
        return sendResponse(res, 404, true, "Perfil del cobrador no encontrado");
      }

      if (profile.profiles_business.additionalData) {

        // Convertir la cadena JSON de productos en un objeto
        profile.profiles_business.additionalData = await JSON.parse(profile.profiles_business.additionalData);

        // Obtener la sucursal usando el ID de la sucursal
        const branchId = profile.profiles_business.additionalData.branch.id;
        const branch = await Branch.findByPk(branchId);

        // Hacer una solicitud a la API para obtener datos del país
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${branch.country_cca2}`);
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Obtener la divisa
        const currency = data[0]?.currencies;
        const currencyCode = Object.keys(currency)[0]; // Obtener el código de la divisa (DOP)
        const currencyDetails = currency[currencyCode]; // Obtener detalles de la divisa

        console.log(`Divisa: ${currencyDetails.name} (${currencyCode}), Símbolo: ${currencyDetails.symbol}`);

        // Crear una nueva factura
        const newInvoice = await Invoice.create({
          name,
          note,
          status: invoiceStatusEnum.DRAFT,
          collectorId: userId,
          businessId,
          clientId: null,
          products: JSON.stringify(products),
          subtotal,
          sth,
          totalIVA,
          totalGeneral,
          currency: currencyCode,
        });

        // Parsea los productos de cadena JSON a objeto
        newInvoice.products = JSON.parse(newInvoice.products);

        // Enviar respuesta exitosa
        return sendResponse(res, 201, false, "Factura creada exitosamente", newInvoice);

      } else {
        return sendResponse(res, 400, true, "El cobrador no tiene una sucursal asignadad");
      }

    } catch (error) {
      console.error("Error al enviar:", error);
      return sendResponse(res, 500, true, "Error al enviar");
    }
  }

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/collector/getAll:
   *   get:
   *     summary: Get invoices by collector with optional filtering and pagination
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [draft, paid, pending, cancelled]
   *         description: Filter invoices by status
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number for pagination
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *       500:
   *         description: Server error
   */
  // GET invoices/:businessId/collector/getAll?page=1&status=draft
  static async getAllInvoicesByCollector(req, res) {
    const {
      userId
    } = req.user;
    const {
      status,
      page
    } = req.query;

    try {
      // Configurar opciones de paginación
      const pageSize = 15;
      const offset = (page - 1) * pageSize;

      // Configurar la condición de consulta para incluir todas las facturas si no se proporciona un estado
      const whereCondition = status ? {
        collectorId: userId,
        status: status,
      } : {
        collectorId: userId,
      };

      // Determina el orden basado en el status
      const orderCondition = status === invoiceStatusEnum.PAID ? [
        ["dateTimePayment", "DESC"]
      ] : [
        ["createdAt", "DESC"]
      ];

      // Consultar las facturas del cobrador
      const invoices = await Invoice.findAndCountAll({
        where: whereCondition,
        order: orderCondition,
        include: [{
            model: User,
            as: "client",
            attributes: ["id", "email"],
          },
          {
            model: Business,
          },
          {
            model: UserBusiness,
            as: "collector",
            attributes: ["id", "email"],
          },
        ],
        limit: pageSize,
        offset: offset,
      });

      invoices.rows.forEach((invoice) => {
        invoice.products = JSON.parse(invoice.products);
      });

      // Enviar la respuesta con las facturas obtenidas
      return sendResponse(
        res,
        200,
        false,
        "Facturas recuperadas exitosamente",
        invoices
      );
    } catch (error) {
      console.error("Error al recuperar facturas:", error);
      return sendResponse(res, 500, true, "Error al recuperar facturas");
    }
  }

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/collector/details/{invoiceId}:
   *   get:
   *     summary: Get details of a specific invoice by collector
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the invoice
   *     responses:
   *       200:
   *         description: Invoice details retrieved successfully
   *       404:
   *         description: Invoice not found
   *       500:
   *         description: Server error
   */
  // GET invoices/:businessId/collector/details/:invoiceId
  static async getInvoiceDetailsByCollector(req, res) {
    const {
      invoiceId
    } = req.params;
    const {
      userId
    } = req.user;

    try {
      // Buscar la factura por su ID
      const invoice = await Invoice.findOne({
        where: {
          id: invoiceId,
          [Op.or]: [{
            collectorId: userId,
          }, ],
        },
        include: [{
            model: User,
            as: "client",
            attributes: ["id", "email"],
            include: [{
              model: Profile,
              attributes: ["codeUser", "name", "lastName"],
            }, ],
          },
          {
            model: Business,
          },
          {
            model: UserBusiness,
            as: "collector",
            attributes: ["id", "email"],
            include: [{
              model: ProfileBusiness,
              attributes: [
                "codeEmployee",
                "name",
                "lastName",
                "additionalData",
              ],
            }, ],
          },
        ],
      });

      if (!invoice) {
        return sendResponse(res, 404, true, "Factura no encontrada");
      }

      if (!invoice) {
        return sendResponse(res, 404, true, "Factura no encontrada");
      }

      // Convertir la cadena JSON de productos en un objeto
      invoice.products = await JSON.parse(invoice.products);
      invoice.collector.profiles_business.additionalData = await JSON.parse(
        invoice.collector.profiles_business.additionalData
      );
      invoice.collector.profiles_business.additionalData.branch.operatingHours =
        await JSON.parse(
          invoice.collector.profiles_business.additionalData.branch
          .operatingHours
        );

      // Elimnar llaves inecesarias
      delete invoice.collector.profiles_business.additionalData
        .employeeSchedule;

      // Enviar la respuesta con los detalles de la factura
      return sendResponse(
        res,
        200,
        false,
        "Detalles de la factura recuperados exitosamente, no",
        invoice
      );
    } catch (error) {
      console.error("Error al recuperar los detalles de la factura:", error);
      return sendResponse(res, 500, true, "Error al recuperar los detalles de la factura");
    }
  }

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/collector/update/{invoiceId}:
   *   put:
   *     summary: Update an invoice by collector
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the invoice to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Invoice name or description
   *               status:
   *                 type: string
   *                 enum: [draft, pending, cancelled]
   *                 description: Invoice status (cannot be changed to paid)
   *               subtotal:
   *                 type: number
   *                 description: Subtotal amount
   *               sth:
   *                 type: number
   *                 description: STH amount
   *               totalIVA:
   *                 type: number
   *                 description: Total VAT amount
   *               totalGeneral:
   *                 type: number
   *                 description: Total amount including taxes
   *               products:
   *                 type: array
   *                 description: List of products in the invoice
   *               note:
   *                 type: string
   *                 description: Additional notes for the invoice
   *     responses:
   *       200:
   *         description: Invoice updated successfully
   *       404:
   *         description: Invoice not found or unauthorized
   *       500:
   *         description: Server error
   */
  // PUT invoices/:businessId/collector/update/:invoiceId
  static async updateInvoiceByCollector(req, res) {
    const {
      invoiceId
    } = req.params;
    const {
      userId
    } = req.user;
    const {
      name,
      status,
      subtotal,
      sth,
      totalIVA,
      totalGeneral,
      products,
      note,
    } = req.body;

    try {
      // Verificar si la factura existe y pertenece al collector
      const invoice = await Invoice.findOne({
        where: {
          id: invoiceId,
          collectorId: userId,
          status: {
            [Op.ne]: invoiceStatusEnum.PAID,
          },
        },
      });

      if (!invoice) {
        return sendResponse(
          res,
          404,
          true,
          "Factura no encontrada o no tienes permiso para actualizarla"
        );
      }

      // Actualizar la factura utilizando el método update
      await Invoice.update({
        name: name || invoice.name,
        note: note || invoice.note,
        status: status || invoice.status,
        subtotal: subtotal || invoice.subtotal,
        sth: sth || invoice.sth,
        totalIVA: totalIVA || invoice.totalIVA,
        totalGeneral: totalGeneral || invoice.totalGeneral,
        products: JSON.stringify(products) || invoice.products,
      }, {
        where: {
          id: invoiceId,
        },
      });

      // Recuperar la factura actualizada
      const updatedInvoice = await Invoice.findByPk(invoiceId);
      updatedInvoice.products = JSON.parse(invoice.products);

      // Enviar la respuesta con la factura actualizada
      return sendResponse(
        res,
        200,
        false,
        "Factura actualizada exitosamente",
        updatedInvoice
      );
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
      return sendResponse(res, 500, true, "Error al actualizar la factura");
    }
  }

  /** *********************************************************************************
   ************************************************************************************
   * MANGERS and OWNERS
   **********************************************************************************
   **********************************************************************************/

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/getAll:
   *   get:
   *     summary: Get all invoices for a business with optional filtering and pagination
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [draft, paid, pending, cancelled]
   *         description: Filter invoices by status
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number for pagination
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *       500:
   *         description: Server error
   */
  // GET invoices/:businessId/getAll?page=1&status=draft
  static async getAllInvoices(req, res) {
    const {
      businessId
    } = req.params;
    const {
      status,
      page
    } = req.query;

    try {
      // Configurar opciones de paginación
      const pageSize = 15;
      const offset = (page - 1) * pageSize;

      // Configurar la condición de consulta para incluir todas las facturas si no se proporciona un estado
      const whereCondition = status ? {
        status: status,
        businessId,
      } : {
        businessId,
      };
      // Consultar las facturas del cobrador
      const invoices = await Invoice.findAndCountAll({
        where: whereCondition,
        order: [
          ["dateTimePayment", "DESC"]
        ],
        include: [{
            model: User,
            as: "client",
            attributes: ["id", "email"],
            include: [{
              model: Profile,
              attributes: ["name", "lastName"],
            }, ],
          },
          {
            model: Business,
          },
          {
            model: UserBusiness,
            as: "collector",
            attributes: ["id", "email"],
            include: [{
              model: ProfileBusiness,
              attributes: ["codeEmployee", "name", "lastName"],
            }, ],
          },
        ],
        limit: pageSize,
        offset: offset,
      });

      invoices.rows.forEach((invoice) => {
        invoice.products = JSON.parse(invoice.products);
      });

      // Enviar la respuesta con las facturas obtenidas
      return sendResponse(
        res,
        200,
        false,
        "Facturas recuperadas exitosamente",
        invoices
      );
    } catch (error) {
      console.error("Error al recuperar facturas:", error);
      return sendResponse(res, 500, true, "Error al recuperar facturas");
    }
  }

  /**
   * Get details of a specific invoice
   * GET invoices/:businessId/details/:invoiceId
   */
  // static async getInvoiceDetails(req, res) {
  //   const {
  //     invoiceId
  //   } = req.params;

  //   try {
  //     // Buscar la factura por su ID
  //     const invoice = await Invoice.findByPk(invoiceId, {
  //       include: [{
  //           model: User,
  //           as: "client",
  //           attributes: ["id", "email"],
  //           include: [{
  //             model: Profile,
  //             attributes: ["codeUser", "name", "lastName"],
  //           }, ],
  //         },
  //         {
  //           model: Business,
  //         },
  //         {
  //           model: UserBusiness,
  //           as: "collector",
  //           attributes: ["id", "email"],
  //           include: [{
  //             model: ProfileBusiness,
  //             attributes: [
  //               "codeEmployee",
  //               "name",
  //               "lastName",
  //               "additionalData",
  //             ],
  //           }, ],
  //         },
  //       ],
  //     });

  //     if (!invoice) {
  //       return sendResponse(res, 404, true, "Factura no encontrada");
  //     }

  //     // Convertir la cadena JSON de productos en un objeto
  //     invoice.products = await JSON.parse(invoice.products);
  //     invoice.collector.profiles_business.additionalData = await JSON.parse(
  //       invoice.collector.profiles_business.additionalData
  //     );
  //     invoice.collector.profiles_business.additionalData.branch.operatingHours =
  //       await JSON.parse(
  //         invoice.collector.profiles_business.additionalData.branch
  //         .operatingHours
  //       );

  //     // Elimnar llaves inecesarias
  //     delete invoice.collector.profiles_business.additionalData
  //       .employeeSchedule;

  //     // Enviar la respuesta con los detalles de la factura
  //     return sendResponse(
  //       res,
  //       200,
  //       false,
  //       "Detalles de la factura recuperados exitosamente",
  //       invoice
  //     );
  //   } catch (error) {
  //     console.error("Error al recuperar los detalles de la factura:", error);
  //     return sendResponse(res, 500, true, "Error al recuperar los detalles de la factura");
  //   }
  // }

  /** *********************************************************************************
   ************************************************************************************
   * CLIENTS
   **********************************************************************************
   **********************************************************************************/

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/collector/pay/{invoiceId}:
   *   post:
   *     summary: Process payment for an invoice by collector
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the business
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the invoice to pay
   *       - in: query
   *         name: action_type
   *         schema:
   *           type: string
   *           default: payment
   *         description: Type of payment action
   *       - in: query
   *         name: buy_currency
   *         schema:
   *           type: string
   *           default: USD
   *         description: Currency to buy
   *       - in: query
   *         name: fixed_side
   *         schema:
   *           type: string
   *           default: sell
   *         description: Fixed side for currency conversion
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - clientId
   *             properties:
   *               clientId:
   *                 type: string
   *                 description: ID of the client who is paying
   *               dateTimePayment:
   *                 type: string
   *                 format: date-time
   *                 description: Date and time of payment
   *     responses:
   *       200:
   *         description: Payment processing initiated successfully
   *       400:
   *         description: Error with payment rate or details
   *       404:
   *         description: User, business, invoice or profile not found
   *       500:
   *         description: Server error
   */
  // POST invoices/:businessId/collector/pay/:invoiceId
  static async payInvoiceByCollector(req, res) {
    const {
      invoiceId,
      businessId
    } = req.params;
    const {
      userId
    } = req.user;
    const {
      clientId,
      dateTimePayment,
      ...bodyReq
    } = req.body;
    const {
      action_type = "payment", buy_currency = "USD", fixed_side = "sell", ...params
    } = req.query;

    try {
      // Verificar existencia del usuario y empresa
      const [user, business, invoice, userProfile] = await Promise.all([
        User.findByPk(clientId), // Buscar el usuario
        Business.findOne({
          where: {
            id: businessId
          }
        }), // Buscar la empresa
        Invoice.findOne({
          where: {
            id: invoiceId,
            collectorId: userId,
            status: {
              [Op.ne]: invoiceStatusEnum.PAID
            }
          }
        }), // Buscar la factura
        Profile.findOne({
          where: {
            userId: clientId
          }
        }) // Buscar el perfil del usuario
      ]);

      if (!user) return sendResponse(res, 404, true, "Usuario no encontrado"); // Factura no encontrada o no tienes permiso para actualizarla
      if (!business || !business.PSPWalletId) return sendResponse(res, 404, true, "Empresa no encontrada o sin PSPWalletId");
      if (!invoice) return sendResponse(res, 404, true, "Factura no encontrada o no autorizada para actualizar");
      if (!userProfile) return sendResponse(res, 404, true, "Perfil del usuario pagador no existe");


      const bodyFXRate = {
        ...params,
        action_type,
        buy_currency,
        fixed_side,
        sell_currency: invoice.currency,
        amount: invoice.totalGeneral
      }
      const responseFXRate = await PaymentController.getFXRateHandleFuntion(bodyFXRate)
      const FXRate = responseFXRate.body.data;

      // Validar el FXRate
      if (responseFXRate.body.status.status == 'ERROR') {
        return sendResponse(res, 400, false, "Error al obtener el FX Rate", FXRate, {
          status: responseFXRate.body.status
        });
      }

      // Preparar el cuerpo del payment
      const body = {
        ...bodyReq,
        amount: FXRate.buy_amount,
        currency: FXRate.buy_currency,
        description: `Pago de la empresa ${business.name}: ${invoice.note}`,
        complete_payment_url: "https://www.sethor.tech",
        error_payment_url: "https://google.com",
        capture: true,
        receipt_email: user.email,
        customer: userProfile.PSPCustomerId,
        ewallets: [{
          ewallet: business.PSPWalletId, // Wallet de la empresa
          percentage: 85 // Porcentaje enviado a la empresa
        }],
        fixed_side: "sell",
        expiration: calculateExpirationDate('card', true),
        requested_currency: invoice.currency, // Moneda recibida en la billetera Rapyd.
        metadata: {
          merchant_defined: true,
          invoice_id: invoice.id,
          // Si vez necesario agregar mas campos para cuando se escuche el webhook y verificar si el pago se hizo correctamente
        }
      };

      // Crear el payment
      const paymentResponse = await PaymentController.createPaymentHandleFuntion(body);

      // Enviar la respuesta para proceder con el pago de la factura
      return sendResponse(res, 200, false, "Factura en proceso de pago", paymentResponse.body.data);


      // // Generar un número de comprobante único
      // const voucherNumber = `ST-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      // // Formatear la fecha y hora actual usando JavaScript nativo
      // // const dateTimePayment = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // // Pagar factura
      // await Invoice.update({
      //   status: invoiceStatusEnum.PAID,
      //   clientId: user.id,
      //   dateTimePayment: dateTimePayment,
      //   voucherNumber: voucherNumber,
      // }, {
      //   where: {
      //     id: invoiceId,
      //   },
      // });

      // // Recuperar la factura pagada
      // const updatedInvoice = await Invoice.findByPk(invoiceId);
      // updatedInvoice.products = JSON.parse(invoice.products);
    } catch (error) {
      console.error("Error al pagar la factura:", error);
      return sendResponse(res, error.statusCode || 500, true, "Error al pagar la factura", error.message || error.body || "Unknown error");
    }
  }



}