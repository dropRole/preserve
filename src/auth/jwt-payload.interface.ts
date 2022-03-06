import { Role } from './enum/role.enum';

export interface JWTPayload {
  username: string;
  role: Role;
}
