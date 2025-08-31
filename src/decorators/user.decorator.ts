import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInRequest } from 'src/auth/types/user-request.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserInRequest = request.user
    return user
  },
);