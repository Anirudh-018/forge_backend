import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadImageToIpfs(@UploadedFile() file: Express.Multer.File): Promise<string> {
  //   if (!file) {
  //     throw new Error('Please upload an image file');
  //   }

  //   const imageUrl = await this.blockchainService.addImageToIpfs(file.buffer);
  //   return imageUrl;
  // }
}
