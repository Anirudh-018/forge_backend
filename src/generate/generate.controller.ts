import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateService } from './generate.service';
import { Request, Response } from 'express';
import { GenerateDto } from './dto/generateDto';

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
  @Get('getAll/:userName')
  async getAll(@Param('userName') userName: string) {
    return await this.generateService.getAll(userName);
  }
  @Post('/addToGallery')
  async addToGallery(@Query('username') username:string,@Query('fileName') fileName:string){
    return await this.generateService.addToGallery(username,fileName);
  }
  @Post('/generate')
  @UseInterceptors(FileInterceptor('file'))
  async generateImages(@Body() generateDto:GenerateDto,@UploadedFile() file: Express.Multer.File){
    console.log('req gen');
    return await this.generateService.generate(file.buffer,generateDto.userName,generateDto.prompt,file.originalname);
  }
}
