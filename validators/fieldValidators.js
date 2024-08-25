import validator from "validator";
import { isAddress } from "ethers";
import ValidationError from "./exceptions.js";

const { isEmail, isAlpha, isNumeric } = validator;

export const validateEmail = (email) => {
  if (!email) throw new ValidationError("Email is empty");
  if (email.length > 255) throw new ValidationError("Email is too long");
  if (!isEmail(email)) throw new ValidationError("Invalid email");
  return true;
};

export const validateWalletAddress = (address) => {
  if (!address) throw new ValidationError("Wallet address is empty");
  if (!isAddress(address)) throw new ValidationError("Invalid address");
  return true;
};

export const validateName = (name) => {
  if (!name) throw new ValidationError("Name is empty");
  if (name.length > 63) throw new ValidationError("Name is too long");
  if (!isAlpha(name)) throw new ValidationError("Invalid name");
  return true;
};

export const validateOTP = (otp) => {
  if (!otp) throw new ValidationError("OTP is empty");
  if (typeof otp !== "string")
    throw new ValidationError("OTP must be a string");

  const otpPattern = /^[0-9]{6}$/;
  if (!otpPattern.test(otp)) {
    throw new ValidationError("OTP must be a 6-digit number");
  }
  return true;
};

export const validateTimestampExpiry = (timestamp) => {
  if (!timestamp) throw new ValidationError("Timestamp is empty");
  if (!isNumeric(timestamp))
    throw new ValidationError("Timestamp must be a number");
  if (Date.now() > timestamp)
    throw new ValidationError("Timestamp is in the past");
  if (timestamp > Date.now() + 30 * 1000)
    throw new ValidationError("Timestamp is in the future");
  return true;
};
