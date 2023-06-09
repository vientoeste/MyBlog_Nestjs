import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/common/user.interface';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token: string = request.headers.authorization;
    if (token) {
      const payload = this.authService.validateToken(token);
      request.payload = payload;
    }

    return next.handle();
  }
}
