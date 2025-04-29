import { Card } from '../../models/card.model.js';
import { EncryptionService } from '../../services/encryption.service.js';
// import { validateCardNumber, validateExpiryDate } from '../../utils/card.validator.js';

export class CardController {

  /**
   * @swagger
   * /api/v1/payment/cards:
   *   post:
   *     summary: Save a new card
   *     tags: [Cards]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - cardNumber
   *               - expiryDate
   *               - cardholderName
   *               - cvv
   *             properties:
   *               cardNumber:
   *                 type: string
   *                 description: Card number
   *               expiryDate:
   *                 type: string
   *                 description: Card expiry date (MM/YY)
   *               cardholderName:
   *                 type: string
   *                 description: Name of the cardholder
   *               cvv:
   *                 type: string
   *                 description: Card verification value
   *     responses:
   *       201:
   *         description: Card saved successfully
   *       400:
   *         description: Invalid card data
   *       500:
   *         description: Server error
   */
  static async saveCard(req, res) {
    try {
      const { cardNumber, expiryDate, cardholderName, cvv } = req.body;
      
      // // Validaciones
      // if (!validateCardNumber(cardNumber)) {
      //   return res.status(400).json({ error: 'Número de tarjeta inválido' });
      // }
      
      // if (!validateExpiryDate(expiryDate)) {
      //   return res.status(400).json({ error: 'Fecha de expiración inválida' });
      // }

      // Encriptar datos sensibles
      const encryptedCardNumber = await EncryptionService.encrypt(cardNumber);
      const encryptedExpiryDate = await EncryptionService.encrypt(expiryDate);
      const encryptedCvv = await EncryptionService.encrypt(cvv);

      console.log(encryptedCardNumber);
      console.log(encryptedExpiryDate);
      console.log(encryptedCvv);

      // Guardar en base de datos
      const card = await Card.create({
        userId: 12,
        cardholderName,
        lastFourDigits: cardNumber.slice(-4),
        encryptedCardNumber: JSON.stringify(encryptedCardNumber),
        encryptedExpiryDate: JSON.stringify(encryptedExpiryDate),
        encryptedCvv: JSON.stringify(encryptedCvv),
        // brand: detectCardBrand(cardNumber),
        brand: 'visa',
      });

      return res.status(201).json({
        id: card.id,
        lastFourDigits: card.lastFourDigits,
        brand: card.brand,
        cardholderName: card.cardholderName,

        encryptedCardNumber: card.encryptedCardNumber,
        encryptedExpiryDate: card.encryptedExpiryDate,
        encryptedCvv: card.encryptedCvv
      });

    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/v1/payment/cards/{cardId}:
   *   get:
   *     summary: Get decrypted card details
   *     tags: [Cards]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: cardId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the card to retrieve
   *     responses:
   *       200:
   *         description: Card details retrieved successfully
   *       404:
   *         description: Card not found
   *       500:
   *         description: Server error
   */
  static async getDecryptedCard(req, res) {
    try {
      const { cardId } = req.params;

      // Buscar la tarjeta en la base de datos
      const card = await Card.findByPk(cardId);

      if (!card) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' });
      }

      console.log(card);

      // Desencriptar los datos
      const encryptedCardNumberData = JSON.parse(card.encryptedCardNumber);
      const encryptedExpiryDateData = JSON.parse(card.encryptedExpiryDate);
      // const encryptedCvvData = JSON.parse(card.encryptedCvv);





      console.log(encryptedCardNumberData);
      console.log(encryptedExpiryDateData);
      // console.log(encryptedCvvData);

      const decryptedCardNumber = await EncryptionService.decrypt(
        encryptedCardNumberData.encrypted,
        encryptedCardNumberData.iv,
        encryptedCardNumberData.authTag
      );

      const decryptedExpiryDate = await EncryptionService.decrypt(
        encryptedExpiryDateData.encrypted,
        encryptedExpiryDateData.iv,
        encryptedExpiryDateData.authTag
      );

      // const decryptedCvv = await EncryptionService.decrypt(
      //   encryptedCvvData.encryptedData,
      //   encryptedCvvData.iv,
      //   encryptedCvvData.authTag
      // );

      return res.status(200).json({
        id: card.id,
        cardNumber: decryptedCardNumber,
        expiryDate: decryptedExpiryDate,
        cvv: 'cvv',
        cardholderName: card.cardholderName,
        brand: card.brand,
        lastFourDigits: card.lastFourDigits
      });

    } catch (error) {
      console.error('Error al desencriptar tarjeta:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Otros métodos como getCards, deleteCard, etc.
}
