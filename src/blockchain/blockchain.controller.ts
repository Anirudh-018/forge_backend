import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlockchainService } from './blockchain.service';
import axios from 'axios';
const fs = require('fs')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
  @Post('upload')
  async uploadFile(@Query('name') name:string,@Query('username') username:string){
    const result=await this.blockchainService.pinFileToIPFS(username,name);
    return result;
    // return pinata.uploadToIPFS(,file.buffer,metadata)
  }
  @Get('get')
  async getDocument() {
    return this.blockchainService.getDocument();
  }
}
