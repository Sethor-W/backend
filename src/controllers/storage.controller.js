import {
    sendResponse
} from "../helpers/utils.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs';


export class StorageController {


    /**
     * Upload file
     */
    // PUT storage/upload/:nameFolder
    static async uploadFile(req, res) {
        const { nameFolder } = req.params;
        try {
            // Verificar si el archivo está disponible
            if (!req.file) {
                return sendResponse(res, 400, true, 'No file uploaded');
            }

            const file = req.file;
            const result = await cloudinary.uploader.upload(file.path, {
                folder: nameFolder
            });

            // Eliminar el archivo del sistema de archivos local
            fs.unlink(file.path, (err) => {
                if (err) {
                    return sendResponse(res, 500, true, 'Error en el archivo del sistema (local)');
                }
            });

            // Enviar respuesta
            return sendResponse(res, 201, false, 'File uploaded successfully', { url: result.secure_url });
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            return sendResponse(res, 500, true, 'Error al subir el archivo');
        }
    }
}
