import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './enum/role.enum';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // if no roles are required
    if (!roles) return true;
    const { payload } = context.switchToHttp().getRequest();
    return roles.some((role) => {
      if (role === payload.role) return true;
    });
  }
}
