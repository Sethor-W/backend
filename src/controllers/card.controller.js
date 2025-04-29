import { EncryptionService } from '../services/encryption.service';
import { blobServiceClient } from '../config/azure.config';

export class CardController {
    
    /**
     * @swagger
     * /api/v1/cards:
     *   post:
     *     summary: Store a credit/debit card securely
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
     *               - cvv
     *             properties:
     *               cardNumber:
     *                 type: string
     *                 description: Card number (will be tokenized)
     *               expiryDate:
     *                 type: string
     *                 description: Card expiry date (MM/YY format)
     *               cvv:
     *                 type: string
     *                 description: Card CVV/security code
     *     responses:
     *       200:
     *         description: Card stored successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Tarjeta guardada exitosamente
     *                 cardId:
     *                   type: string
     *                   description: Token representing the stored card
     *       400:
     *         description: Invalid card data
     *       500:
     *         description: Server error
     */
    static async storeCard(req, res) {
        try {
            const { cardNumber, expiryDate, cvv } = req.body;
            
            // Validar formato de tarjeta
            if (!CardController.validateCard(cardNumber, expiryDate, cvv)) {
                return res.status(400).json({ error: 'Datos de tarjeta inválidos' });
            }

            // Encriptar datos
            const cardData = {
                cardNumber: cardNumber.slice(-4), // Solo guardamos últimos 4 dígitos
                expiryDate,
                tokenizedData: await CardController.tokenizeCard(cardNumber)
            };

            const encryptedData = await EncryptionService.encryptCardData(cardData);

            // Guardar en base de datos
            // ... código para guardar en Azure SQL ...

            // Registrar log de auditoría
            await CardController.logAuditEvent('card_stored', req.user.id, req);

            return res.status(200).json({ 
                message: 'Tarjeta guardada exitosamente',
                cardId: cardData.tokenizedData 
            });

        } catch (error) {
            console.error('Error al guardar tarjeta:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static validateCard(cardNumber, expiryDate, cvv) {
        // Implementar validación Luhn algorithm
        return true; // Simplificado para el ejemplo
    }

    static async tokenizeCard(cardNumber) {
        // Generar token único
        return `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    static async logAuditEvent(action, userId, req) {
        const containerClient = blobServiceClient.getContainerClient('audit-logs');
        const blobName = `${Date.now()}_${action}.log`;
        const blobClient = containerClient.getBlockBlobClient(blobName);

        const logData = {
            action,
            userId,
            timestamp: new Date().toISOString(),
            ip: req.ip
        };

        await blobClient.upload(JSON.stringify(logData), JSON.stringify(logData).length);
    }
} 