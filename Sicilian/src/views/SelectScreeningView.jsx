import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScreenings } from "../api/apiScreenings";
import { getAvailableSeats } from "../api/apiSeats";
import { StepIndicator } from "../components/StepIndicator";

export function SelectScreeningView() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [screeningList, setScreeningList] = useState([]);
  const [seatAvailabilityMap, setSeatAvailabilityMap] = useState({});
  const [isLoadingScreenings, setIsLoadingScreenings] = useState(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("");

  useEffect(() => {
    async function fetchScreeningsAndSeatAvailability() {
      try {
        setIsLoadingScreenings(true);
        setLoadingErrorMessage("");

        const screeningsFromServer = await getScreenings(movieId);

        const now = new Date();
        const futureScreenings = screeningsFromServer.filter(
          screening => new Date(screening.screening_time) > now
        );

        const availabilityArray = await Promise.all(
          futureScreenings.map(async screening => {
            const seatsForThisScreening = await getAvailableSeats(
              screening.screening_id
            );
            const totalNumberOfSeats = seatsForThisScreening.length;
            const numberOfAvailableSeats = seatsForThisScreening.filter(
              seat => seat.available
            ).length;

            return {
              screeningId: screening.screening_id,
              numberOfAvailableSeats,
              totalNumberOfSeats,
            };
          })
        );

        const availabilityObject = availabilityArray.reduce(
          (accumulator, availabilityItem) => {
            accumulator[availabilityItem.screeningId] = {
              availableSeats: availabilityItem.numberOfAvailableSeats,
              totalSeats: availabilityItem.totalNumberOfSeats,
            };
            return accumulator;
          },
          {}
        );

        setScreeningList(futureScreenings);
        setSeatAvailabilityMap(availabilityObject);
      } catch (error) {
        setLoadingErrorMessage(
          error.message || "Ett fel uppstod vid hämtning av visningar."
        );
      } finally {
        setIsLoadingScreenings(false);
      }
    }

    fetchScreeningsAndSeatAvailability();
  }, [movieId]);

  function handleScreeningClick(screeningId, salonId) {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  }

  if (isLoadingScreenings) {
    return <div>Laddar visningar...</div>;
  }

  if (loadingErrorMessage) {
    return <div className="text-red-600">Fel: {loadingErrorMessage}</div>;
  }

  return (
    <section>
      <StepIndicator activeSteps={[1]} />
      <h1>Välj framtida visning</h1>
      <ul>
        {screeningList.map(screening => {
          const availability =
            seatAvailabilityMap[screening.screening_id] || {};
          const availabilityText =
            availability.availableSeats != null
              ? `Lediga platser: ${availability.availableSeats} av ${availability.totalSeats}`
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
                  handleScreeningClick(
                    screening.screening_id,
                    screening.salon_id
                  )
                }
              >
                {new Date(screening.screening_time).toLocaleString()} –{" "}
                {screening.salon_name} – {screening.movie_title}
              </button>
              <span>{availabilityText}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
