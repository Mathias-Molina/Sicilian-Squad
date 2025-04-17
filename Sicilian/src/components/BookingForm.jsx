export const BookingForm = ({ movieTitle, numPersons, handleNumPersonsChange, totalPrice }) => {
  return (
    <>
      <h1>Välj platser för filmvisning: {movieTitle}</h1>
      <div className="booking-form">
        <label>
          Antal personer:
          <select value={numPersons} onChange={handleNumPersonsChange}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <p>Totalpris: {totalPrice.toFixed(2)} kr</p>
      </div>
    </>
  );
};
