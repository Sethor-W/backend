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
import { calculateInvoiceValues } from "../../helpers/invoice.helper.js";
import { rolesEnum } from "../../enum/roles.enum.js";
import { StatisticsController } from "../../controllers/statistics.controller.js";
import { OneClickCard } from "../../models/client/oneClickCard.js";

export class InvoiceService {



    static async createInvoice(params, body, user) {
        const { businessId } = params;
        const { userId } = user;
        const { name, products, note, discountType, discountValue } = body;

        try {
            // Validar tipo de descuento
            if (discountType && !Object.values(discountTypeEnum).includes(discountType)) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Tipo de descuento inválido. Debe ser 'fixed' o 'percentage'",
                };
            }

            // Validar estructura de productos
            if (!Array.isArray(products) || products.length === 0) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Los productos deben ser un arreglo no vacío",
                };
            }

            // Validar campos requeridos de cada producto
            for (const product of products) {
                if (!product.id || !product.name || !product.price || !product.quantity) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: "Cada producto debe tener id, nombre, precio y cantidad",
                    };
                }

                // Validar campos numéricos
                if (typeof product.price !== 'number' || product.price < 0) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: "El precio del producto debe ser un número positivo",
                    };
                }

                if (typeof product.quantity !== 'number' || product.quantity < 1) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: "La cantidad del producto debe ser un número positivo",
                    };
                }

                // Validar campos de descuento si están presentes
                if (product.discountType && !Object.values(discountTypeEnum).includes(product.discountType)) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: "El tipo de descuento del producto debe ser 'fixed' o 'percentage'",
                    };
                }

                if (product.discountValue && (typeof product.discountValue !== 'number' || product.discountValue < 0)) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: "El valor del descuento del producto debe ser un número positivo",
                    };
                }
            }

            // Calcular valores de la factura usando función auxiliar
            const { subtotal, generalDiscount, sth, totalIVA, totalGeneral } = calculateInvoiceValues(products, discountType, discountValue);

            // Validar perfil del cobrador y obtener información de la sucursal
            const profile = await ProfileService.getCollectorProfile(userId);
            const branch = await BranchService.getBranchFromProfile(profile);
            const { currencyCode } = await CurrencyService.getCurrencyFromCountry(branch.country_cca2);

            if (!profile.profiles_business) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "El cobrador no tiene una sucursal asignada",
                };
            }

            // Crear registro de factura
            const newInvoice = await Invoice.create({
                name,
                note,
                status: invoiceStatusEnum.DRAFT,
                collectorId: userId,
                businessId: businessId,
                clientId: null,
                products: JSON.stringify(products),
                subtotal: subtotal || 0,
                sth: sth || 0,
                discountType: discountType || discountTypeEnum.FIXED,
                discountValue: discountValue || 0,
                totalIVA: totalIVA || 0,
                totalGeneral: totalGeneral || 0,
                currency: currencyCode,
                branchId: branch.id
            });

            // Convertir productos de vuelta a objeto para la respuesta
            const invoiceData = {
                ...newInvoice.toJSON(),
                products: JSON.parse(newInvoice.products) // Convertir productos de vuelta a arreglo
            };

            return {
                error: false,
                statusCode: 201,
                message: "Factura creada exitosamente",
                data: invoiceData
            };

        } catch (error) {
            console.error("Error al crear la factura:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al crear la factura",
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
                        business: invoice?.business,
                        products: invoice?.products,
                        status: invoice.status, // O "pending"
                        branchId: invoice.branchId || null,
                        title: invoice.name || "",
                        description: invoice.note || "",
                        discountValue: invoice.discountValue || 0,
                        discountType: invoice.discountType,
                        date: invoice.dateTimePayment ? invoice.dateTimePayment.toISOString() : null,

                        sth: invoice.sth || 0,
                        totalIva: invoice.totalIVA || 0,
                        subtotal: invoice.subtotal || 0,
                        total: invoice.totalGeneral,

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


    
    static async updatedInvoice(params, body, user) {
        const { invoiceId } = params;
        const { userId } = user;
        const { name, products, note, discountType, discountValue } = body;

        try {

            let whereClause = {
                id: invoiceId,
                status: {
                    [Op.ne]: invoiceStatusEnum.PAID,
                },
            };
        
            // Si el usuario no es admin ni owner, agregamos la validación por collectorId
            if (!(user.roles.includes(rolesEnum.OWNER) || user.roles.includes(rolesEnum.ADMIN))) {
                whereClause.collectorId = userId;
            }
            
            const invoice = await Invoice.findOne({ where: whereClause });

            if (!invoice) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Factura no encontrada o no tienes permiso para actualizarla",
                };
            }


            // Calcular los valores solo si se actualizan los productos o los descuentos
            let subtotal = invoice?.subtotal;
            let generalDiscount = invoice?.generalDiscount;
            let sth = invoice?.sth;
            let totalIVA = invoice?.totalIVA;
            let totalGeneral = invoice?.totalGeneral;

            if (products || discountType || discountValue) {
                // Llamar a la función de cálculo modularizada si hay cambios en los productos o descuentos
                const { 
                    subtotal: newSubtotal,
                    generalDiscount: newGeneralDiscount,
                    sth: newSth,
                    totalIVA: newTotalIVA,
                    totalGeneral: newTotalGeneral
                } = calculateInvoiceValues(
                    products || JSON.parse(invoice.products),
                    discountType || invoice.discountType,
                    discountValue || invoice.discountValue
                );

                console.log("newSubtotal", newSubtotal);
                console.log("newGeneralDiscount", newGeneralDiscount);
                console.log("newSth", newSth);
                console.log("newTotalIVA", newTotalIVA);
                console.log("newTotalGeneral", newTotalGeneral);
                
                subtotal = newSubtotal;
                generalDiscount = newGeneralDiscount;
                sth = newSth;
                totalIVA = newTotalIVA;
                totalGeneral = newTotalGeneral;
            }

            // Actualizar la factura utilizando el método update
            await Invoice.update({
                name: name || invoice.name,
                note: note || invoice.note,
                products: JSON.stringify(products) || invoice.products,
                subtotal,
                sth,
                discountType: discountType || invoice.discountType,
                discountValue: discountValue || invoice.discountValue,
                totalIVA,
                totalGeneral,
            }, {
                where: {
                    id: invoiceId,
                },
            });

            // Recuperar la factura actualizada
            const updatedInvoice = await Invoice.findByPk(invoiceId);
            updatedInvoice.products = JSON.parse(invoice.products);

            // Enviar la respuesta con la factura actualizada
            return {
                error: false,
                statusCode: 200,
                message: "Factura actualizada exitosament",
                data: updatedInvoice,
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


    static async updateInvoiceStatusToPaid(params, body, user) {
        const { invoiceId, businessId } = params;
        const { clientId, employeeId } = body;

        try {
            // Verificar existencia del usuario y empresa
            const [user, business, invoice, userProfile, oneClickCard] = await Promise.all([
                User.findByPk(clientId), // Buscar el usuario
                Business.findOne({
                    where: {
                        id: businessId
                    }
                }), // Buscar la empresa
                Invoice.findOne({
                    where: {
                        id: invoiceId,
                        collectorId: employeeId,
                        status: {
                            [Op.ne]: invoiceStatusEnum.PAID
                        }
                    }
                }), // Buscar la factura
                Profile.findOne({
                    where: {
                        userId: clientId
                    }
                }), // Buscar el perfil del usuario
                OneClickCard.findOne({
                    where: {
                        userId: clientId
                    }
                }) // Buscar la tarjeta registrada del usuario
            ]);

            if (!user) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Usuario no encontrado"
                };
            }
            if (!business) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Empresa no encontrada"
                };
            }
            if (!invoice) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Factura no encontrada o no autorizada para actualizar"
                };
            }
            if (!userProfile) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Perfil del usuario pagador no existe"
                };
            }
            if (!oneClickCard) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "No se encontró tarjeta registrada para el usuario"
                };
            }

            // Preparar los headers para la petición a Transbank
            const headers = {
                "Tbk-Api-Key-Id": process.env.TRANSBANK_API_KEY_ID || "",
                "Tbk-Api-Key-Secret": process.env.TRANSBANK_API_KEY_SECRET || "",
                "Content-Type": "application/json",
                "User-Agent": "PostmanRuntime/7.43.2",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            };

            // Realizar petición a Transbank para autorizar el pago
            const response = await axios.post(
                `${BASE_URL}/rswebpaytransaction/api/oneclick/v1.2/transactions`,
                {
                    username: user.email,
                    tbk_user: oneClickCard.tbk_user,
                    buy_order: `${invoiceId}`,
                    details: [{
                        commerce_code: process.env.TRANSBANK_COMMERCE_CODE,
                        buy_order: `${invoice?.voucherNumber}`,
                        amount: `${invoice.totalGeneral}`,
                        installments_number: 1
                    }]
                },
                { headers }
            );

            // Generar un número de comprobante único
            const voucherNumber = `ST-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

            // Actualizar la factura a estado pagado
            await Invoice.update({
                status: invoiceStatusEnum.PAID,
                clientId: clientId,
                dateTimePayment: new Date(),
                voucherNumber: voucherNumber,
            }, {
                where: {
                    id: invoiceId,
                },
            });

            // Recuperar la factura pagada con sus productos y datos de la empresa
            const updatedInvoice = await Invoice.findByPk(invoiceId, {
                include: [
                    { model: Business },
                    {
                        model: User,
                        as: "client",
                        attributes: ["id", "email"],
                        include: [{ model: Profile, attributes: ["name", "lastName"] }],
                    },
                    {
                        model: UserBusiness,
                        as: "collector",
                        attributes: ["id", "email"],
                        include: [{ model: ProfileBusiness, attributes: ["codeEmployee", "name", "lastName"] }],
                    }
                ]
            });
            // updatedInvoice.products = JSON.parse(updatedInvoice.products);

            // Actualizar estadísticas si es necesario
            try {
                await StatisticsController.updateStatistics(businessId, updatedInvoice);
            } catch (statsError) {
                console.error("Error al actualizar estadísticas:", statsError);
                // Continuamos aunque falle la actualización de estadísticas
            }

            // Devolver información completa
            return {
                error: false,
                statusCode: 200,
                message: "Factura pagada exitosamente",
                data: {
                    invoice: updatedInvoice,
                    transaction: response?.data
                }
            };

        } catch (error) {
            console.error("Error al pagar la factura:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error al pagar la factura",
                data: error.message || "Unknown error"
            };
        }
    }




}
