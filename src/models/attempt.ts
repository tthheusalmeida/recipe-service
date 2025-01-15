import { Schema, model, Document } from "mongoose";

interface ILoginAttempt extends Document {
  ip: string;
  email: string;
  attempts: number;
  lastAttempt: Date;
}

const loginAttemptSchema = new Schema<ILoginAttempt>(
  {
    ip: { type: String, required: true },
    email: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    lastAttempt: { type: Date, required: true, default: new Date() },
  },
  { collection: "loginAttempts", timestamps: true }
);

const LoginAttempt = model<ILoginAttempt>("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;
