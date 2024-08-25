import { generateAccessToken, generateRefreshAccessToken } from "../utils.js";
import {
  validateTimestampExpiry,
  validateWalletAddress,
} from "../validators/fieldValidators.js";
import UserModel from "../models/userModel.js";
import ValidationError from "../validators/exceptions.js";

export default async (req, res) => {
  const { walletAddress, signature, timestamp } = req.body;

  try {
    validateWalletAddress(walletAddress);
    validateTimestampExpiry(timestamp);

    const userData = sortObjectProperties(
      lowercaseObjectProperties({ walletAddress })
    );
    const userHash = objectHasher(userData);

    validateSignature(signature, `${userHash}:${timestamp}`);

    const lowerWalletAddress = walletAddress.toLowerCase();

    const user = await UserModel.findOne({ walletAddress: lowerWalletAddress });

    if (!user) {
      return res.status(404).json({ message: "Invalid wallet address" });
    }

    const refreshToken = generateRefreshAccessToken(user);

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error during login:", error);
    return res.status(500).json({ error: error.message });
  }
};
