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
import { Payment } from "../models/common/payment.js";

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
   *               note:
   *                 type: string
   *                 description: Additional notes for the invoice
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
   *                     price:
   *                       type: number
   *                       description: Unit price
   *                     quantity:
   *                       type: number
   *                       description: Quantity of product
   *               sth:
   *                 type: number
   *                 description: STH amount
   *               subtotal:
   *                 type: number
   *                 description: Subtotal amount
   *               totalGeneral:
   *                 type: number
   *                 description: Total amount including taxes
   *               totalIVA:
   *                 type: number
   *                 description: Total VAT amount
   *           example:
   *             name: "Monthly Service Invoice"
   *             subtotal: 100
   *             sth: 5
   *             totalIVA: 18
   *             totalGeneral: 123
   *             products: [
   *               {
   *                 id: "prod-001",
   *                 name: "Web Development",
   *                 quantity: 1,
   *                 price: 100
   *               }
   *             ]
   *             note: "Payment due within 30 days"
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Factura creada exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "inv-12345"
   *                     name:
   *                       type: string
   *                       example: "Monthly Service Invoice"
   *                     status:
   *                       type: string
   *                       example: "draft"
   *                     products:
   *                       type: array
   *                       items:
   *                         type: object
   *                     currency:
   *                       type: string
   *                       example: "USD"
   *       400:
   *         description: Missing required fields or collector has no branch assigned
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Los campos son obligatorios: name, products"
   *       404:
   *         description: Collector profile not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Perfil del cobrador no encontrado"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Error al enviar"
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
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [draft, paid, pending, cancelled]
   *         description: Filter invoices by status
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Facturas recuperadas exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                       example: 10
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           name:
   *                             type: string
   *                           status:
   *                             type: string
   *                           products:
   *                             type: array
   *                           client:
   *                             type: object
   *                           business:
   *                             type: object
   *                           collector:
   *                             type: object
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Error al recuperar facturas"
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
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Detalles de la factura recuperados exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "inv-12345"
   *                     name:
   *                       type: string
   *                     note:
   *                       type: string
   *                     status:
   *                       type: string
   *                     products:
   *                       type: array
   *                     client:
   *                       type: object
   *                     business:
   *                       type: object
   *                     collector:
   *                       type: object
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Factura no encontrada"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Error al recuperar los detalles de la factura"
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
   *               note:
   *                 type: string
   *                 description: Additional notes for the invoice
   *               products:
   *                 type: array
   *                 description: List of products in the invoice
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     price:
   *                       type: number
   *                     quantity:
   *                       type: number
   *               status:
   *                 type: string
   *                 enum: [draft, pending, cancelled]
   *                 description: Invoice status (cannot be changed to paid)
   *               sth:
   *                 type: number
   *                 description: STH amount
   *               subtotal:
   *                 type: number
   *                 description: Subtotal amount
   *               totalGeneral:
   *                 type: number
   *                 description: Total amount including taxes
   *               totalIVA:
   *                 type: number
   *                 description: Total VAT amount
   *           example:
   *             name: "Updated Invoice Name"
   *             status: "pending"
   *             subtotal: 200
   *             sth: 10
   *             totalIVA: 36
   *             totalGeneral: 246
   *             products: [
   *               {
   *                 id: "prod-001",
   *                 name: "Web Development",
   *                 quantity: 2,
   *                 price: 100
   *               }
   *             ]
   *             note: "Updated payment terms"
   *     responses:
   *       200:
   *         description: Invoice updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Factura actualizada exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     status:
   *                       type: string
   *                     products:
   *                       type: array
   *       404:
   *         description: Invoice not found or unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Factura no encontrada o no tienes permiso para actualizarla"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Error al actualizar la factura"
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
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [draft, paid, pending, cancelled]
   *         description: Filter invoices by status
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Facturas recuperadas exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                       example: 25
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           name:
   *                             type: string
   *                           status:
   *                             type: string
   *                           products:
   *                             type: array
   *                           client:
   *                             type: object
   *                           business:
   *                             type: object
   *                           collector:
   *                             type: object
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Error al recuperar facturas"
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


  /** *********************************************************************************
   ************************************************************************************
   * CLIENTS
   **********************************************************************************
   **********************************************************************************/

  
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
      dateTimePayment
    } = req.body;

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

      if (!user) return sendResponse(res, 404, true, "Usuario no encontrado");
      if (!business) return sendResponse(res, 404, true, "Empresa no encontrada");
      if (!invoice) return sendResponse(res, 404, true, "Factura no encontrada o no autorizada para actualizar");
      if (!userProfile) return sendResponse(res, 404, true, "Perfil del usuario pagador no existe");

      // Generar un número de comprobante único
      const voucherNumber = `ST-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      
      // Crear registro de pago
      const payment = await Payment.create({
        amount: invoice.totalGeneral,
        currency: 'CLP', // Moneda de Chile
        status: 'pending',
        paymentDate: dateTimePayment || new Date(),
        transactionReference: voucherNumber,
        description: `Pago de factura ${invoice.name} de la empresa ${business.name}`,
        voucherNumber: voucherNumber,
        metadata: JSON.stringify({
          invoice_id: invoice.id,
          business_id: business.id,
          payer_id: clientId,
          collector_id: userId
        }),
        invoiceId: invoice.id,
        payerId: clientId,
        businessId: business.id
      });

      // Actualizar la factura a estado pagado
      await Invoice.update({
        status: invoiceStatusEnum.PAID,
        clientId: clientId,
        dateTimePayment: dateTimePayment || new Date(),
        voucherNumber: voucherNumber,
      }, {
        where: {
          id: invoiceId,
        },
      });

      // Recuperar la factura pagada con sus productos
      const updatedInvoice = await Invoice.findByPk(invoiceId);
      updatedInvoice.products = JSON.parse(updatedInvoice.products);

      // Devolver información completa
      const responseData = {
        invoice: updatedInvoice,
        payment: payment
      };

      return sendResponse(res, 200, false, "Factura pagada exitosamente", responseData);
    } catch (error) {
      console.error("Error al pagar la factura:", error);
      return sendResponse(res, 500, true, "Error al pagar la factura", error.message || "Unknown error");
    }
  }

}