import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Represents a service for handling encryption in the system.
 * @class
 *
 * @method generateToken
 * @method createHashToken
 */
@Injectable()
export class EncryptService {
  /**
   * Generates an encrypted code.
   * @method
   *
   * @returns {string} A string.
   */
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generates a hash code.
   * @method
   *
   * @param {Object} resetToken - The reset token.
   * @returns {string} A string.
   */
  createHashToken(resetToken: string): string {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    return hashedToken;
  }
}
