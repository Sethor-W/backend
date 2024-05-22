import { uploadFile } from "../helpers/storage.helper.js";
import { sendResponse } from "../helpers/utils.js";


export class identityDocumentController {

    /**
     * Upload identity documents of a User
     */
    // POST upload
    static async uploadIdentityDocuments (req, res) {

        try {
            if (!req.files) {
                return sendResponse(res, 400, true, 'No image provided for upload');
            }
            return sendResponse(res, 200, false, 'Documents saved successfully', req.files);
    
            const image = req.files.image; // Obtén el archivo de la solicitud
            const rutaArchivo = `/ruta/donde/guardar/${image.name}`; // Define la ruta donde se guardará el archivo
    
            // Sube la imagen a Cloudinary y obtiene la URL pública
            const urlImage = await uploadFile(rutaArchivo);
    
            return sendResponse(res, 200, false, 'Documents saved successfully', null, { url: urlImage });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return sendResponse(res, 500, true, 'Error al subir la imagen');
        }
    }

}