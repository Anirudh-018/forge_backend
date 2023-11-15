import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.insertUser(createAuthDto);
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


  @Post('/uploadTest')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file.buffer);
    return 'file API';
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
