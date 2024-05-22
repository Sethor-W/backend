import cloudinary from "../config/cloudinary.config.js";


/**
 * Sube un archivo (imagen) a Cloudinary
 * @param {string} file Ruta del archivo a subir
 * @returns {Promise<string>} La URL pública del archivo subido
 */
export async function uploadFile(file) {
    try {
        // Sube el archivo a Cloudinary
        const result = await cloudinary.uploader.upload(file);

        // Devuelve la URL pública del archivo subido
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir el archivo a Cloudinary:', error);
        throw error;
    }
}