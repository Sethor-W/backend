import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import CryptoJS from 'crypto-js';


const SECURITY_DIR = '../../security';

const privateKey = getContentKeys('private_key.pem');
const private_key_decrypt = getContentKeys('private_key_decrypt.pem');
const publicKey = getContentKeys('public_key.pem');

export function signJWT(payload) {
    return jwt.sign(payload, private_key_decrypt, { algorithm: 'RS256', expiresIn: '24h' });
}

export function verifyJWT(token) {
    try {
        return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (error) {
        return null;
    }
}

export function getContentKeys(nameFile) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const privateKeyPath = path.join(__filename, SECURITY_DIR, nameFile);
        return fs.readFileSync(privateKeyPath, 'utf8'); // Lee la llave privada
    } catch (error) {
        return null;
    }
}
export function decryptPrivateKey(encryptedKeyContent, passphrase) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedKeyContent, passphrase).toString(crypto.enc.Utf8);;
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        // Capturar cualquier error y lanzarlo
        throw new Error('Error al desencriptar la clave privada: ' + error);
    }
}