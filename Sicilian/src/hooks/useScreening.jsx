import { useState, useEffect } from "react";
import { getScreeningDetails } from "../api/apiScreenings";

export const useScreening = (screeningId) => {
  const [screeningDetails, setScreeningDetails] = useState({
    pricePerTicket: 0,
    movieTitle: "",
  });
  const [loadingScreening, setLoadingScreening] = useState(true);
  const [errorScreening, setErrorScreening] = useState("");

  useEffect(() => {
    getScreeningDetails(screeningId)
      .then((data) => {
        setScreeningDetails({
          pricePerTicket: data.screening_price,
          movieTitle: data.movie_title,
        });
        setLoadingScreening(false);
      })
      .catch((err) => {
        setErrorScreening(err.message || "Fel vid hämtning av screeningdetaljer");
        setLoadingScreening(false);
      });
  }, [screeningId]);

  return { ...screeningDetails, loadingScreening, errorScreening };
};