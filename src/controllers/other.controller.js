import { sendResponse, validateRequiredFields } from "../helpers/utils.js";

import { Help } from "../models/common/help.js";
import { OpinionOrSuggestion } from "../models/common/opinionOrSuggestion.js";
import { RepresentativeSethor } from "../models/common/representativeSethor.js";


export class OtherController {


     /**
     * @swagger
     * /api/v1/help:
     *   post:
     *     summary: Submit a help request
     *     tags: [Support]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - contactNumber
     *               - detail
     *               - userType
     *             properties:
     *               contactNumber:
     *                 type: string
     *                 description: Contact phone number
     *               detail:
     *                 type: string
     *                 description: Help request details
     *               documents:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Optional URLs to documents
     *               userType:
     *                 type: string
     *                 description: Type of user requesting help
     *     responses:
     *       201:
     *         description: Help request sent successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
     */
    // POST /help
    static async help(req, res) {
        const { userId } = req.user;
        const { contactNumber, detail, documents, userType } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['contactNumber', 'detail', 'userType'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }
            const newHelp = await Help.create({ contactNumber, detail, docs: docsString, userType, userId });

            return sendResponse(res, 201, false, "Solicitud de ayuda enviada correctamente", newHelp);
        } catch (error) {
            console.error("Error al enviar solicitud de ayuda:", error);
            return sendResponse(res, 500, true, "Error al enviar solicitud de ayuda");
        }
    }

    /**
     * @swagger
     * /api/v1/opinion-suggestion:
     *   post:
     *     summary: Submit an opinion or suggestion
     *     tags: [Support]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - detail
     *               - userType
     *             properties:
     *               detail:
     *                 type: string
     *                 description: Opinion or suggestion details
     *               documents:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Optional URLs to documents
     *               userType:
     *                 type: string
     *                 description: Type of user submitting the opinion/suggestion
     *     responses:
     *       201:
     *         description: Opinion/suggestion sent successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
     */
    // POST /opinion-suggestion
    static async opinionOrSuggestion(req, res) {
        const { detail, documents, userType } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['detail', 'userType'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }
            
            const newOpinionOrSuggestion = await OpinionOrSuggestion.create({ detail, docs: docsString, userType });

            return sendResponse(res, 201, false, "Opinión/sugerencia enviada exitosamente", newOpinionOrSuggestion);
        } catch (error) {
            console.error("Error al enviar Opinión/sugerencia:", error);
            return sendResponse(res, 500, true, "Error al enviar Opinión/sugerencia");
        }
    }

    /**
     * @swagger
     * /api/v1/representative-sethor:
     *   post:
     *     summary: Request contact with a Sethor representative
     *     tags: [Support]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - contactNumber
     *               - detail
     *               - userType
     *             properties:
     *               contactNumber:
     *                 type: string
     *                 description: Contact phone number
     *               detail:
     *                 type: string
     *                 description: Contact request details
     *               documents:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Optional URLs to documents
     *               userType:
     *                 type: string
     *                 description: Type of user requesting contact
     *     responses:
     *       201:
     *         description: Contact request sent successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
     */
    // POST /representative-sethor
    static async representativeSethor(req, res) {
        const { userId } = req.user;
        const { contactNumber, detail, documents, userType } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['contactNumber', 'detail', 'userType'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `Los campos son obligatorios: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }

            const newRepresentativeSethor = await RepresentativeSethor.create({ contactNumber, detail, docs: docsString, userType, userId });

            return sendResponse(res, 201, false, "Solicitud de contacto enviada exitosamente", newRepresentativeSethor);
        } catch (error) {
            console.error("Error al enviar solicitud de contacto al representante de Sethor:", error);
            return sendResponse(res, 500, true, "Error al enviar solicitud de contacto al representante de Sethor");
        }
    }

}