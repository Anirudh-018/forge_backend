import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseInterceptors, UploadedFile, Res, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response,Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.insertUser(createAuthDto);
  }

   @Post('login')
   async login(@Query('username') username: string,@Query('password') password:string,@Res() res:Response) {
    res.status(200).send(await this.authService.checkUser(username,password));
   }

  @Get()
findAll() {
  console.log('Received request to fetch all users...');
  return this.authService.findAll();
}

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.authService.getUserByUsername(username);
  }


  @Patch(':username')
  async updatePassword(@Param('username') username: string, @Body() updateAuthDto: UpdateAuthDto) {
    try {
      const updatedUser = await this.authService.updateUserByUsername(username, updateAuthDto);
      return {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        password: updatedUser.password,
        confirmpassword: updatedUser.confirmpassword,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with username ${username} not found`);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Delete(':username')
  async removeUser(@Param('username') username: string, @Body() updateAuthDto: UpdateAuthDto) {
    try {
      await this.authService.deleteUser(username, updateAuthDto.password);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'User not found', error: 'Not Found', statusCode: 404 };
      }
      throw error;
    }
  }
}
