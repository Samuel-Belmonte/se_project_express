const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorizedError } = require("../utils/error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(unauthorizedError)
      .send({ message: "Authorization reuired" });
  }
  const token = authorization.repalace("Bearer", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(unauthorizedError)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  next();
};

module.exports = auth;
