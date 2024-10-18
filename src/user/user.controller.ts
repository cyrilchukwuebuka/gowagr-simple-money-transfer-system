import {
  Controller
} from '@nestjs/common';
import { user } from 'src/utils/routes';

@Controller(user)
export class UserController {
  }
