import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stream } from 'stream';
@Injectable()
export class GenerateService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const admin = require('firebase-admin');
    const serviceAccount = require('../forge-backend-8b8e6-firebase-adminsdk-t1wlt-44eb6b3dee.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket:"gs://forge-backend-8b8e6.appspot.com", // Replace with your actual storage bucket URL
    });

    this.storage = admin.storage();
  }

  async uploadToFirebase(fileBuffer: Buffer, originalname: string): Promise<string> {
    const bucket = this.storage.bucket("gs://forge-backend-8b8e6.appspot.com");
    const file = bucket.file(`images/${originalname}`);
    const stream = file.createWriteStream();
  
    return new Promise<string>((resolve, reject) => {
      const bufferStream = new Stream.PassThrough();
  
      bufferStream.end(fileBuffer);
      bufferStream.pipe(stream);
  
      stream.on('finish', () => {
        resolve(`File uploaded to Firebase Storage: ${originalname}`);
      });
  
      stream.on('error', (error) => {
        reject(`Failed to upload file to Firebase Storage: ${error}`);
      });
    });
  }
}
