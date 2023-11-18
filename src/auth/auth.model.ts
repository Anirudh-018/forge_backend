import mongoose, { Schema, Document } from 'mongoose';

export interface SignUpModel extends Document {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}

export const SignUpSchema = new Schema<SignUpModel>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
  },
  { timestamps: true }
);

// SignUpSchema.index({ email: 1, username: 1 }, { unique: true });

export const SignUpModel = mongoose.model<SignUpModel>('newuser', SignUpSchema);
