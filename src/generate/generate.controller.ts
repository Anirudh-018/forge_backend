import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateService } from './generate.service';
import { Request, Response } from 'express';

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post('/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.generateService.uploadToFirebase(
      file.buffer,
      file.originalname,
    );
    return result;
  }

  @Get('getFile/:fileName')
  async getFile(@Param('fileName') fileName: string,@Req() req:Request) {

    return {"file_url":await this.generateService.getFile(fileName)};
  }
  @Get('getAll/:folderName')
  async getAll(@Param('folderName') folderName: string) {
    return await this.generateService.getAll(folderName);
  }
}
