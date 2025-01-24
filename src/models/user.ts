import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String },
    verificationCodeExpiresAt: { type: Date },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
