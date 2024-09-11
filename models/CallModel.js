import mongoose from "mongoose";
import { generateCallID, generateRandomString } from "../utils.js";

const CallSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: generateCallID },
  session: { type: String, required: false },
  user: { type: String, ref: "User", required: true },
  maxParticipants: { type: Number, required: true, default: 32 },
  status: { type: Boolean, required: true, default: true },
  socketSesssion: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const CallModel = mongoose.model("Call", CallSchema);

export default CallModel;
