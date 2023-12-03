// src/crypto/crypto.service.ts

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm: string = 'aes-256-ctr';
  private readonly secretKey: string = process.env.CRYPTO_SECRET;

  encrypt(text: string = ''): string {
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText: string = ''): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
