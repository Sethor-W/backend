import {
    Op
} from "sequelize";
import {
    invoiceStatusEnum
} from "../enum/invoiceStatus.enum.js";
import {
    sendResponse,
    validateRequiredFields
} from "../helpers/utils.js";
import {
    Business
} from "../models/business.js";
import {
    Invoice
} from "../models/invoice.js";
import {
    User
} from "../models/users.js";
import {
    UserBusiness
} from "../models/usersBusiness.js";
import {
    Profile
} from "../models/profile.js";
import {
    ProfileBusiness
} from "../models/profileBusiness.js";
import {
    Branch
} from "../models/branch.js";
import {
    EmployeesAssociatedBusinesses
} from "../models/employeesAssocitedBusiness.js";


export class InvoiceController {


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
            const requiredFields = [
                "name",
                "products",
            ];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(", ")}`);
            }

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
            });

            // Parsea los productos de cadena JSON a objeto
            newInvoice.products = JSON.parse(newInvoice.products);

            return sendResponse(res, 201, false, "Invoice created successfully", newInvoice);
        } catch (error) {
            console.error("Error submitting:", error);
            return sendResponse(res, 500, true, "Error submitting");
        }
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
                status: status
            } : {
                collectorId: userId
            };
            // Consultar las facturas del cobrador
            const invoices = await Invoice.findAndCountAll({
                where: whereCondition,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                    },
                ],
                limit: pageSize,
                offset: offset
            });

            invoices.rows.forEach(invoice => {
                invoice.products = JSON.parse(invoice.products);
            });

            // Enviar la respuesta con las facturas obtenidas
            return sendResponse(res, 200, false, "Invoices retrieved successfully", invoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            return sendResponse(res, 500, true, "Error fetching invoices");
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
                        collectorId: userId
                    }, ]
                },
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                        include: [{
                            model: Profile,
                            attributes: ['codeUser', 'name', 'lastName'],
                        }]
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                        include: [{
                                model: ProfileBusiness,
                                attributes: ['codeEmployee', 'name', 'lastName', 'additionalData'],
                            },

                        ],
                    },
                ]
            });

            if (!invoice) {
                return sendResponse(res, 404, true, "Invoice not found");
            }

            if (!invoice) {
                return sendResponse(res, 404, true, "Invoice not found");
            }

            // Convertir la cadena JSON de productos en un objeto
            invoice.products = await JSON.parse(invoice.products);
            invoice.collector.profiles_business.additionalData = await JSON.parse(invoice.collector.profiles_business.additionalData);
            invoice.collector.profiles_business.additionalData.branch.operatingHours = await JSON.parse(invoice.collector.profiles_business.additionalData.branch.operatingHours);

            // Elimnar llaves inecesarias
            delete invoice.collector.profiles_business.additionalData.employeeSchedule;

            // Enviar la respuesta con los detalles de la factura
            return sendResponse(res, 200, false, "Invoice details retrieved successfully", invoice);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            return sendResponse(res, 500, true, "Error fetching invoice details");
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
            note
        } = req.body;

        try {
            // Verificar si la factura existe y pertenece al collector
            const invoice = await Invoice.findOne({
                where: {
                    id: invoiceId,
                    collectorId: userId,
                    status: {
                        [Op.ne]: invoiceStatusEnum.PAID
                    }
                }
            });

            if (!invoice) {
                return sendResponse(res, 404, true, "Invoice not found or you don't have permission to update it");
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
                products: JSON.stringify(products) || invoice.products
            }, {
                where: {
                    id: invoiceId
                }
            });

            // Recuperar la factura actualizada
            const updatedInvoice = await Invoice.findByPk(invoiceId);
            updatedInvoice.products = JSON.parse(invoice.products);

            // Enviar la respuesta con la factura actualizada
            return sendResponse(res, 200, false, "Invoice updated successfully", updatedInvoice);
        } catch (error) {
            console.error("Error updating invoice:", error);
            return sendResponse(res, 500, true, "Error updating invoice");
        }
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
                businessId
            } : {
                businessId
            };
            // Consultar las facturas del cobrador
            const invoices = await Invoice.findAndCountAll({
                where: whereCondition,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                        include: [{
                            model: Profile,
                            attributes: ['name', 'lastName'],
                        }]
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                        include: [{
                            model: ProfileBusiness,
                            attributes: ['codeEmployee', 'name', 'lastName'],
                        }]
                    },
                ],
                limit: pageSize,
                offset: offset
            });

            invoices.rows.forEach(invoice => {
                invoice.products = JSON.parse(invoice.products);
            });

            // Enviar la respuesta con las facturas obtenidas
            return sendResponse(res, 200, false, "Invoices retrieved successfully", invoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            return sendResponse(res, 500, true, "Error fetching invoices");
        }
    }

    /**
     * Get details of a specific invoice
     * GET invoices/:businessId/details/:invoiceId
     */
    static async getInvoiceDetails(req, res) {
        const {
            invoiceId
        } = req.params;

        try {
            // Buscar la factura por su ID
            const invoice = await Invoice.findByPk(invoiceId, {
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                        include: [{
                            model: Profile,
                            attributes: ['codeUser', 'name', 'lastName'],
                        }]
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                        include: [{
                                model: ProfileBusiness,
                                attributes: ['codeEmployee', 'name', 'lastName', 'additionalData'],
                            },

                        ],
                    },
                ]
            });

            if (!invoice) {
                return sendResponse(res, 404, true, "Invoice not found");
            }

            // Convertir la cadena JSON de productos en un objeto
            invoice.products = await JSON.parse(invoice.products);
            invoice.collector.profiles_business.additionalData = await JSON.parse(invoice.collector.profiles_business.additionalData);
            invoice.collector.profiles_business.additionalData.branch.operatingHours = await JSON.parse(invoice.collector.profiles_business.additionalData.branch.operatingHours);

            // Elimnar llaves inecesarias
            delete invoice.collector.profiles_business.additionalData.employeeSchedule;

            // Enviar la respuesta con los detalles de la factura
            return sendResponse(res, 200, false, "Invoice details retrieved successfully", invoice);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            return sendResponse(res, 500, true, "Error fetching invoice details");
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
                    status: invoiceStatusEnum.PAID
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                        include: [{
                            model: Profile,
                            attributes: ['codeUser', 'name', 'lastName'],
                        }]
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                    },
                ],
                limit: pageSize,
                offset: offset
            });

            invoices.rows.forEach(async(invoice) => {
                invoice.products = JSON.parse(invoice.products);
            });


            // Enviar la respuesta con las facturas obtenidas
            return sendResponse(res, 200, false, "Invoices retrieved successfully", invoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            return sendResponse(res, 500, true, "Error fetching invoices");
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
                    clientId: userId
                },
                include: [{
                        model: User,
                        as: 'client',
                        attributes: ['id', 'email'],
                        include: [{
                            model: Profile,
                            attributes: ['codeUser', 'name', 'lastName'],
                        }]
                    },
                    {
                        model: Business
                    },
                    {
                        model: UserBusiness,
                        as: 'collector',
                        attributes: ['id', 'email'],
                        include: [{
                                model: ProfileBusiness,
                                attributes: ['codeEmployee', 'name', 'lastName', 'additionalData'],
                            },

                        ],
                    }
                ]
            });

            if (!invoice) {
                return sendResponse(res, 404, true, "Invoice not found");
            }

            // Convertir la cadena JSON de productos en un objeto
            invoice.products = await JSON.parse(invoice.products);
            invoice.collector.profiles_business.additionalData = await JSON.parse(invoice.collector.profiles_business.additionalData);
            invoice.collector.profiles_business.additionalData.branch.operatingHours = await JSON.parse(invoice.collector.profiles_business.additionalData.branch.operatingHours);

            // Elimnar llaves inecesarias
            delete invoice.collector.profiles_business.additionalData.employeeSchedule;

            // Enviar la respuesta con los detalles de la factura
            return sendResponse(res, 200, false, "Invoice details retrieved successfully", invoice);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            return sendResponse(res, 500, true, "Error fetching invoice details");
        }
    }


}