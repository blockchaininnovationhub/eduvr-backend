import CallParticipant from "../models/CallParticipant.js";
import Call from "../models/CallModel.js";

const GetAvailablePositions = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    const occupiedPositions = await CallParticipant.find({
      call: callId,
    }).select("position");

    const allPositions = Array.from(
      { length: call.maxParticipants },
      (_, i) => i + 1
    );

    const availablePositions = allPositions.filter(
      (pos) =>
        !occupiedPositions.some((participant) => participant.position === pos)
    );

    return res.status(200).json({ availablePositions });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export default GetAvailablePositions;
