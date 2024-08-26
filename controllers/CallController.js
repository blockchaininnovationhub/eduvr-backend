import CallModel from "../models/CallModel.js";
import { generateCallURL } from "../utils.js";

export const CreateCallController = async (req, res) => {
  try {
    const user = req.user._id;
    const url = generateCallURL();
    const call = new CallModel({ user: user, url });
    await call.save();

    return res.status(200).json({ _id: call._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

export const GetCallController = (req, res) => {
  const { id } = req.params;

  const call = CallModel.findOne({ _id: id });

  if (!call) {
    return res.status(404).json({ message: "There is no such call" });
  }

  return res.status(200).json(call);
};

export const MyCallController = (req, res) => {
  const user = req.user._id;

  const call = CallModel.find({ user });

  return res.status(200).json(call);
};

export const CallStatController = (req, res) => {
  const user = req.user._id;

  const call = CallModel.countDocuments({ user });

  return res.status(200).json({ totalCall: call });
};
