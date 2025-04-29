// src/controllers/stats.controller.js
import { SalesService } from '../services/sales.service.js';
import { ClientService } from '../services/client.service.js';
import { OrderService } from '../services/order.service.js';
import { sendResponse } from '../helpers/utils.js';

export class StatsController {
  /**
   * @swagger
   * /api/v1/business/statistics/monthly-earnings:
   *   get:
   *     summary: Get total monthly earnings
   *     tags: [Business Statistics]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Monthly earnings retrieved successfully
   *       500:
   *         description: Server error
   */
  // Obtener el total de ganancias del mes
  static async getMonthlyEarnings(req, res) {
    try {
      const earnings = await SalesService.getMonthlyEarnings();
      sendResponse(res, 200, false, earnings);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  /**
   * @swagger
   * /api/v1/business/statistics/total-sales:
   *   get:
   *     summary: Get total sales
   *     tags: [Business Statistics]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Total sales retrieved successfully
   *       500:
   *         description: Server error
   */
  // Obtener el total de ventas
  static async getTotalSales(req, res) {
    try {
      const totalSales = await SalesService.getTotalSales();
      sendResponse(res, 200, false, totalSales);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  /**
   * @swagger
   * /api/v1/business/statistics/total-clients:
   *   get:
   *     summary: Get total clients
   *     tags: [Business Statistics]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Total clients retrieved successfully
   *       500:
   *         description: Server error
   */
  // Obtener el total de clientes
  static async getTotalClients(req, res) {
    try {
      const totalClients = await ClientService.getTotalClients();
      sendResponse(res, 200, false, totalClients);
    } catch (err) {
      sendResponse(res, 500, true, err.message);
    }
  }

  /**
   * @swagger
   * /api/v1/business/statistics/incomplete-orders:
   *   get:
   *     summary: Get incomplete orders summary
   *     tags: [Business Statistics]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Incomplete orders summary retrieved successfully
   *       500:
   *         description: Server error
   */
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
