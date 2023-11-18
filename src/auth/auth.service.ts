// auth.service.ts

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpModel } from './auth.model';
import { Model } from 'mongoose';
import { Auth } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectModel('newuser') private signUpModel: Model<SignUpModel>) {}

  async insertUser(createAuthDto: CreateAuthDto): Promise<Auth> {
    const { username, email } = createAuthDto;
    const existingUser = await this.signUpModel.findOne({ email }) || await this.signUpModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('User with the same email or username already exists');
    }
    
    // Omit the 'userid' field in createAuthDto to let MongoDB assign it
    const newUser = this.signUpModel.create(createAuthDto);
    return await newUser;
  }

  async findAll() {
    console.log('Fetching all users...');
    const users = await this.signUpModel.find().exec();
    console.log('Users:', users);
    return users.map(user => ({
      id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
      confirmpassword: user.confirmpassword,
    }));
  }
  
  async getUserByUsername(username: string) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }
    return {
      name: user.username
    };
  }

  async updateUserByUsername(username: string, updateAuthDto: UpdateAuthDto) {
    const { password, newpassword } = updateAuthDto;
    const user = await this.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (password && newpassword) {
      if (user.password !== password) {
        throw new BadRequestException('Incorrect password');
      }
      user.password = newpassword;
      return this.signUpModel.findOneAndUpdate({ username }, user, { new: true, lean: true, omitUndefined: true });
    } else {
      throw new BadRequestException('Both current password and new password are required');
    }
  }

  async deleteUser(username: string, password: string) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== password) {
      throw new BadRequestException('Incorrect password');
    }
    const result = await this.signUpModel.deleteOne({ username }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  private async findUserByUsername(username: string): Promise<SignUpModel> {
    let user;
    try {
      user = await this.signUpModel.findOne({ username }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
