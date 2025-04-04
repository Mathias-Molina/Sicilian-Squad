import { db } from "../Config/database.js";

export const getAllSalons = () => {
  const stmt = db.prepare("SELECT * FROM salons");
  return stmt.all();
};

export const getSalonById = salonId => {
  const stmt = db.prepare("SELECT * FROM salons WHERE salon_id = ?");
  return stmt.get(salonId);
};
