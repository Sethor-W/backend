import crypto, { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
// import { encryptionKey } from '../config/encryption.config.js'; // Asumiendo que tienes una clave de encriptación segura configurada

export class EncryptionService {
  static algorithm = 'aes-256-gcm';
  static secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  static iv = crypto.randomBytes(16); // Inicialización aleatoria del vector de inicialización


  // Validación de la clave al iniciar el servicio
  static {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY no está configurada en las variables de entorno');
    }
    if (process.env.ENCRYPTION_KEY.length !== 64) { // 32 bytes en hex = 64 caracteres
      throw new Error('ENCRYPTION_KEY debe ser una clave hexadecimal de 32 bytes (64 caracteres)');
    }
  }


  /**
   * **********************************************************
   * Ya funciona esto es lo que estamos usando
   * **********************************************************
   */

  // Método para encriptar texto usando AES-256-GCM (un algoritmo de encriptación más seguro)
  static async encrypt(text) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.secretKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Método para desencriptar texto usando AES-256-GCM
  static async decrypt(encryptedData, iv, authTag) {
    const decipher = createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }















  // Método para cifrar datos de la tarjeta de crédito
  static async encryptCardData(cardData) {
    try {
      const iv = crypto.randomBytes(16); // Se genera un IV aleatorio para cada cifrado
      const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), iv);

      let encrypted = cipher.update(JSON.stringify(cardData));
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
      };
    } catch (error) {
      console.error('Error en la encriptación:', error);
      throw new Error('Error al encriptar los datos de la tarjeta');
    }
  }

  // Método para descifrar los datos de la tarjeta de crédito
  static async decryptCardData(encryptedData, iv) {
    try {
      const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));

      let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return JSON.parse(decrypted.toString());
    } catch (error) {
      console.error('Error en la desencriptación:', error);
      throw new Error('Error al desencriptar los datos de la tarjeta');
    }
  }






}
