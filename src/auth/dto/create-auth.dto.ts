import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  confirmpassword: string;
}
