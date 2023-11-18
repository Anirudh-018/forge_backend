import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { profileSchema } from './profile.model';
import { ProfileController } from './profile.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'profile', schema: profileSchema }])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}