import CallModel from "../models/CallModel.js";

export default async (req, res) => {
  try {
    const user = req.user;
    const call = new CallModel({ user });
    await call.save();

    return res.status(200).json({ callId: call._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "unexpected error occurred" });
  }
};
