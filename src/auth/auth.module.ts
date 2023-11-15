import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SignUpSchema } from './auth.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'newuser' , schema: SignUpSchema}])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
