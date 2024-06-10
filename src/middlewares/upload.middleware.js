import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendResponse } from '../helpers/utils.js';


export function uploadFileMiddleware(req, res, next) {

    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // Configurar multer para manejar la subida de archivos
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({ 
        storage,
        limits: { fileSize: 2 * 1024 * 1024 }
    });

    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error(err)
            return sendResponse(res, 400, true, 'El archivo excede el límite de tamaño permitido (2MB)');
        } else if (err) {
            console.error(`Error al cargar el archivo: ${err}`)
            return sendResponse(res, 500, true, 'Error al cargar el archivo');
        }
        next();
    });
}