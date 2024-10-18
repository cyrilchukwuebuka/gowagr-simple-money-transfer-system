import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  createHashToken(resetToken: string) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    return hashedToken;
  }
}
