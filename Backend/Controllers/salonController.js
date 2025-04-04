import { getAllSalons, getSalonById } from "../Models/salonModel.js";

export const getAllSalonsHandler = (req, res) => {
  try {
    const salons = getAllSalons();
    res.json(salons);
  } catch (error) {
    console.error("Fel vid hämtning av salonger:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getSalonByIdHandler = (req, res) => {
  const { salonId } = req.params;
  if (!salonId) {
    return res.status(400).json({ error: "Salongens id saknas" });
  }
  try {
    const salon = getSalonById(salonId);
    if (!salon) {
      return res.status(404).json({ error: "Salongen hittades inte" });
    }
    res.json(salon);
  } catch (error) {
    console.error("Fel vid hämtning av salong:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};
