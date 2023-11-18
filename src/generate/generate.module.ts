import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
