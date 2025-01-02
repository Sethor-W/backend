import { Op } from "sequelize";
import { Branch } from "../../models/common/branch.js";
import { Invoice } from "../../models/common/invoice.js";

// services/BranchService.js
export class BranchService {

  static async registerBranch(params, body, user) {
    const { businessId } = params;
    const { photo, main, name, address, googleMap, country_cca2 } = body;
    try {
      // Registrar sucursal  
      const newBranch = await Branch.create({ photo, main, name, address, googleMap, country_cca2, businessId });

      // Respuesta exitosa
      return {
        error: false,
        statusCode: 201,
        message: "La sucursal ha sido registrada exitosamente",
        data: newBranch
      };
    } catch (error) {
      console.error("Error al registrar la sucursal:", error);
      return {
        error: true,
        statusCode: 500,
        message: "Error al registrar la sucursal",
      };
    }
  }


  static async getBranchDetailsById({ branchId }) {
    try {
      let branch = await Branch.findByPk(branchId, {
        attributes: ['id', 'name', 'address', 'country_cca2', 'googleMap', 'main'],
      });
      if (!branch) {
        return {
          error: true,
          statusCode: 404,
          message: "Sucursal no encontrado'",
        };
      }

      const resultStatistic = await BranchService.getMonthlyStatistics({ branchId: branchId });

      if (resultStatistic.error) return resultStatistic;


      branch.dataValues.statistics = resultStatistic.data.statistics;
      // Respuesta exitosa
      return {
        error: false,
        statusCode: 200,
        message: "Detalles comerciales recuperados exitosamente",
        data: branch,
      };

    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return {
        error: true,
        statusCode: 500,
        message: "Error al actualizar el producto",
      };
    }
  }


  static async getMonthlyStatistics(data) {
    try {
      // Fechas para el mes actual y el mes anterior
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Facturas del mes actual
      const currentMonthInvoices = await Invoice.findAll({
        where: {
          ...data,
          status: "paid", // Asegúrate de que este sea el campo correcto
          createdAt: { [Op.gte]: startOfCurrentMonth },
        },
      });

      // Facturas del mes anterior
      const previousMonthInvoices = await Invoice.findAll({
        where: {
          ...data,
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
        data: { statistics },
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


  static async getBranchFromProfile(profile) {
    if (!profile.profiles_business.additionalData) {
      throw new Error("El cobrador no tiene una sucursal asignada");
    }
    const additionalData = JSON.parse(profile.profiles_business.additionalData);
    const branchId = additionalData.branch.id;
    return await Branch.findByPk(branchId);
  }
}

