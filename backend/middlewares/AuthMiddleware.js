export default (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
