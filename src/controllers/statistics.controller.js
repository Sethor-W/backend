import {
    calculatePercentageChange,
    roundDownToTwoDecimals,
    sendResponse
} from "../helpers/utils.js";
import {
    SoldProductStatistic
} from "../models/business/soldProductStatistic.js";
import {
    BuyingUserStatistic
} from "../models/business/buyingUserStatistic.js";
import {
    EarningsStatistic
} from "../models/business/earningsStatistic.js";
import {
    Sequelize
} from "sequelize";
import {
    sequelize
} from "../config/database.config.js";
import {
    invoiceStatusEnum
} from "../enum/invoiceStatus.enum.js";
import {
    Invoice
} from "../models/common/invoice.js";

export class StatisticsController {

    /*** *************************************************
     * ***************************************************
     * Método genérico para obtener estadísticas
     * *************************************************** 
     ************************************************* ***/
    static async updateStatistics(businessId, invoice) {
        const date = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

        // Actualizar estadísticas de ganancias
        await EarningsStatistic.upsert({
            businessId,
            date,
            totalEarnings: sequelize.literal(`totalEarnings + ${invoice.totalGeneral}`)
        });

        // Actualizar estadísticas de usuarios compradores
        await BuyingUserStatistic.upsert({
            businessId,
            userId: invoice.clientId,
            date,
            amountPaidByTheUser: sequelize.literal(`amountPaidByTheUser + ${invoice.totalGeneral}`)
        });

        // Actualizar estadísticas de productos vendidos
        const products = JSON.parse(invoice.products);
        for (const product of products) {
            await SoldProductStatistic.upsert({
                businessId,
                date,
                soldCount: sequelize.literal(`soldCount + ${product.quantity}`)
            });
        }
    }

    static async getStatistics(req, res, StatisticModel, valueField) {

        const {
            businessId
        } = req.params;
        const currentMonthStart = Sequelize.literal("DATE_FORMAT(NOW(), '%Y-%m-01')");
        const lastMonthStart = Sequelize.literal("DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01')");
        const lastMonthEnd = Sequelize.literal("DATE_FORMAT(NOW(), '%Y-%m-01') - INTERVAL 1 SECOND");

        try {
            const currentMonthData = await StatisticModel.findOne({
                where: {
                    businessId: businessId,
                    date: {
                        [Sequelize.Op.gte]: currentMonthStart
                    }
                },
                order: [
                    ['date', 'DESC']
                ]
            });

            const lastMonthData = await StatisticModel.findOne({
                where: {
                    businessId: businessId,
                    date: {
                        [Sequelize.Op.gte]: lastMonthStart,
                        [Sequelize.Op.lt]: lastMonthEnd
                    }
                },
                order: [
                    ['date', 'DESC']
                ]
            });

            const currentValue = currentMonthData ? currentMonthData[valueField] : 0;
            const lastValue = lastMonthData ? lastMonthData[valueField] : 0;
            const percentageChange = lastValue === 0 ? (currentValue === 0 ? 0 : 100) : ((currentValue - lastValue) / lastValue) * 100;

            return {
                currentValue,
                percentageChange,
                lastValue,
            };
        } catch (error) {
            console.error('Error retrieving statistics data:', error);
            throw new Error('Could not retrieve statistics data');
        }
    }

