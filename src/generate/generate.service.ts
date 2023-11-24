import { Body, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as admin from 'firebase-admin';
import { Stream } from 'stream';
import * as ser from '../forge-backend-8b8e6-firebase-adminsdk-t1wlt-44eb6b3dee.json'
import { GenerateDto } from './dto/generateDto';
import axios from 'axios';
@Injectable()
export class GenerateService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const admin = require('firebase-admin');
    const serviceAccount = require('../forge-backend-8b8e6-firebase-adminsdk-t1wlt-44eb6b3dee.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'gs://forge-backend-8b8e6.appspot.com', // Replace with your actual storage bucket URL
    });

    this.storage = admin.storage();
  }

  async uploadToFirebase(fileBuffer: Buffer, originalname: string): Promise<string> {
    const bucket = this.storage.bucket('gs://forge-backend-8b8e6.appspot.com');
    const file = bucket.file(`images/${originalname}`);
    const stream = file.createWriteStream();

    return new Promise<string>((resolve, reject) => {
      const bufferStream = new Stream.PassThrough();

      bufferStream.end(fileBuffer);

      // Use pipe to connect the bufferStream to the write stream
      bufferStream.pipe(stream);

      stream.on('finish', () => {
        resolve(`File uploaded to Firebase Storage: ${originalname}`);
      });

      stream.on('error', (error) => {
        reject(`Failed to upload file to Firebase Storage: ${error}`);
      });
    });
  }

  async getFile(fileName: string){
    try {
      const file=await this.storage
      .bucket()
      .file(`images/${fileName}`);
      await file.makePublic();
      const [metadata]=await file.getMetadata();
      return metadata.mediaLink;
    }
      catch (error) {
      // Handle errors (e.g., file not found, retrieval failure)
      throw new Error(`Error listing file ${fileName}: ${error.message}`);
    }
  }
  async getAll(userName: string){
    const prefix = "images/"+userName+"/generatedImages";
    try {
      var links=[];
      const [files] = await this.storage.bucket().getFiles({ prefix });
      files.forEach(file => {
        file.makePublic();
        // const [metadata]=await file.getMetadata()
        console.log(file.name)
        links.push(file.metadata.mediaLink)
      });
      return links.slice(1,links.length);
    } catch (error) {
      throw new Error(`Error listing files in ${userName}: ${error.message}`);
    }
  }
  async getAllGallery(userName: string){
    const prefix = "images/"+userName+"/gallery";
    try {
      var links=[];
      const [files] = await this.storage.bucket().getFiles({ prefix });
      files.forEach(file => {
        file.makePublic();
        // const [metadata]=await file.getMetadata()
        console.log(file.name)
        links.push(file.metadata.mediaLink)
      });
      return links.slice(1,links.length);
    } catch (error) {
      throw new Error(`Error listing files in ${userName}: ${error.message}`);
    }
  }
  async addToGallery(username: string, fileName:string){
    const sourceFile = this.storage.bucket().file(`images/${username}/generatedImages/${fileName}`);
    const destinationFile = this.storage.bucket().file(`images/${username}/gallery/${fileName}`)
    await sourceFile.move(destinationFile);
    return 'File moved successfully to gallery';
  }

  async generate(image:Buffer,userName:string,prompt:string,originalName:string){
    try {
      await this.uploadToFirebase(image,originalName);
      const url=await this.getFile(originalName);
      const data={
        image:url,
        userId:userName,
        prompt:prompt
      }
      const response = await axios.post('http://127.0.0.1:5000/generate_images',data );
      console.log(response.data);
      return response.data; // Return response data
    } catch (error) {
      // Handle errors
      console.error('Error posting to generate_images:', error);
      throw error;
    }
  }
}
