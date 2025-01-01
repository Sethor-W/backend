import { ReportService } from "../../services/business/report.service.js";

export class ReportBusinessController {

    static async getMonthlyStatistics(req, res) {
        const locales = req.locales; // Asegúrate de que este objeto tenga el businessId
        const result = await ReportService.getMonthlyStatistics(locales);
        res.status(result.statusCode).json(result);
    }

}
