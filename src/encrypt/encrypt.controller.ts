import { Controller } from '@nestjs/common';
import { encrypt } from '../utils/routes';

@Controller(encrypt)
export class EncryptController {}
