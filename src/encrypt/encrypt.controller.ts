import { Controller } from '@nestjs/common';
import { encrypt } from '../utils/routes';

/**
 * Represents a controller for handling encryption in the system.
 * @class
 *
 */
@Controller(encrypt)
export class EncryptController {}
