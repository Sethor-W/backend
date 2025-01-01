// src/services/auth.service.js
import { ProfileService } from "./profile.service.js";
import { BranchService } from "./branch.service.js";
import { CurrencyService } from "../common/currency.service.js";
import { discountTypeEnum } from "../../enum/discountType.enum.js";
import { Invoice } from "../../models/common/invoice.js";
import { invoiceStatusEnum } from "../../enum/invoiceStatus.enum.js";
import { Business } from "../../models/common/business.js";
import { UserBusiness } from "../../models/business/usersBusiness.js";
import { User } from "../../models/client/users.js";
import { Profile } from "../../models/client/profile.js";
import { ProfileBusiness } from "../../models/business/profileBusiness.js";
import { Op } from "sequelize";

export class InvoiceService {



    static async createInvoice(params, body, user) {
        const { businessId } = params;
        const { userId } = user;
        const { name, subtotal, sth, totalIVA, totalGeneral, products, note, discountType, discountValue } = body;

        // Obtener perfil del cobrador
        const profile = await ProfileService.getCollectorProfile(userId);
        // Obtener la sucursal
        const branch = await BranchService.getBranchFromProfile(profile);
        // Obtener la moneda del país
        const { currencyCode, currencyDetails } = await CurrencyService.getCurrencyFromCountry(branch.country_cca2);

        try {

            if (profile.profiles_business.additionalData) {
                // Crear la factura
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
                    discountType: discountType || discountTypeEnum.FIXED,
                    discountValue: discountValue,
                    totalIVA,
                    totalGeneral,
                    currency: currencyCode,
                });

                // Parsea los productos de cadena JSON a objeto
                newInvoice.products = JSON.parse(newInvoice.products);


                // Respuesta exitosa
                return {
                    error: false,
                    statusCode: 201,
                    message: "Factura creada exitosamente",
                    data: {
                        id: newInvoice.id,
                        name: newInvoice.name,
                        note: newInvoice.note,
                        status: newInvoice.status,
                        collectorId: newInvoice.collectorId,
                        businessId: newInvoice.businessId,
                        clientId: newInvoice.clientId,
                        products: newInvoice.products,
                        subtotal: newInvoice.subtotal,
                        sth: newInvoice.sth,
                        totalIVA: newInvoice.totalIVA,
                        totalGeneral: newInvoice.totalGeneral,
                        currency: newInvoice.currency,
                        discountValue: newInvoice.discountValue || 0,
                        discountType: newInvoice.discountType,
                        branchId: newInvoice.branchId,
                        createdAt: newInvoice.createdAt,
                        updatedAt: newInvoice.updatedAt,
                    },
                };

            } else {
                return {
                    error: true,
                    statusCode: 400,
                    message: "El cobrador no tiene una sucursal asignada",
                };
            }

        } catch (error) {
            console.error("Error al enviar:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al enviar",
            };
        }
    }



    static async getAllInvoices(params, query) {
        const { businessId } = params;
        let { status, page, search, branchId } = query;

        try {
            page = parseInt(page, 10) || 1;  // Si `page` no es válido, asignar 1 como valor predeterminado
            const pageSize = 15;
            const offset = (page - 1) * pageSize;


            // Configuración de criterios de consulta
            const whereCondition = { businessId };
            if (status) whereCondition.status = status;
            if (branchId) whereCondition.branchId = branchId;
            if (search) {
                whereCondition[Op.or] = [
                    { '$collector.profiles_business.name$': { [Op.like]: `%${search}%` } },
                    { '$collector.profiles_business.lastName$': { [Op.like]: `%${search}%` } },
                ];
            }

            // Ordenar las facturas según el estado de pago
            const order = status === "paid"
                ? [["dateTimePayment", "DESC"]]
                : [["createdAt", "DESC"]]


            // Consultar las facturas
            const invoices = await Invoice.findAndCountAll({
                where: whereCondition,
                order,
                include: [
                    {
                        model: User,
                        as: "client",
                        attributes: ["id", "email"],
                        include: [{ model: Profile, attributes: ["name", "lastName"] }],
                    },
                    { model: Business },
                    {
                        model: UserBusiness,
                        as: "collector",
                        attributes: ["id", "email"],
                        include: [{ model: ProfileBusiness, attributes: ["codeEmployee", "name", "lastName"] }],
                    },
                ],
                limit: pageSize,
                offset: offset,
            });

            // Parsear los productos de las facturas
            invoices.rows.forEach((invoice) => {
                invoice.products = JSON.parse(invoice.products);
            });

            return {
                error: false,
                statusCode: 200,
                message: "Facturas recuperadas exitosamente",
                data: {
                    invoices: invoices.rows.map((invoice) => ({
                        id: invoice.id,
                        employee: {
                            codeEmployee: invoice.collector?.profiles_business?.codeEmployee,
                            name: invoice.collector?.profiles_business?.name,
                            lastName: invoice.collector?.profiles_business?.lastName || invoice.collector?.profiles_business?.dataValues?.lastName, // Acceso alternativo a lastName
                            email: invoice.collector?.email,
                        },
                        client: {
                            name: invoice.client?.profile?.name || null,
                            lastName: invoice.client?.profile?.lastName || invoice.client?.profile?.dataValues?.lastName || null, // Acceso alternativo a lastName
                        },
                        products: invoice?.products,
                        status: invoice.status, // O "pending"
                        branchId: invoice.branchId || null,
                        title: invoice.name || "",
                        description: invoice.note || "",
                        discountValue: invoice.discountValue || 0,
                        discountType: invoice.discountType,
                        total: invoice.totalGeneral,
                        date: invoice.dateTimePayment ? invoice.dateTimePayment.toISOString() : null,
                        createdAt: invoice.createdAt.toISOString(),
                    })),
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(invoices.count / pageSize),
                    },
                },
            };
        } catch (error) {
            console.error("Error al recuperar facturas:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al enviar",
            };
        }
    }



    static async getInvoicesDetails(params) {
        const { invoiceId } = params;

        try {
            // Buscar la factura por su ID
            const invoice = await Invoice.findByPk(invoiceId, {
                include: [
                    {
                        model: User,
                        as: "client",
                        attributes: ["id", "email"],
                        include: [{ model: Profile, attributes: ["codeUser", "name", "lastName"] }],
                    },
                    {
                        model: Business,
                    },
                    {
                        model: UserBusiness,
                        as: "collector",
                        attributes: ["id", "email"],
                        include: [{ model: ProfileBusiness, attributes: ["codeEmployee", "name", "lastName"] }],
                    },
                ],
            });

            if (!invoice) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Factura no encontrada",
                }
            }

            // Convertir la cadena JSON de productos en un objeto
            invoice.products = await JSON.parse(invoice.products);

            return {
                error: false,
                statusCode: 200,
                message: "Detalles de la factura recuperados exitosamenteaaa",
                data: {
                    id: invoice.id,
                    employee: {
                        codeEmployee: invoice.collector?.profiles_business?.codeEmployee,
                        name: invoice.collector?.profiles_business?.name,
                        lastName: invoice.collector?.profiles_business?.lastName || invoice.collector?.profiles_business?.dataValues?.lastName, // Acceso alternativo a lastName
                        email: invoice.collector?.email,
                    },
                    client: {
                        name: invoice.client?.profile?.name || null,
                        lastName: invoice.client?.profile?.lastName || invoice.client?.profile?.dataValues?.lastName || null, // Acceso alternativo a lastName
                    },
                    products: invoice?.products,
                    status: invoice.status, // O "pending"
                    branchId: invoice.branchId || null,
                    title: invoice.name || "",
                    description: invoice.note || "",
                    discountValue: invoice.discountValue || 0,
                    discountType: invoice.discountType,
                    total: invoice.totalGeneral,
                    date: invoice.dateTimePayment ? invoice.dateTimePayment.toISOString() : null,
                    createdAt: invoice.createdAt.toISOString(),
                },
            };
        } catch (error) {
            console.error("Error al recuperar la factura:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al enviar",
            };
        }
    }



}
