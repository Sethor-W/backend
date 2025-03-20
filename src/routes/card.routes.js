const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware de autenticación para todas las rutas de tarjetas
router.use(authMiddleware);

// Guardar nueva tarjeta
router.post('/cards', cardController.storeCard);

// Obtener tarjetas del usuario
router.get('/cards', async (req, res) => {
  try {
    const cards = await cardController.getUserCards(req.user.id);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tarjetas' });
  }
});

// Obtener una tarjeta específica
router.get('/cards/:cardId', async (req, res) => {
  try {
    const card = await cardController.getCard(req.params.cardId, req.user.id);
    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarjeta' });
  }
});

// Eliminar tarjeta
router.delete('/cards/:cardId', async (req, res) => {
  try {
    await cardController.deleteCard(req.params.cardId, req.user.id);
    res.json({ message: 'Tarjeta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarjeta' });
  }
});

// Procesar pago con tarjeta
router.post('/cards/:cardId/process-payment', async (req, res) => {
  try {
    const { amount, currency, description } = req.body;
    const result = await cardController.processPayment(
      req.params.cardId,
      req.user.id,
      amount,
      currency,
      description
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

module.exports = router; 