import { sendResponse, validateRequiredFields } from "../helpers/utils.js";

import { Help } from "../models/help.js";
import { OpinionOrSuggestion } from "../models/opinionOrSuggestion.js";
import { RepresentativeSethor } from "../models/representativeSethor.js";


export class OtherController {


     /**
     * Ayuda
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
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }
            const newHelp = await Help.create({ contactNumber, detail, docs: docsString, userType, userId });

            return sendResponse(res, 201, false, "Help request submitted successfully", newHelp);
        } catch (error) {
            console.error("Error submitting help request:", error);
            return sendResponse(res, 500, true, "Error submitting help request");
        }
    }

    /**
     * Opinion o sugerencia
     */
    // POST /opinion-suggestion
    static async opinionOrSuggestion(req, res) {
        const { detail, documents, userType } = req.body;

        try {
            // Validar la presencia de los campos requeridos
            const requiredFields = ['detail', 'userType'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }
            
            const newOpinionOrSuggestion = await OpinionOrSuggestion.create({ detail, docs: docsString, userType });

            return sendResponse(res, 201, false, "Opinion/suggestion submitted successfully", newOpinionOrSuggestion);
        } catch (error) {
            console.error("Error submitting opinion/suggestion:", error);
            return sendResponse(res, 500, true, "Error submitting opinion/suggestion");
        }
    }

    /**
     * Ayuda
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
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(', ')}`);
            }

            let docsString = null;
            if (documents && documents?.length > 0) {
                docsString = Array.isArray(documents) ? documents.join(', ') : '';
            }

            const newRepresentativeSethor = await RepresentativeSethor.create({ contactNumber, detail, docs: docsString, userType, userId });

            return sendResponse(res, 201, false, "Contact request submitted successfully", newRepresentativeSethor);
        } catch (error) {
            console.error("Error submitting contact request to Sethor representative:", error);
            return sendResponse(res, 500, true, "Error submitting contact request to Sethor representative");
        }
    }

}