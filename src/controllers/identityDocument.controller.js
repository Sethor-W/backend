import { uploadFile } from "../helpers/storage.helper.js";
import { sendResponse } from "../helpers/utils.js";


export class identityDocumentController {

    /**
     * @swagger
     * /api/v1/identity-documents/upload:
     *   post:
     *     summary: Upload identity documents
     *     tags: [Identity Documents]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Identity document image
     *     responses:
     *       200:
     *         description: Documents saved successfully
     *       400:
     *         description: No image provided
     *       500:
     *         description: Server error
     */
    // POST upload
    static async uploadIdentityDocuments (req, res) {

        try {
            if (!req.files) {
                return sendResponse(res, 400, true, 'No se proporcionó ninguna imagen para cargar');
            }
            return sendResponse(res, 200, false, 'Documentos guardados exitosamente', req.files);
    
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