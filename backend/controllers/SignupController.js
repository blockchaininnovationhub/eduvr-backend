import {
  sortObjectProperties,
  lowercaseObjectProperties,
  objectHasher,
} from "../utils.js";
import {
  validateEmail,
  validateName,
  validateOTP,
  validateTimestampExpiry,
  validateWalletAddress,
} from "../validators/fieldValidators.js";
import UserModel from "../models/userModel.js";
import OTPModel from "../models/OTPModel.js";
import ValidationError from "../validators/exceptions.js";
import { verifySignature } from "../validators/signature.js";

export const SignupVerificationController = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    walletAddress,
    otp,
    signature,
    timestamp,
  } = req.body;

  try {
    validateEmail(email);
    validateName(firstName);
    validateName(lastName);
    validateWalletAddress(walletAddress);
    validateOTP(otp);
    validateTimestampExpiry(timestamp);

    const _user = sortObjectProperties(
      lowercaseObjectProperties({ email, firstName, lastName, walletAddress })
    );

    const _userHash = objectHasher(_user);

    verifySignature(signature, `${_userHash}:${timestamp}`);

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(409).json({ message: "User does not exist" });
    }

    await OTPModel.verifyOTP(otp, user._id);
    await OTPModel.markAsUsed();

    user.firstName = firstName;
    user.lastName = lastName;
    user.walletAddress = walletAddress;
    user.isEmailVerified = true;

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

export const SignupController = async (req, res) => {
  const { email } = req.body;

  try {
    validateEmail(email);

    let user = await UserModel.findOne({ email });

    if (user && user.isEmailVerified) {
      return res.status(409).json({ message: "User already registered" });
    }

    if (!user) {
      user = new UserModel({ email });
      await user.save();
    }

    const otp = new OTPModel({ user: user });
    await otp.save();

    return res.status(200).json({ message: "Check your email for OTP" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};
