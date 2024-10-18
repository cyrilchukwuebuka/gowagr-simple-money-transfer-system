import {
  Injectable
} from '@nestjs/common';
import { Role } from './entities/auth.entity';

export type ReqUser = {
  user: { id: string; roles: Role[] };
};

@Injectable()
export class AuthService {
  
}
