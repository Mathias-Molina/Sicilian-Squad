import { db } from "../Config/database.js";

export const getUser = (username) => {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE user_username = ?");
    const user = stmt.get(username);
    return user || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to fetch user from database");
  }
};
