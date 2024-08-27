import mongoose from "mongoose";

const CallParticipantSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  avatar: { type: String, required: true },
  position: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CallParticipant", CallParticipantSchema);
