import {
  Dependencies,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Represents a strategy for handling local Passport Strategy in the system.
 * @class
 */
@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateCredentials(username, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
