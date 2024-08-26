import {
  sortObjectProperties,
  lowercaseObjectProperties,
  objectHasher,
} from "../utils.js";
import {
  validateName,
  validateTimestampExpiry,
  validateWalletAddress,
} from "../validators/fieldValidators.js";
import UserModel from "../models/userModel.js";
import ValidationError from "../validators/exceptions.js";
import { verifySignature } from "../validators/signature.js";

export default async (req, res) => {
  const { username, walletAddress, signature, timestamp } = req.body;

  try {
    validateName(username);
    validateWalletAddress(walletAddress);
    validateTimestampExpiry(timestamp);

    const _user = sortObjectProperties(
      lowercaseObjectProperties({
        username,
        walletAddress,
      })
    );

    const _userHash = objectHasher(_user);

    verifySignature(signature, `${_userHash}:${timestamp}`);

    let getUserByEmail = await UserModel.findOne({ email });

    if (getUserByEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let getUserByWalletAddress = await UserModel.findOne({ email });

    if (getUserByWalletAddress) {
      return res.status(409).json({ message: "Wallet Address already exists" });
    }

    let user = await UserModel({ walletAddress, username });
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
