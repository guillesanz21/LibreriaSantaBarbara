import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles || !roles?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return roles.includes(request.user?.role);
  }
}
