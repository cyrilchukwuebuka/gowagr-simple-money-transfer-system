import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwt } from 'src/config/env.configuration';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Represents a strategy for handling JWT Passport Strategy in the system.
 * @class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // console.log('jwt.secret', jwt.secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'averylongjsonwebtokensecret', //jwt.secret,
    });
  }

  /**
   * Validates a user jwt token.
   * @method
   *
   * @param {any} payload - The payload object.
   *
   * @returns {Promise<{id: string}>} A promise that resolves when the verification is done.
   */
  async validate(payload: any): Promise<{ id: string }> {
    return { id: payload.sub };
  }
}
