import { useState, useEffect } from "react";
import { getSalonById } from "../api/apiSalons";

export const useSalon = salonId => {
  const [salon, setSalon] = useState(null);
  const [loadingSalon, setLoadingSalon] = useState(true);
  const [errorSalon, setErrorSalon] = useState("");

  useEffect(() => {
    if (salonId) {
      getSalonById(salonId)
        .then(data => {
          setSalon(data);
          setLoadingSalon(false);
        })
        .catch(err => {
          setErrorSalon(err.message || "Fel vid hämtning av salondetaljer");
          setLoadingSalon(false);
        });
    }
  }, [salonId]);

  return { salon, loadingSalon, errorSalon };
};
