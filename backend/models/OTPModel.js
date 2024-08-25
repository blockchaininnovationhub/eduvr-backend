import ValidationError from "../validators/exceptions.js";

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { authenticator } from "otplib";

const OTPSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: false, minlength: 6 },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

OTPSchema.methods.isExpired = function () {
  const now = Date.now();
  const expiryTime = new Date(this.createdAt).getTime() + 5 * 60 * 1000;
  return now > expiryTime;
};

OTPSchema.methods.markAsUsed = async function () {
  this.used = true;
  await this.save();
};

OTPSchema.statics.verifyOTP = async function (otp, userId) {
  const otpRecord = await this.findOne({ otp, userId });

  if (!otpRecord) {
    throw new ValidationError("Invalid OTP");
  }

  if (otpRecord.isExpired()) {
    throw new ValidationError("OTP has expired");
  }

  if (otpRecord.used) {
    throw new ValidationError("OTP has already been used");
  }

  return otpRecord;
};

OTPSchema.pre("save", function (next) {
  if (this.isNew || !this.otp) {
    this.otp = authenticator.generate(authenticator.generateSecret());
  }
  next();
});

export default mongoose.model("OTP", OTPSchema);
