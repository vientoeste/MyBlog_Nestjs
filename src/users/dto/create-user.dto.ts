import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  readonly password: string;
}
