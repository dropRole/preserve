import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Privilege } from './enum/privilege.enum';

export class PrivilegesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const privileges = this.reflector.getAllAndOverride<Privilege[]>(
      'privileges',
      [context.getHandler(), context.getClass()],
    );
    // if no roles are required
    if (!privileges) return true;
    const { payload } = context.switchToHttp().getRequest();
    return privileges.some((privilege) => {
      if (privilege === payload.role) return true;
    });
  }
}
