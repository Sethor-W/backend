import { ReportService } from "../../services/business/report.service.js";

export class ReportBusinessController {

    /**
     * @swagger
     * /api/v1/business/reports/monthly-statistics:
     *   get:
     *     summary: Get monthly statistics report for a business
     *     tags: [Business Reports]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Monthly statistics retrieved successfully
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
     *                   example: Estadísticas mensuales obtenidas exitosamente
     *                 data:
     *                   type: object
     *                   description: Monthly statistics data
     *       404:
     *         description: No data found or business not found
     *       500:
     *         description: Server error
     */
    static async getMonthlyStatistics(req, res) {
        const locales = req.locales; // Asegúrate de que este objeto tenga el businessId
        const result = await ReportService.getMonthlyStatistics(locales);
        res.status(result.statusCode).json(result);
    }

}
