// ipfs.service.ts

import { Injectable } from '@nestjs/common';
import {create} from 'ipfs-http-client';
const projectId = "<your-infura-project-id>"
const projectSecret = "<your-infura-project-secret>"
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
@Injectable()
export class BlockchainService {
  private ipfs; // IPFS client instance

  constructor() {
     this.ipfs=create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      }
    })// Initialize IPFS client
  }

  async addImageToIpfs(imageBuffer: Buffer): Promise<string> {
    try {
      const result = await this.ipfs.add(imageBuffer); // Add image to IPFS
      const imageUrl = `https://ipfs.io/ipfs/${result.cid.toString()}`; // IPFS URL of the uploaded image
      return imageUrl;
    } catch (error) {
      throw new Error(`Failed to upload image to IPFS: ${error}`);
    }
  }
}
