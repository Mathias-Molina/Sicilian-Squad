import { getUser } from "../Models/userModel.js";

import jwt from "jsonwebtoken";

const SECRET_KEY = "secret_key";

function generateJWT(userId, username) {
  const payload = {
    id: userId,
    username: username,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  return token;
}

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields required");
  }

  try {
    const user = getUser(username);

    if (user && password === user.password) {
      const token = generateJWT(user.user_id, user.user_username);
      res.json({ message: "Login succesful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
