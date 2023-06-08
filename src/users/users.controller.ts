import {
  Body, Controller, DefaultValuePipe, Delete, Get, Headers, HttpCode, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, Res, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './dto/user-info.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

// [TODO] add service logic and res for each endpoints
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0)) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return;
  }

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

  @Get('/:userUuid')
  async getUserInfo(@Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
    @Headers() headers: Headers & { Authorization: string }): Promise<User> {
    const { Authorization: token } = headers;
    this.authService.verify(token);

    const userInfo = await this.usersService.getUserInfo(userUuid);

    return userInfo;
  }

  @HttpCode(204)
  @Delete('/:userUuid')
  async remove(
    @Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
  ) {
    await this.usersService.remove(userUuid).then((isRemoved) => {
      if (!isRemoved) {
        throw new NotFoundException('user not found');
      }
    });
  }
}
