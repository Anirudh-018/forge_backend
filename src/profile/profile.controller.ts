import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  userDetails(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.userDetails(createProfileDto);
  }

  @Patch(':userid')
  async updateUserByUserId(@Param('userid') userid: string, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      const updatedProfile = await this.profileService.updateUserByUserId(userid, updateProfileDto);
      return {
        firstname: updatedProfile.firstname,
        lastname: updatedProfile.lastname,
        username: updatedProfile.username,
        email: updatedProfile.email,
        phonenumber: updatedProfile.phonenumber,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
  @Get()
  findAll() {
    console.log('Received request to fetch all users...');
    return this.profileService.findAll();
  }
}