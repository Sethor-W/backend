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

export class InvoiceClientController {

  /**
   * @swagger
   * /api/v1/invoices/client/getAll:
   *   get:
   *     summary: Get all paid invoices for a client with pagination
   *     tags: [Client Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Facturas recuperadas exitosamente
   *                 data:
   *                   type: object
   *                   properties:
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         currentPage:
   *                           type: integer
   *                         totalPages:
   *                           type: integer
   *       500:
   *         description: Server error
   */
  // GET invoices/client/getAll?page=1
  static async getAllInvoices(req, res) {
    const {
      userId
    } = req.user;
    let {
      page
    } = req.query;

    try {

      page = parseInt(page, 10) || 1;  // Si `page` no es válido, asignar 1 como valor predeterminado
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

      const response = {
        rows: invoices.rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(invoices.count / pageSize),
        },
      }
      // Enviar la respuesta con las facturas obtenidas
      return sendResponse(
        res,
        200,
        false,
        "Facturas recuperadas exitosamente",
        response
      );
    } catch (error) {
      console.error("Error al recuperar facturas:", error);
      return sendResponse(res, 500, true, "Error al recuperar facturas");
    }
  }


  /**
   * @swagger
   * /api/v1/invoices/client/details/{invoiceId}:
   *   get:
   *     summary: Get details of a specific invoice for a client
   *     tags: [Client Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the invoice to retrieve
   *     responses:
   *       200:
   *         description: Invoice details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *                 error:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Detalles de la factura recuperados exitosamente
   *                 data:
   *                   type: object
   *                   description: Invoice details including client, business and collector information
   *       404:
   *         description: Invoice not found
   *       500:
   *         description: Server error
   */
  // GET invoices/client/details/:invoiceId
  static async getInvoiceDetails(req, res) {
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