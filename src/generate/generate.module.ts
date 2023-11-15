import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from 'src/auth/jtw.service';
@Module({
  controllers: [GenerateController],
  providers: [GenerateService,JwtService],
  imports: [
    MulterModule.register({
      dest: './uploads', // Set the destination folder for temporary storage
    }),
  ],
})
export class GenerateModule {}
