import {
    sendResponse
} from "../helpers/utils.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs';


export class StorageController {


    /**
     * @swagger
     * /api/v1/storage/upload/{nameFolder}:
     *   put:
     *     summary: Upload a file to cloud storage
     *     tags: [Storage]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: nameFolder
     *         required: true
     *         schema:
     *           type: string
     *         description: Folder name in cloud storage
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: File to upload
     *     responses:
     *       201:
     *         description: File uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: El archivo ha subido correctamente
     *                 data:
     *                   type: object
     *                   properties:
     *                     url:
     *                       type: string
     *                       description: URL to access the uploaded file
     *       400:
     *         description: No file uploaded
     *       500:
     *         description: Server error
     */
    // PUT storage/upload/:nameFolder
    static async uploadFile(req, res) {
        const { nameFolder } = req.params;
        try {
            // Verificar si el archivo está disponible
            if (!req.file) {
                return sendResponse(res, 400, true, 'No se ha subido ningún archivo');
            }

            const file = req.file;
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `sethor/${nameFolder}`
            });

            // Eliminar el archivo del sistema de archivos local
            fs.unlink(file.path, (err) => {
                if (err) {
                    return sendResponse(res, 500, true, 'Error en el archivo del sistema (local)');
                }
            });

            // Enviar respuesta
            return sendResponse(res, 201, false, 'El archivo ha subido correctamente', { url: result.secure_url });
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            return sendResponse(res, 500, true, 'Error al subir el archivo');
        }
    }
}
