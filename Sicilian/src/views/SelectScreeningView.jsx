import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScreenings } from '../api/apiScreenings';
import { getAvailableSeats } from '../api/apiSeats';
import { StepIndicator } from '../components/StepIndicator';

export function SelectScreeningView() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [screeningList, setScreeningList] = useState([]);
  const [seatAvailabilityMap, setSeatAvailabilityMap] = useState({});
  const [isLoadingScreenings, setIsLoadingScreenings] = useState(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState('');

  useEffect(() => {
    async function fetchScreeningsAndSeatAvailability() {
      try {
        setIsLoadingScreenings(true);
        setLoadingErrorMessage('');

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
          error.message || 'Ett fel uppstod vid hämtning av visningar.'
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
    return <div className='text-red-600'>Fel: {loadingErrorMessage}</div>;
  }

  return (
    <section className='screening-section'>
      <StepIndicator currentStep={1} />
<<<<<<< HEAD
      <h1 className='section-title'>Välj framtida visning</h1>
=======
      <h1>Välj visning</h1>
      <ul>
        {screeningList.map(screening => {
          const availability =
            seatAvailabilityMap[screening.screening_id] || {};
          const availabilityText =
            availability.availableSeats != null
              ? `Lediga platser: ${availability.availableSeats} av ${availability.totalSeats}`
              : "Laddar lediga platser...";
>>>>>>> origin

      {screeningList.length === 0 ? (
        <p>Inga kommande visningar tillgängliga.</p>
      ) : (
        <ul className='screening-list'>
          {screeningList.map(screening => {
            const availability =
              seatAvailabilityMap[screening.screening_id] || {};
            const availableSeats = availability.availableSeats || 0;
            const totalSeats = availability.totalSeats || 0;
            const percentAvailable = totalSeats
              ? (availableSeats / totalSeats) * 100
              : 0;

            let availabilityClass = 'high-availability';
            if (percentAvailable < 30) availabilityClass = 'low-availability';
            else if (percentAvailable < 70)
              availabilityClass = 'medium-availability';

            const availabilityText =
              availability.availableSeats != null
                ? `Lediga platser: ${availability.availableSeats} av ${availability.totalSeats}`
                : 'Laddar lediga platser...';

            return (
              <li key={screening.screening_id} className='screening-item'>
                <div className='screening-content'>
                  <div className='screening-info'>
                    <p className='screening-time'>
                      {new Date(screening.screening_time).toLocaleDateString()}{' '}
                      •{' '}
                      {new Date(screening.screening_time).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                    <p className='screening-salon'>{screening.salon_name}</p>
                  </div>

                  <div className='screening-availability'>
                    <p className={`seat-info ${availabilityClass}`}>
                      Lediga platser:
                      {availability.availableSeats !== null
                        ? ` ${availability.availableSeats} av ${availability.totalSeats}`
                        : 'Laddar lediga platser...'}
                    </p>
                    <button
                      onClick={() =>
                        handleScreeningClick(
                          screening.screening_id,
                          screening.salon_id
                        )
                      }
                      className='select-button'
                    >
                      Välj biljetter
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
