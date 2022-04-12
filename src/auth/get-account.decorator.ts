import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from './account.entity';

export const GetAccount = createParamDecorator(
  (_data, context: ExecutionContext): Account => {
    const { user } = context.switchToHttp().getRequest();
    return user;
  },
);
