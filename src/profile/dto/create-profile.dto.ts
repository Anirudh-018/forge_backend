import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, isNotEmpty } from 'class-validator';

export class CreateProfileDto {

  @IsString()
  @IsNotEmpty()
  firstname: string;
  
  @IsString()
  @IsNotEmpty()
  lastname: string;
  
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phonenumber: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

}
