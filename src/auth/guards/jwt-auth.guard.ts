import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Represents a guard for handling JWT Auth in the system.
 * @class
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * @method
   *
   * @param {ExecutionContext} context - The execution context object.
   *
   * @returns {Promise<boolean | Promise<boolean>>} A promise that resolves when the verification is done.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true; // Skip authentication for public routes
    }

    const canActivate = super.canActivate(context);

    if (canActivate instanceof Observable) {
      // Convert observable to promise
      return canActivate.toPromise();
    }

    return canActivate;
  }
}
