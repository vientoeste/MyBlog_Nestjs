import {
  Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post, Request, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './dto/user-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/common/user.interface';

// [TODO] add service logic and res for each endpoints
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @HttpCode(201)
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    const res = await this.usersService.login(email, password);

    return res;
  }

  @UseGuards(AuthGuard)
  @Get('/:userUuid')
  async getUserInfo(
    @Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    const userAuthInfo = req.payload;
    if (userAuthInfo.userUuid !== userUuid) {
      throw new ForbiddenException('cannot access to other user info');
    }

    const userInfo = await this.usersService.getUserInfo(userUuid);
    return userInfo;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('/:userUuid')
  async remove(
    @Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
    @Request() req: RequestWithUser,
  ) {
    const userAuthInfo = req.payload;
    if (userAuthInfo.userUuid !== userUuid) {
      throw new ForbiddenException('cannot access to other user info');
    }

    await this.usersService.remove(userUuid).then((isRemoved) => {
      if (!isRemoved) {
        throw new NotFoundException('user not found');
      }
    });
  }
}