    /**
     * Obtener todas las estadisticas
     */
    // GET /statistics/business/:businessId/getAll
    static async getAllStatistics(req, res) {
        const {
            businessId
        } = req.params;


        // Definir los literales para las fechas
        const startOfMonth = Sequelize.literal("DATE_FORMAT(NOW(), '%Y-%m-01')"); // mes actual
        const endOfMonth = Sequelize.literal("LAST_DAY(NOW())"); // mes actual
        const startOfLastMonth = Sequelize.literal("DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01')"); // mes anterior
        const endOfLastMonth = Sequelize.literal("LAST_DAY(NOW() - INTERVAL 1 MONTH)"); // mes anterior
        // Definir el rango de fechas para la semana actual y la semana anterior
        const startOfWeek = Sequelize.literal("DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)"); // Inicio de la semana actual
        const endOfWeek = Sequelize.literal("DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)"); // Fin de la semana actual
        const startOfLastWeek = Sequelize.literal("DATE_SUB(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)"); // Inicio de la semana pasada
        const endOfLastWeek = Sequelize.literal("DATE_ADD(DATE_SUB(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY), INTERVAL 6 DAY)"); // Fin de la semana pasada


        try {

            // Consultas del Subtotal del Mes Actual y Anterior
            const [currentMonthSubtotal, lastMonthSubtotal] = await Promise.all([
                Invoice.sum('subtotal', {
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfMonth,
                            [Sequelize.Op.lte]: endOfMonth,
                        },
                    },
                }),
                Invoice.sum('subtotal', {
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfLastMonth,
                            [Sequelize.Op.lte]: endOfLastMonth,
                        },
                    },
                })
            ]);

            // Redondear hacia abajo a dos decimales
            const roundedCurrentMonthSubtotal = roundDownToTwoDecimals(currentMonthSubtotal || 0);
            const roundedLastMonthSubtotal = roundDownToTwoDecimals(lastMonthSubtotal || 0);

            // Calcular el porcentaje de cambio del subtotal mensual
            const percentageChange = calculatePercentageChange(roundedCurrentMonthSubtotal, roundedLastMonthSubtotal);


            // Consultar el número de clientes únicos y totales para la semana actual y la semana anterior
            const [uniqueClientsWeek, uniqueClientsLastWeek, clientsWeek, clientsLastWeek] = await Promise.all([
                Invoice.count({
                    distinct: true,
                    col: 'clientId',
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfWeek,
                            [Sequelize.Op.lte]: endOfWeek,
                        },
                    },
                }),
                Invoice.count({
                    distinct: true,
                    col: 'clientId',
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfLastWeek,
                            [Sequelize.Op.lte]: endOfLastWeek,
                        },
                    },
                }),
                Invoice.count({
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfWeek,
                            [Sequelize.Op.lte]: endOfWeek,
                        },
                    },
                }),
                Invoice.count({
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfLastWeek,
                            [Sequelize.Op.lte]: endOfLastWeek,
                        },
                    },
                })
            ]);

            // Calcular el porcentaje de cambio en el número de clientes únicos
            const uniqueClientsChange = calculatePercentageChange(uniqueClientsWeek, uniqueClientsLastWeek);

            // Calcular el porcentaje de cambio en el número total de clientes
            const clientsChange = calculatePercentageChange(clientsWeek, clientsLastWeek);


            // Consultar los productos vendidos en la semana actual y en la semana anterior
            const [productsWeek, productsLastWeek] = await Promise.all([
                Invoice.findAll({
                    attributes: ['products'],
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfWeek,
                            [Sequelize.Op.lte]: endOfWeek,
                        },
                    },
                }),
                Invoice.findAll({
                    attributes: ['products'],
                    where: {
                        status: invoiceStatusEnum.PAID,
                        businessId: businessId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfLastWeek,
                            [Sequelize.Op.lte]: endOfLastWeek,
                        },
                    },
                })
            ]);

            // Función para contar el total de productos en las facturas
            const countProducts = (invoices) => {
                let totalCount = 0;
                invoices.forEach(invoice => {
                    // Parsear el campo 'products' desde JSON stringificado
                    const products = JSON.parse(invoice.dataValues.products);
                    totalCount += products.length; // Contar el número de productos en la factura
                });
                return totalCount;
            };

            const soldProductsWeek = countProducts(productsWeek);
            const soldProductsLastWeek = countProducts(productsLastWeek);

            // Calcular el porcentaje de cambio en el número de productos vendidos
            const soldProductChange = calculatePercentageChange(soldProductsWeek, soldProductsLastWeek);


            // Enviar la respuesta con todas las estadísticas calculadas
            return sendResponse(res, 200, false, 'All Estadísticas recuperadas exitosamente', {
                soldProducts: {
                    soldProductsWeek,
                    soldProductsLastWeek,
                    soldProductChange
                },
                buyingUsers: {
                    uniqueClientsWeek: uniqueClientsWeek,
                    uniqueClientsChange,
                    clientsWeek: clientsWeek,
                    clientsChange,
                },
                monthlyEarnings: {
                    currentMonthSubtotal: roundedCurrentMonthSubtotal,
                    lastMonthSubtotal: roundedLastMonthSubtotal,
                    percentageChange,
                },
            });
        } catch (error) {
            console.error('Error retrieving all statistics:', error);
            return sendResponse(res, 500, true, 'Could not retrieve all statistics');
        }
    }

    /**
     * Obtener todas las estadisticas
     */
    // GET /statistics/business/:businessId/getAll
    // static async getAllStatistics(req, res) {
    //     try {
    //         // Obtener estadísticas de productos vendidos
    //         const soldProducts = await StatisticsController.getStatistics(req, res, SoldProductStatistic, 'soldCount');

    //         // Obtener estadísticas de usuarios que han comprado
    //         const buyingUsers = await StatisticsController.getStatistics(req, res, BuyingUserStatistic, 'userCount');

    //         // Obtener estadísticas de ganancias mensuales
    //         const monthlyEarnings = await StatisticsController.getStatistics(req, res, EarningsStatistic, 'totalEarnings');

    //         return sendResponse(res, 200, false, 'All Estadísticas recuperadas exitosamente', {
    //             soldProducts,
    //             buyingUsers,
    //             monthlyEarnings
    //         });
    //     } catch (error) {
    //         console.error('Error retrieving all statistics:', error);
    //         return sendResponse(res, 500, true, 'Could not retrieve all statistics');
    //     }
    // }

    /**
     * Obtener todas las estadisticas de productos vendidos
     */
    // GET /statistics/business/:businessId/sold-products
    static async getSoldProducts(req, res) {
        try {
            const soldProducts = await StatisticsController.getStatistics(req, res, SoldProductStatistic, 'soldCount');
            return sendResponse(res, 200, false, 'Estadísticas recuperadas exitosamente', null, {
                soldProducts
            });
        } catch (error) {
            console.error('Error retrieving sold products statistics:', error);
            return sendResponse(res, 500, true, 'Could not retrieve sold products statistics');
        }
    }

    /**
     * Obtener todas las estadisticas de usuarios que han comprado
     */
    // GET /statistics/business/:businessId/buying-users
    static async getBuyingUsers(req, res) {
        try {
            const buyingUsers = await StatisticsController.getStatistics(req, res, BuyingUserStatistic, 'userCount');
            return sendResponse(res, 200, false, 'Estadísticas recuperadas exitosamente', null, {
                buyingUsers
            });
        } catch (error) {
            console.error('Error al recuperar estadísticas de usuarios de compra:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar las estadísticas de los usuarios compradores');
        }
    }

    /**
     * Obtener todas las estadisticas de compra del usuario
     */
    // GET /statistics/user/buying-users
    static async getBuyingUserStatistics(req, res) {
        const { userId } = req.user;

        // Definir los literales para las fechas
        const startOfMonth = Sequelize.literal("DATE_FORMAT(NOW(), '%Y-%m-01')"); // Mes actual
        const endOfMonth = Sequelize.literal("LAST_DAY(NOW())"); // Mes actual
        const startOfLastMonth = Sequelize.literal("DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01')"); // Mes anterior
        const endOfLastMonth = Sequelize.literal("LAST_DAY(NOW() - INTERVAL 1 MONTH)"); // Mes anterior

        try {
            // Consultar el total gastado en el mes actual y en el mes anterior
            const [currentMonthSpent, lastMonthSpent] = await Promise.all([
                Invoice.sum('totalGeneral', {
                    where: {
                        clientId: userId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfMonth,
                            [Sequelize.Op.lte]: endOfMonth
                        }
                    }
                }),
                Invoice.sum('totalGeneral', {
                    where: {
                        clientId: userId,
                        dateTimePayment: {
                            [Sequelize.Op.gte]: startOfLastMonth,
                            [Sequelize.Op.lte]: endOfLastMonth
                        }
                    }
                })
            ]);

            // Redondear los valores
            const roundedCurrentMonthSpent = roundDownToTwoDecimals(currentMonthSpent || 0);
            const roundedLastMonthSpent = roundDownToTwoDecimals(lastMonthSpent || 0);

            // Calcular el porcentaje de cambio
            const percentageChange = calculatePercentageChange(roundedCurrentMonthSpent, roundedLastMonthSpent)

            return sendResponse(res, 200, false, 'Estadísticas recuperadas exitosamente', {
                currentMonthSpent: roundedCurrentMonthSpent,
                lastMonthSpent: roundedLastMonthSpent,
                percentageChange: roundDownToTwoDecimals(percentageChange)
            });
        } catch (error) {
            console.error('Error al recuperar estadísticas de usuarios de compra:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar las estadísticas de los usuarios compradores');
        }
    }

    /**
     * Obtener todas las estadisticas ganancias mensuales
     */
    // GET /statistics/business/:businessId/monthly-earnings
    static async getMonthlyEarnings(req, res) {
        try {
            const monthlyEarnings = await StatisticsController.getStatistics(req, res, EarningsStatistic, 'totalEarnings');
            return sendResponse(res, 200, false, 'Estadísticas recuperadas exitosamente', null, {
                monthlyEarnings
            });
        } catch (error) {
            console.error('Error al recuperar las estadísticas de ingresos mensuales:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar las estadísticas de ganancias mensuales');
        }
    }






    // NOTA: LA ACTUALIZACION DE LOS DATOS DE LAS ESTADISCIAS DEBEN SER DENTRO DEL MISMO BAKCNED
    // POR LO QUE NO SERA NECESARIO USAR ENDPOINTS PARA ESTAS ACCIONES


    /*** *************************************************
     * ***************************************************
     * Metodo generico para Actualizar estadísticas
     * *************************************************** 
     ************************************************* ***/
    static async updateStatistic(req, res, StatisticModel, updateData) {
        const {
            businessId
        } = req.params;
        try {
            const [updatedRows] = await StatisticModel.update(updateData, {
                where: {
                    businessId: businessId
                }
            });

            if (updatedRows === 1) {
                return sendResponse(res, 200, false, 'Estadística actualizada con éxito');
            } else {
                return sendResponse(res, 404, true, 'Estadística no encontrada');
            }
        } catch (error) {
            console.error('Error al actualizar la estadística:', error);
            return sendResponse(res, 500, true, 'No se pudo actualizar la estadística');
        }
    }

    // Actualizar estadísticas de productos vendidos
    static async updateSoldProductsStatistic(req, res) {
        const {
            soldCount
        } = req.body;

        return StatisticsController.updateStatistic(req, res, SoldProductStatistic, {
            soldCount
        });
    }

    // Actualizar estadísticas de usuarios que han comprado
    static async updateBuyingUsersStatistic(req, res) {
        const {
            userCount
        } = req.body;

        return StatisticsController.updateStatistic(req, res, BuyingUserStatistic, {
            userCount
        });
    }

    // Actualizar estadísticas de ganancias mensuales
    static async updateMonthlyEarningsStatistic(req, res) {
        const {
            totalEarnings
        } = req.body;

        return StatisticsController.updateStatistic(req, res, EarningsStatistic, {
            totalEarnings
        });
    }
}