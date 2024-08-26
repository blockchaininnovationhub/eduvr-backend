import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  session: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Call", CallSchema);
