export default async (req, res) => {
  const user = req.user._id;

  return res.status(200).json(user);
};
