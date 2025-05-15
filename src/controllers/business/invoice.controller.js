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
   *                     discountType:
   *                       type: string
   *                       description: Type of discount
   *                     discountValue:
   *                       type: number
   *                       description: Value of discount
   *               discountType:
   *                 type: string
   *                 description: Type of discount for the entire invoice
   *               discountValue:
   *                 type: number
   *                 description: Value of discount for the entire invoice
   *               note:
   *                 type: string
   *                 description: Additional notes for the invoice
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *       400:
   *         description: Validation errors or missing required fields
   *       500:
   *         description: Server error
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
   * @swagger
   * /api/v1/invoices/{businessId}/getAll:
   *   get:
   *     summary: Get all invoices with optional filtering and pagination
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
    const result = await InvoiceService.getAllInvoices(req.params, req.query);
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }

  /**
   * @swagger
   * /api/v1/invoices/{businessId}/details/{invoiceId}:
   *   get:
   *     summary: Get details of a specific invoice
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
  // GET invoices/:businessId/details/:invoiceId
  static async getInvoiceDetails(req, res) {
    const result = await InvoiceService.getInvoicesDetails(req.params);
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }




  /**
   * @swagger
   * /api/v1/invoices/{businessId}/update/{invoiceId}:
   *   put:
   *     summary: Update an invoice
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
   *                 enum: [draft, paid, pending, cancelled]
   *                 description: Invoice status
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
  // PUT invoices/:businessId/update/:invoiceId
  static async updateInvoice(req, res) {
    const result = await InvoiceService.updatedInvoice(req.params, req.body, req.user)
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
  }



  /**
   * @swagger
   * /api/v1/invoices/{businessId}/updateStatusToPaid/{invoiceId}:
   *   post:
   *     summary: Update invoice status to paid
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
   *             required:
   *               - clientId
   *               - employeeId
   *             properties:
   *               clientId:
   *                 type: string
   *                 description: ID of the client who paid the invoice
   *               employeeId:
   *                 type: string
   *                 description: ID of the employee who paid the invoice
   *     responses:
   *       200:
   *         description: Invoice status updated to paid successfully
   *       404:
   *         description: Invoice not found, unauthorized, or client/business not found
   *       500:
   *         description: Server error
   */
  // POST invoices/:businessId/updateStatusToPaid/:invoiceId
  static async updateInvoiceStatusToPaid(req, res) {
    const result = await InvoiceService.updateInvoiceStatusToPaid(req.params, req.body, req.user)
    return sendResponse(res, result.statusCode, result.error, result.message, result.data);
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




}