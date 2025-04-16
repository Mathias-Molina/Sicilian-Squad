import { useState, useEffect } from "react";
import { getAvailableSeats } from "../api/apiSeats";

export const useSeat = (screeningId, numPersons) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTicketTypes, setSeatTicketTypes] = useState({});
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [errorSeats, setErrorSeats] = useState("");

  useEffect(() => {
    getAvailableSeats(screeningId)
      .then((data) => {
        setSeats(data);
        setLoadingSeats(false);
      })
      .catch((err) => {
        setErrorSeats(err.message || "Fel vid hämtning av lediga säten");
        setLoadingSeats(false);
      });
  }, [screeningId]);

  const toggleSeatSelection = (seatId, available) => {
    if (!available) return;

    let newSelectedSeats;
    if (selectedSeats.includes(seatId)) {
      newSelectedSeats = selectedSeats.filter((id) => id !== seatId);
      const newTicketTypes = { ...seatTicketTypes };
      delete newTicketTypes[seatId];
      setSeatTicketTypes(newTicketTypes);
    } else {
      if (selectedSeats.length < numPersons) {
        newSelectedSeats = [...selectedSeats, seatId];
        setSeatTicketTypes({ ...seatTicketTypes, [seatId]: "vuxen" });
      } else {
        // Hämta eventuellt upp hantering av felmeddelande utanför hooken
        return;
      }
    }
    setSelectedSeats(newSelectedSeats);
  };

  const handleTicketTypeChange = (seatId, newType) => {
    setSeatTicketTypes({
      ...seatTicketTypes,
      [seatId]: newType,
    });
  };

  return {
    seats,
    selectedSeats,
    seatTicketTypes,
    loadingSeats,
    errorSeats,
    toggleSeatSelection,
    handleTicketTypeChange,
    setSelectedSeats,
    setSeatTicketTypes,
  };
};
