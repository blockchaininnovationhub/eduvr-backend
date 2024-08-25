import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CallSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Call", CallSchema);
