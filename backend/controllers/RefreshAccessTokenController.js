import { generateAccessToken } from "../utils.js";

export default (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.SECRET_KEY_REFRESH_TOKEN,
    (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    }
  );
};
