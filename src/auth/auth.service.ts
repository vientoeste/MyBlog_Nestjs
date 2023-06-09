import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare as comparePw } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserLoginDto } from './dto/user-login.dto';
import { IssueTokenDto } from './dto/issue-token.dto';
import { TokenPayload } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  async login(user: UserLoginDto) {
    const authRes = await comparePw(user.plainPw, user.hashedPw);
    if (!authRes) {
      throw new UnauthorizedException('login failed');
    }

    return this.issueToken(user);
  }

  issueToken(user: IssueTokenDto) {
    const payload = { name: user.name, email: user.email };
    const { uuid } = user;

    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
      audience: uuid,
      issuer: process.env.JWT_ISS,
    });

    return token;
  }

  validateToken(jwtToken: string) {
    try {
      const payload = verify(jwtToken, process.env.JWT_SECRET) as (JwtPayload | string) & TokenPayload;
      const { aud, email } = payload;
      return {
        userUuid: aud,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
