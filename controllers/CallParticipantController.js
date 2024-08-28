import CallParticipant from "../models/CallParticipant.js";
import Call from "../models/CallModel.js";

const CreateCallParticipant = async (req, res) => {
  try {
    const { avatar, position, callId } = req.body;

    if (!avatar || typeof avatar !== "number") {
      return res.status(400).json({ message: "Invalid or missing avatar" });
    }

    if (!position || typeof position !== "number" || position < 1) {
      return res.status(400).json({
        message: "Invalid or missing position. Must be a positive number.",
      });
    }

    if (!callId || typeof callId !== "string") {
      return res.status(400).json({ message: "Invalid or missing callId'" });
    }

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    const existingParticipant = await CallParticipant.findOne({
      call,
      position,
    });

    if (existingParticipant) {
      return res.status(400).json({ message: "Position already taken" });
    }

    const participantCount = await CallParticipant.countDocuments({
      call: callId,
    });

    if (participantCount >= call.maxParticipants) {
      return res.status(400).json({ message: "Maximum participants reached" });
    }

    const newParticipant = new CallParticipant({
      avatar,
      position,
      call: callId,
    });

    await newParticipant.save();

    return res.status(201).json(newParticipant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export default CreateCallParticipant;
