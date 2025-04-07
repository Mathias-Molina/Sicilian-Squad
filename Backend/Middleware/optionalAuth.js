import jwt from "jsonwebtoken";
const SECRET_KEY = "secret_key";

const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // Ingen token – fortsätt utan att sätta req.user
    return next();
  }
  try {
    const userInfo = jwt.verify(token, SECRET_KEY);
    req.user = userInfo;
  } catch (err) {
    // Om token är ogiltig, logga felet och fortsätt utan att sätta req.user
    console.error("Ogiltigt token:", err);
  }
  next();
};

export default optionalAuth;