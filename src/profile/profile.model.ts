import mongoose, { Schema, Document, model, Types, ObjectId } from 'mongoose';

export interface ProfileModel extends Document {
  userid: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phonenumber: number;
}

export const profileSchema = new Schema<ProfileModel>(
  {
    userid: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phonenumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

profileSchema.index({ email: 1, username: 1 }, { unique: true });

export const ProfileModel = model<ProfileModel>('profile', profileSchema);
