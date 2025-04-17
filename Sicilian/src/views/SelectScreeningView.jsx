import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScreenings } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";

export function SelectScreeningView() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [listOfScreenings, setListOfScreenings] = useState([]);
  const [seatAvailabilityByScreening, setSeatAvailabilityByScreening] =
    useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    async function fetchScreeningsAndAvailability() {
      try {
        setIsLoading(true);
        setLoadingError("");

        const screeningsFromServer = await getScreenings(movieId);

        const availabilityArray = await Promise.all(
          screeningsFromServer.map(async screening => {
            const seatsForScreening = await getAvailableSeats(
              screening.screening_id
            );
            const totalNumberOfSeats = seatsForScreening.length;
            const numberOfFreeSeats = seatsForScreening.filter(
              seat => seat.available
            ).length;

            return {
              screeningId: screening.screening_id,
              freeSeats: numberOfFreeSeats,
              totalSeats: totalNumberOfSeats,
            };
          })
        );

        const availabilityObject = availabilityArray.reduce(
          (accumulator, availabilityItem) => {
            accumulator[availabilityItem.screeningId] = {
              freeSeats: availabilityItem.freeSeats,
              totalSeats: availabilityItem.totalSeats,
            };
            return accumulator;
          },
          {}
        );

        setListOfScreenings(screeningsFromServer);
        setSeatAvailabilityByScreening(availabilityObject);
      } catch (error) {
        setLoadingError(
          error.message || "Ett fel uppstod vid hämtning av data."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchScreeningsAndAvailability();
  }, [movieId]);

  function handleSelectScreening(screeningId, salonId) {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  }

  if (isLoading) {
    return <div>Laddar visningar...</div>;
  }

  if (loadingError) {
    return <div className="text-red-600">Fel: {loadingError}</div>;
  }

  return (
    <section>
      <h1>Välj visning</h1>
      <ul>
        {listOfScreenings.map(screening => {
          const availability =
            seatAvailabilityByScreening[screening.screening_id] || {};
          const availabilityText =
            availability.freeSeats != null
              ? `Lediga platser: ${availability.freeSeats} av ${availability.totalSeats}`
              : "Laddar lediga platser...";

          return (
            <li key={screening.screening_id} style={{ marginBottom: "8px" }}>
              <button
                style={{
                  marginRight: "12px",
                  textDecoration: "underline",
                  color: "#2563EB",
                }}
                onClick={() =>
                  handleSelectScreening(
                    screening.screening_id,
                    screening.salon_id
                  )
                }
              >
                {new Date(screening.screening_time).toLocaleString()} –{" "}
                {screening.salon_name}
              </button>
              <span>{availabilityText}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
