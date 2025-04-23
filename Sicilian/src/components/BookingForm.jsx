export const BookingForm = ({
  movieTitle,
  numPersons,
  handleNumPersonsChange,
  totalPrice,
}) => (
  <>
    <h1 className="booking-form__title">Välj platser: {movieTitle}</h1>

    <div className="booking-form__form">
      <label className="booking-form__label">
        Antal personer:
        <select
          className="booking-form__select"
          value={numPersons}
          onChange={handleNumPersonsChange}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <p className="booking-form__total">
        Totalpris: {totalPrice.toFixed(2)} kr
      </p>
    </div>
  </>
);
