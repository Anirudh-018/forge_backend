import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('profile') private profileModel: Model<ProfileModel>) {}

  async userDetails(createProfileDto: CreateProfileDto): Promise<ProfileModel> {
    const { email, username } = createProfileDto;
    const existingUser = await this.profileModel.findOne({ email }) || await this.profileModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('User with the same email or username already exists');
    }
    const newProfile = await this.profileModel.create(createProfileDto);
    return newProfile.toObject();
  }

  async updateUserByUserId(userid: string, updateProfileDto: UpdateProfileDto): Promise<ProfileModel> {
    try {
      const user = await this.findUserByUserId(userid);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.keys(updateProfileDto).forEach((key) => {
        if (updateProfileDto[key] !== undefined) {
          user[key] = updateProfileDto[key];
        }
      });
      const updatedProfile = await user.save();
      return updatedProfile.toObject();
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Error updating user');
    }
  }

  private async findUserByUserId(userid: string): Promise<ProfileModel> {
    try {
      const user = await this.profileModel.findOne({ userid });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
  }

  async findAll() {
    console.log('Fetching all users...');
    const users = await this.profileModel.find().exec();
    console.log('Users:', users);
    return users.map(user => ({
      id: user._id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      phonenumber: user.phonenumber
    }));
  }
}
