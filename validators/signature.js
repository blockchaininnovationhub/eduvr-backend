import { verifyMessage } from "ethers";
import ValidationError from "./exceptions.js";

export const verifySignature = (signature, message, expectedAddress) => {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      throw new Error("Invalid signature");
    }
  } catch (error) {
    throw new ValidationError("Invalid signature");
  }
  return true;
};
