import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class IsActiveGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        if (user && user.onboarded) return true

        throw new ForbiddenException(
            '아직 온보딩 과정을 거치지 않은 계정입니다.'
        )
    }
}