// src/controllers/stats.controller.js
import { SalesService } from '../services/sales.service.js';
import { ClientService } from '../services/client.service.js';
import { OrderService } from '../services/order.service.js';
import { sendResponse } from '../helpers/utils.js';

export class StatsController {
  // Obtener el total de ganancias del mes
  static async getMonthlyEarnings(req, res) {
    try {
      const earnings = await SalesService.getMonthlyEarnings();
      sendResponse(res, 200, false, earnings);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  // Obtener el total de ventas
  static async getTotalSales(req, res) {
    try {
      const totalSales = await SalesService.getTotalSales();
      sendResponse(res, 200, false, totalSales);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  // Obtener el total de clientes
  static async getTotalClients(req, res) {
    try {
      const totalClients = await ClientService.getTotalClients();
      sendResponse(res, 200, false, totalClients);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  // Obtener el resumen de pedidos incompletos
  static async getIncompleteOrdersSummary(req, res) {
    try {
      const summary = await OrderService.getIncompleteOrdersSummary();
      sendResponse(res, 200, false, summary);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }
}
