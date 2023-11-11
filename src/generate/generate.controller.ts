import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    console.log(file.filename);
    const result = await this.generateService.uploadToFirebase(file.buffer, file.originalname);
    return result;
  }
}
