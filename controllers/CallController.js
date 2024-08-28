import CallModel from "../models/CallModel.js";
import CallParticipantModel from "../models/CallParticipant.js";
import { generateRandomString } from "../utils.js";

export const CreateCallController = async (req, res) => {
  try {
    const user = req.user;

    const call = new CallModel({
      user: user._id,
      session: generateRandomString(),
    });
    await call.save();

    return res.status(200).json(call);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

export const GetCallController = async (req, res) => {
  const { id } = req.params;

  const call = await CallModel.findOne({ _id: id });

  if (!call) {
    return res.status(404).json({ message: "There is no such call" });
  }

  return res.status(200).json(call);
};

export const MyCallController = async (req, res) => {
  const user = req.user._id;

  const call = await CallModel.find({ user });

  return res.status(200).json(call);
};

export const CallStatController = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await CallModel.aggregate([
      {
        $match: { user: userId },
      },
      {
        $facet: {
          totalCalls: [{ $count: "count" }],
          activeCalls: [{ $match: { status: true } }, { $count: "count" }],
        },
      },
    ]);

    const totalCalls = stats[0].totalCalls.length
      ? stats[0].totalCalls[0].count
      : 0;
    const activeCalls = stats[0].activeCalls.length
      ? stats[0].activeCalls[0].count
      : 0;

    return res.status(200).json({ totalCalls, activeCalls });
  } catch (error) {
    console.error("Error in CallStatController:", error);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

export const DeactivateCallController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { callId } = req.params;

    const call = await CallModel.findOne({ _id: callId, user: userId });

    if (!call) {
      return res
        .status(404)
        .json({ message: "Call not found or you are not the owner" });
    }

    call.status = false;
    await call.save();

    return res.status(200).json({ message: "Call deactivated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

export const GetCallParticipants = async (req, res) => {
  const { callId } = req.params;

  try {
    // Fetch participants for the given call ID
    const participants = await CallParticipantModel.find({
      call: callId,
    });

    res.status(200).json(participants);
  } catch (error) {
    console.error("Error fetching call participants:", error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
