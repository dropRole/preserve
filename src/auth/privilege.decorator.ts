import { SetMetadata } from '@nestjs/common';
import { Privilege } from './enum/privilege.enum';

export const PRIVILEGES = 'roles';
export const Roles = (...privileges: Privilege[]) =>
  SetMetadata(PRIVILEGES, privileges);
