import { getUser, createUser } from "../Models/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = "secret_key";

function generateJWT(userId, username) {
  const payload = {
    id: userId,
    username: username,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  return token;
}

export const registerUser = (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).send("All fields required");
  }

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Error hashing password");
    }

    try {
      const user = createUser(name, username, hash);

      if (user) {
        const token = generateJWT(user.user_id, user.user_username);
        res.json({ message: "User Created", token });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields required");
  }

  try {
    const user = getUser(username);

    if (user && password === user.user_password) {
      const token = generateJWT(user.user_id, user.user_username);
      res.json({ message: "Login succesful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
