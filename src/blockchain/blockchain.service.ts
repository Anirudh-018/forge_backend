// ipfs.service.ts
import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JsonRpcProvider } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlDocument } from './entities/blockchain.entity';
// import {create} from 'ipfs-http-client';
const fs = require('fs')
@Injectable()
export class BlockchainService {
  constructor(@InjectModel('UrlDocument') private readonly urlModel: Model<UrlDocument>) {}
  
  pinFileToIPFS = async (username,name) => {
    try {
      const existingDocument = await this.urlModel.findOne();
      let data = new FormData()
      data.append('file', fs.createReadStream(`${username}/${name}`))
      data.append('pinataOptions', '{"cidVersion": 0}')
      data.append('pinataMetadata', '{"name": "pinnie"}')
  
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        headers: {
          'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMWIxZmZiZC1mZDcxLTRkNzUtOTZmOC01OTdmZjUxZmNhNTgiLCJlbWFpbCI6Im1lbm9uYW5pN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDQyMDIyN2QxY2QzZDhhZGM5MzUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZGIyYzdlNDk4MTFlY2U1YmNkMjY0ODYyYjc0NGFhODNiY2RjYWZlNWQ0Nzg3ZTRhMjQzNTIwYTM1NmUwMDNiIiwiaWF0IjoxNzAwODQ2NzczfQ.iz5T-ZoQkcg54ALalzBhlosXAy6-pGQi3ShiJSdLTfQ'}`
        }
      })
      console.log(res.data)
      if (existingDocument) {
        // Update existing document
        existingDocument.urls = [`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`];
        return existingDocument.save();
      } else {
        // Create new document
        const newDocument = new this.urlModel( [`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`]);
        return newDocument.save();
      }
      console.log(`View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`)
    } catch (error) {
      console.log(error)
    } 
  }
  async getDocument(): Promise<UrlDocument | null> {
    return this.urlModel.findOne();
  }
    // private ipfs; // IPFS client instance

  // constructor() {
  //    this.ipfs=create({
  //     host: 'ipfs.infura.io',
  //     port: 5001,
  //     protocol: 'https',
  //     headers: {
  //         authorization: auth,
  //     }
  //   })// Initialize IPFS client
  // }

  // async addImageToIpfs(imageBuffer: Buffer): Promise<string> {
  //   try {
  //     const result = await this.ipfs.add(imageBuffer); // Add image to IPFS
  //     const imageUrl = `https://ipfs.io/ipfs/${result.cid.toString()}`; // IPFS URL of the uploaded image
  //     return imageUrl;
  //   } catch (error) {
  //     throw new Error(`Failed to upload image to IPFS: ${error}`);
  //   }
  // }
}
