import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  phonenumber?: number;
}
