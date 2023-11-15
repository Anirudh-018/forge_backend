import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GenerateModule } from './generate/generate.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads', // Set the destination folder for temporary storage
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([]),
    AuthModule,
    GenerateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}

