import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { v5 } from 'uuid';
import { User } from './dto/user-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) { }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email, name);

    const signupVerifyToken = v5(email.concat(new Date().toISOString()), process.env.NAMESPACE_UUID);

    const salt = await genSalt(12);
    const hashedPw = await hash(password, salt);

    await this.saveUser(name, email, hashedPw, signupVerifyToken);
  }

  private async checkUserExists(email: string, name: string) {
    const userInfo = await this.usersRepository.find({
      where: [{ email }, { name }],
    });
    if (userInfo.length !== 0) {
      throw new UnprocessableEntityException(`duplicate ${userInfo[0].email === email ? 'email' : 'name'}`);
    }
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.checkUserExists(email, name);

    const user = new UserEntity();
    user.uuid = v5(name, process.env.NAMESPACE_UUID);
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.authService.issueToken({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, plainPw: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.authService.login({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      plainPw: plainPw,
      hashedPw: user.password,
    });
  }

  async getUserInfo(uuid: string): Promise<User> {
    const userInfo = await this.usersRepository.findOne({
      where: { uuid },
    });

    if (!userInfo) {
      throw new NotFoundException('user not found');
    }

    return {
      uuid: userInfo.uuid,
      name: userInfo.name,
      email: userInfo.email,
    };
  }

  async remove(uuid: string) {
    const res = await this.usersRepository.delete({ uuid });
    if (res.affected !== 1) {
      return false;
    }
    return true;
  }
}
