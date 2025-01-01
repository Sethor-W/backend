import { Op } from "sequelize";
import { Invoice } from "../../models/common/invoice.js";

export class ReportService {
    
    static async getMonthlyStatistics(locales) {
        const { businessId } = locales;

        try {
            // Fechas para el mes actual y el mes anterior
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            // Facturas del mes actual
            const currentMonthInvoices = await Invoice.findAll({
                where: {
                    businessId,
                    status: "paid", // Asegúrate de que este sea el campo correcto
                    createdAt: { [Op.gte]: startOfCurrentMonth },
                },
            });

            // Facturas del mes anterior
            const previousMonthInvoices = await Invoice.findAll({
                where: {
                    businessId,
                    status: "paid",
                    createdAt: {
                        [Op.gte]: startOfPreviousMonth,
                        [Op.lte]: endOfPreviousMonth,
                    },
                },
            });

            // Cálculo de estadísticas
            const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => sum + invoice.totalGeneral, 0);
            const previousMonthRevenue = previousMonthInvoices.reduce((sum, invoice) => sum + invoice.totalGeneral, 0);

            const currentMonthSales = currentMonthInvoices.length;
            const previousMonthSales = previousMonthInvoices.length;

            const currentMonthCustomers = new Set(currentMonthInvoices.map(invoice => invoice.clientId)).size;
            const previousMonthCustomers = new Set(previousMonthInvoices.map(invoice => invoice.clientId)).size;


            // Función para calcular cambio porcentual y tendencia
            const calculatePercentageChange = (current, previous) => {
                if (previous === 0) return { percentageChange: 100, trend: "up" };
                const percentageChange = ((current - previous) / previous) * 100;
                return {
                    percentageChange: parseFloat(percentageChange.toFixed(2)),
                    trend: percentageChange > 0 ? "up" : "down",
                };
            };

            // Construcción del resultado
            const statistics = [
                {
                    title: "Total de Ganancias",
                    currentMonth: currentMonthRevenue,
                    ...calculatePercentageChange(currentMonthRevenue, previousMonthRevenue),
                },
                {
                    title: "Total de Ventas",
                    currentMonth: currentMonthSales,
                    ...calculatePercentageChange(currentMonthSales, previousMonthSales),
                },
                {
                    title: "Total de Clientes",
                    currentMonth: currentMonthCustomers,
                    ...calculatePercentageChange(currentMonthCustomers, previousMonthCustomers),
                },
            ];

            return {
                error: false,
                statusCode: 200,
                message: "Reports retrieved successfully",
                data: { statistics},
            };
        } catch (error) {
            console.error("Error generating monthly statistics:", error);
            return {
                error: true,
                statusCode: 500,
                message: "Error generating reports",
            };
        }
    }

}
