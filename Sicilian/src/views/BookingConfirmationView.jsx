import { useLocation } from "react-router-dom"; {/*Maricel*/ }

export const BookingConfirmationView = () => {
    const { state } = useLocation();

    console.log("Booking state from navigate:", state); {/*Maricel --optional*/ }

    const { bookingNumber, bookingId, seats, ticketTypes, totalPrice, movieTitle, moviePoster } = state || {};

    if (!state) return <p>Ingen bokningsdata hittades.</p>;

    return (
        <section>
            <h1>Bokningsbekräftelse</h1>
            <p><strong>Bokningsnummer:</strong> {bookingNumber}</p>
            <p><strong>Totalt pris:</strong> {totalPrice} kr</p>
            <h3>Film:</h3>
            <p>{movieTitle || "Filmtitel saknas"}</p>

            {moviePoster && (
                <img
                    src={moviePoster}
                    alt={movieTitle}
                    style={{ width: "200px", marginBottom: "20px" }}
                />
            )}

            <h3>Valda platser:</h3>
            <ul>
                {seats.map((seatId, index) => (
                    <li key={seatId}>
                        Plats {seatId} - Typ: {ticketTypes[seatId]}
                    </li>
                ))}
            </ul>
        </section>
    );
};
