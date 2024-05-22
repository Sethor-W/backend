import { sendResponse } from "../helpers/utils.js";
import { SoldProductStatistic } from "../models/soldProductStatistic.js";
import { BuyingUserStatistic } from "../models/buyingUserStatistic.js";
import { EarningsStatistic } from "../models/earningsStatistic.js";
import { Sequelize } from "sequelize";

export class StatisticsController {

    /*** *************************************************
     * ***************************************************
     * Método genérico para obtener estadísticas
     * *************************************************** 
    ************************************************* ***/
    static async getStatistics(req, res, StatisticModel, valueField) {

        const { businessId } = req.params;
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
                order: [['date', 'DESC']]
            });

            const lastMonthData = await StatisticModel.findOne({
                where: {
                    businessId: businessId,
                    date: {
                        [Sequelize.Op.gte]: lastMonthStart,
                        [Sequelize.Op.lt]: lastMonthEnd
                    }
                },
                order: [['date', 'DESC']]
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
        try {
            // Obtener estadísticas de productos vendidos
            const soldProducts = await StatisticsController.getStatistics(req, res, SoldProductStatistic, 'soldCount');
            
            // Obtener estadísticas de usuarios que han comprado
            const buyingUsers = await StatisticsController.getStatistics(req, res, BuyingUserStatistic, 'userCount');
            
            // Obtener estadísticas de ganancias mensuales
            const monthlyEarnings = await StatisticsController.getStatistics(req, res, EarningsStatistic, 'totalEarnings');

            return sendResponse(res, 200, false, 'All statistics retrieved successfully', {
                soldProducts,
                buyingUsers,
                monthlyEarnings
            });
        } catch (error) {
            console.error('Error retrieving all statistics:', error);
            return sendResponse(res, 500, true, 'Could not retrieve all statistics');
        }
    }

    /**
     * Obtener todas las estadisticas de productos vendidos
     */
    // GET /statistics/business/:businessId/sold-products
    static async getSoldProducts(req, res) {
        try {
            const soldProducts = await StatisticsController.getStatistics(req, res, SoldProductStatistic, 'soldCount');
            return sendResponse(res, 200, false, 'Statistics retrieved successfully', null, {soldProducts});
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
            return sendResponse(res, 200, false, 'Statistics retrieved successfully', null, {buyingUsers});
        } catch (error) {
            console.error('Error retrieving buying users statistics:', error);
            return sendResponse(res, 500, true, 'Could not retrieve buying users statistics');
        }
    }

    /**
     * Obtener todas las estadisticas ganancias mensuales
     */
    // GET /statistics/business/:businessId/monthly-earnings
    static async getMonthlyEarnings(req, res) {
        try {
            const monthlyEarnings = await StatisticsController.getStatistics(req, res, EarningsStatistic, 'totalEarnings');
            return sendResponse(res, 200, false, 'Statistics retrieved successfully', null, {monthlyEarnings});
        } catch (error) {
            console.error('Error retrieving monthly earnings statistics:', error);
            return sendResponse(res, 500, true, 'Could not retrieve monthly earnings statistics');
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
        const { businessId } = req.params;
        try {
            const [updatedRows] = await StatisticModel.update(updateData, {
                where: { businessId: businessId }
            });

            if (updatedRows === 1) {
                return sendResponse(res, 200, false, 'Statistic updated successfully');
            } else {
                return sendResponse(res, 404, true, 'Statistic not found');
            }
        } catch (error) {
            console.error('Error updating statistic:', error);
            return sendResponse(res, 500, true, 'Could not update statistic');
        }
    }

    // Actualizar estadísticas de productos vendidos
    static async updateSoldProductsStatistic(req, res) {
        const { soldCount } = req.body;

        return StatisticsController.updateStatistic(req, res, SoldProductStatistic, { soldCount });
    }

    // Actualizar estadísticas de usuarios que han comprado
    static async updateBuyingUsersStatistic(req, res) {
        const { userCount } = req.body;

        return StatisticsController.updateStatistic(req, res, BuyingUserStatistic, { userCount });
    }

    // Actualizar estadísticas de ganancias mensuales
    static async updateMonthlyEarningsStatistic(req, res) {
        const { totalEarnings } = req.body;

        return StatisticsController.updateStatistic(req, res, EarningsStatistic, { totalEarnings });
    }
}
