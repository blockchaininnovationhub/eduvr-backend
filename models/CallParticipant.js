import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CallParticipantSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: uuidv4 },
  avatar: { type: String, required: true },
  call: { type: String, ref: "Call", required: true },
  position: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CallParticipantModel = mongoose.model("CallParticipant", CallParticipantSchema)

export default CallParticipantModel;
