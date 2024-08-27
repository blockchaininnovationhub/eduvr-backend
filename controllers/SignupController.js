import {
  validateTimestampExpiry,
  validateWalletAddress,
} from "../validators/fieldValidators.js";
import UserModel from "../models/userModel.js";
import ValidationError from "../validators/exceptions.js";
import { verifySignature } from "../validators/signature.js";

export default async (req, res) => {
  const { walletAddress, signature, timestamp } = req.body;

  try {
    validateWalletAddress(walletAddress);
    validateTimestampExpiry(timestamp);

    const lowerWalletAddress = walletAddress.toLowerCase();

    verifySignature(
      signature,
      `${lowerWalletAddress}:${timestamp}`,
      lowerWalletAddress
    );

    let getUserByWalletAddress = await UserModel.findOne({
      walletAddress: lowerWalletAddress,
    });

    if (getUserByWalletAddress) {
      return res.status(409).json({ message: "Wallet Address already exists" });
    }

    let user = await UserModel({ walletAddress: lowerWalletAddress });
    await user.save();

    return res.status(200).json({ message: "User successfully created" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Unexpected error:", error);
    return res.status(400).json({ message: "Unexpected error occurred" });
  }
};
