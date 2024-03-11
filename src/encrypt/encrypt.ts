import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class Encrypt {
  encrypt(data: string): string {
    const key = 'mi-clave-de-cifrado-segura';
    const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
    return ciphertext;
  }

  decrypt(data: string): string {
    const key = 'mi-clave-de-cifrado-segura';
    const bytes = CryptoJS.AES.decrypt(data, key);
    const mensajeDescifrado = bytes.toString(CryptoJS.enc.Utf8);
    return mensajeDescifrado;
  }
}
