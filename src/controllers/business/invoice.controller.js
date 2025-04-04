import { Op } from "sequelize";
import { invoiceStatusEnum } from "../../enum/invoiceStatus.enum.js";
import {
  calculateExpirationDate,
  sendResponse,
  validateRequiredFields
} from "../../helpers/utils.js";
import { Business } from "../../models/common/business.js";
import { Invoice } from "../../models/common/invoice.js";
import { User } from "../../models/client/users.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { Profile } from "../../models/client/profile.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Branch } from "../../models/common/branch.js";
import { EmployeesAssociatedBusinesses } from "../../models/business/employeesAssocitedBusiness.js";
import { PaymentController } from "../payment.controller.js";
import { InvoiceService } from "../../services/business/invoice.service.js";
import { body, validationResult } from "express-validator";
import { discountTypeEnum } from "../../enum/discountType.enum.js";

export class InvoiceBusinessController {

  /** *********************************************************************************
   ************************************************************************************
   * COLLECTORS
   **********************************************************************************
   **********************************************************************************/

  /**
   * Create a new invoice (status: draft)
   */
  // POST invoices/:businessId/create
  static async createInvoice(req, res) {
    body('name').notEmpty().withMessage('El campo "name" es obligatorio.');
    body('subtotal').isNumeric().withMessage('El campo "subtotal" debe ser un número.');
    // body('sth').isNumeric().withMessage('El campo "sth" debe ser un número.');
    // body('totalIVA').isNumeric().withMessage('El campo "totalIVA" debe ser un número.');
    // body('totalGeneral').isNumeric().withMessage('El campo "totalGeneral" debe ser un número.');
    body('products').isArray({ min: 1 }).withMessage('El campo "products" debe ser un arreglo no vacío.');
    body('products.*.id').notEmpty().withMessage('Cada producto debe tener un "id".');
    body('products.*.name').notEmpty().isString().withMessage('Cada producto debe tener un "name" válido.');
    body('products.*.price').notEmpty().isFloat({ min: 0 }).withMessage('Cada producto debe tener un "price" válido y positivo.');
    body('products.*.quantity').notEmpty().isNumeric({ min: 1 }).withMessage('Cada producto debe tener un "quantity" válido y positivo.');
    body('products.*.discountType').notEmpty().isString().withMessage('Cada producto debe tener un "discountType" válido.');
    body('products.*.discountValue').notEmpty().isFloat({ min: 0 }).withMessage('Cada producto debe tener un "discountValue" válido y positivo.');
    body('discountType').optional().isIn(Object.values(discountTypeEnum)).withMessage('El tipo de descuento no es válido.');
    body('discountValue').optional().isNumeric().withMessage('El valor del descuento debe ser un número.');
    body('note').optional().isString().withMessage('El campo "note" debe ser una cadena de texto.');

    // Validación de campos con express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, true, 'Errores de validación', errors.array());
    }
    const result = await InvoiceService.createInvoice(req.param, req.body, req.user)
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }


  /** *********************************************************************************
   ************************************************************************************
   * MANGERS and OWNERS
   **********************************************************************************
   **********************************************************************************/

  /**
   * Get invoices by collector sorted by status (draft or paid) and paginated
   */
  // GET invoices/:businessId/getAll?page=1&status=draft
  static async getAllInvoices(req, res) {
    const result = await InvoiceService.getAllInvoices(req.params, req.query);
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }

  /**
   * Get details of a specific invoice
   * GET invoices/:businessId/details/:invoiceId
   */
  static async getInvoiceDetails(req, res) {
    const result = await InvoiceService.getInvoicesDetails(req.params);
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }




  /**
   * Update invoice by collector
   * PUT invoices/:businessId/collector/update/:invoiceId
   */
  static async updateInvoice(req, res) {
    const result = await InvoiceService.updatedInvoice(req.params, req.body, req.user)
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }






























  /**
   * Get invoices by collector sorted by status (draft or paid) and paginated
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
   * Get details of a specific invoice by collector
   * GET invoices/:businessId/collector/details/:invoiceId
   */
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
          },],
        },
        include: [{
          model: User,
          as: "client",
          attributes: ["id", "email"],
          include: [{
            model: Profile,
            attributes: ["codeUser", "name", "lastName"],
          },],
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
          },],
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
        "Detalles de la factura recuperados exitosamente, controller",
        invoice
      );
    } catch (error) {
      console.error("Error al recuperar los detalles de la factura:", error);
      return sendResponse(res, 500, true, "Error al recuperar los detalles de la factura");
    }
  }

  /**
   * Update invoice by collector
   * PUT invoices/:businessId/collector/update/:invoiceId
   */
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
   * CLIENTS
   **********************************************************************************
   **********************************************************************************/

  /**
   * Get invoices by client with paginated
   */
  // GET invoices/client/getAll?page=1
  static async getAllInvoicesByClient(req, res) {
    const {
      userId
    } = req.user;
    const {
      page
    } = req.query;

    try {
      // Configurar opciones de paginación
      const pageSize = 15;
      const offset = (page - 1) * pageSize;

      // Consultar las facturas del cobrador
      const invoices = await Invoice.findAndCountAll({
        where: {
          clientId: userId,
          status: invoiceStatusEnum.PAID,
        },
        order: [
          ["dateTimePayment", "DESC"]
        ],
        include: [{
          model: User,
          as: "client",
          attributes: ["id", "email"],
          include: [{
            model: Profile,
            attributes: ["codeUser", "name", "lastName"],
          },],
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

      invoices.rows.forEach(async (invoice) => {
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
   * Get details of a specific invoice by client
   * GET invoices/client/details/:invoiceId
   */
  static async getInvoiceDetailsByClient(req, res) {
    const {
      invoiceId
    } = req.params;
    const {
      userId
    } = req.user;

    try {
      // Buscar la factura por su ID y el ID del cliente
      const invoice = await Invoice.findOne({
        where: {
          id: invoiceId,
          clientId: userId,
        },
        include: [{
          model: User,
          as: "client",
          attributes: ["id", "email"],
          include: [{
            model: Profile,
            attributes: ["codeUser", "name", "lastName"],
          },],
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
          },],
        },
        ],
      });

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
   * Pay the invoice by collector
   * POST invoices/:businessId/collector/pay/:invoiceId
   */
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