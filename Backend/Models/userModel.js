import { db } from "../Config/database.js";

export const checkIfUserExist = username => {
  const stmt = db.prepare("SELECT * FROM users WHERE user_username = ? ");
  const user = stmt.get(username);
  return user || null;
};

export const createUser = (name, username, password) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO users (user_name, user_username, user_password) VALUES (?,?,?)"
    );
    const result = stmt.run(name, username, password);
    // Hämta och returnera det fullständiga användarobjektet baserat på t.ex. username
    const newUser = getUser(username);
    return newUser || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to create user in database");
  }
};
export const getUser = username => {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE user_username = ?");
    const user = stmt.get(username);
    return user || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to fetch user from database");
  }
};
