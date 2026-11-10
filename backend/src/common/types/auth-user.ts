import { RoleName } from '../../entities/role.entity';

export interface AuthUser {
  id: string;
  email: string;
  role: RoleName;
}
