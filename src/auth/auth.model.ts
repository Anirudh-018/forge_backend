import mongoose, { Schema, Document, model, Types } from 'mongoose';
export interface SignUpModel extends Document {
  userid: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}
const SignUpSchema = new Schema<SignUpModel>(
  {
    userid: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId(), unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
  },
  { timestamps: true }
);
SignUpSchema.index({ email: 1, username: 1 }, { unique: true });
export const SignUpModel = mongoose.model<SignUpModel>('newuser', SignUpSchema);
export { SignUpSchema}; 