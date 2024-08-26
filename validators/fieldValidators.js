import validator from "validator";
import { isAddress } from "ethers";
import ValidationError from "./exceptions.js";

const { isAlpha, isNumeric } = validator;

export const validateWalletAddress = (address) => {
  if (!address) throw new ValidationError("Wallet address is empty");
  if (!isAddress(address)) throw new ValidationError("Invalid address");
  return true;
};

export const validateName = (name) => {
  if (!name) throw new ValidationError("Name is empty");
  if (name.length > 15) throw new ValidationError("Name is too long");
  if (!isAlpha(name)) throw new ValidationError("Invalid name");
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
