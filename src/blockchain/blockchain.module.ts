import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlDocumentSchema } from './entities/blockchain.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: 'UrlDocument' , schema: UrlDocumentSchema}])],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class BlockchainModule {}
