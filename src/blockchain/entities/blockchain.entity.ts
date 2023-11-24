import * as mongoose from 'mongoose';

export const UrlDocumentSchema = new mongoose.Schema({
  urls: [{ type: String, required: true }],
});

export interface UrlDocument extends mongoose.Document {
  urls: string[];
}