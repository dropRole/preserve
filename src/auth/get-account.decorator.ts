import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from './account.entity';

export const GetAccount = createParamDecorator(
  (_data, context: ExecutionContext): Account => {
    const account = context.switchToHttp().getRequest();
    return account;
  },
);
