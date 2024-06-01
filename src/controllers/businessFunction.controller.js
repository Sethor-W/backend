import { sendResponse } from "../helpers/utils.js";
import { BusinessFunction } from "../models/businessFunction.js";


export class BusinessFunctionController {


    /**
      * Obtener todas las funciones
      */
    // GET business/functions
    static async getBusinessFunction(req, res) {

        try {
            const functions = await BusinessFunction.findAll();

            return sendResponse(res, 200, false, "Funciones recuperadas exitosamente", functions);
        } catch (error) {
            console.error('Error getting functions:', error);
            return sendResponse(res, 500, true, 'No se pudieron recuperar funciones');
        }
    };

}