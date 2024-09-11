import CallParticipant from "../models/CallParticipant.js";
import Call from "../models/CallModel.js";

const CreateCallParticipant = async (data) => {
  try {
    const { avatar, position, callId } = data;

    if (!avatar || typeof avatar !== "number") {
      return "Invalid or missing avatar";
    }

    if (!position || typeof position !== "number" || position < 1) {
      return "Invalid or missing position. Must be a positive number.";
    }

    if (!callId || typeof callId !== "string") {
      return "Invalid or missing callId'";
    }

    const call = await Call.findById(callId);

    if (!call) {
      return "Invalid or missing callId'";
    }

    const existingParticipant = await CallParticipant.findOne({
      call,
      position,
    });

    if (existingParticipant) {
      return "Invalid or missing callId'";
    }

    const participantCount = await CallParticipant.countDocuments({
      call: callId,
    });

    if (participantCount >= call.maxParticipants) {
      return "Invalid or missing callId'";
    }

    const newParticipant = new CallParticipant({
      avatar,
      position,
      call: callId,
    });

    await newParticipant.save();

    return newParticipant;
  } catch (error) {
    console.log(error);
    return "Unexpected error";
  }
};

export default CreateCallParticipant;
