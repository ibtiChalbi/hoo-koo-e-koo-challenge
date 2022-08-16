import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    let bearerToken = req.headers.authorization;
    if (bearerToken && bearerToken.split(" ").length > 0) {
      let data = this.authService.decodeToken(bearerToken.split(" ")[1]);
      if (data && data.user) req.body["user"] = data.user;
    }

    return next.handle();
  }
}
