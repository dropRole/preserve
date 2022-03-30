import { SetMetadata } from '@nestjs/common';
import { Privilege } from './enum/privilege.enum';

export const PRIVILEGES = 'privileges';
export const Privileges = (...privileges: Privilege[]) =>
  SetMetadata(PRIVILEGES, privileges);
