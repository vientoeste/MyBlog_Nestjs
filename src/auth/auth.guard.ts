import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RequestWithUser } from 'src/common/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>();
    return this.validateReq(req);
  }

  private validateReq(req: RequestWithUser) {
    const token: string = req.headers.authorization;
    if (!token) {
      throw new BadRequestException('token not found');
    }

    this.authService.validateToken(token);

    return true;
  }
}
