export const ScreeningItem = ({ screening: s, onSelect }) => {
  const dt = new Date(s.screening_time);
  const dateStr = dt.toLocaleDateString();
  const timeStr = dt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { availableSeats, totalSeats } = s;
  const percent = totalSeats ? (availableSeats / totalSeats) * 100 : 0;

  let availabilityClass = "high-availability";
  if (percent < 30) availabilityClass = "low-availability";
  else if (percent < 70) availabilityClass = "medium-availability";

  const availabilityText =
    availableSeats === 0
      ? "Fullbokad"
      : `Lediga platser: ${availableSeats} av ${totalSeats}`;

  return (
    <li className="screening-item">
      <div className="screening-content">
        <div className="screening-info">
          {/* Filmnamn */}
          <p className="screening-movie">{s.movie_title}</p>
          {/* Tid */}
          <p className="screening-time">
            {dateStr} • {timeStr}
          </p>
          {/* Salong */}
          <p className="screening-salon">{s.salon_name}</p>
        </div>

        <div className="screening-availability">
          <p className={`seat-info ${availabilityClass}`}>{availabilityText}</p>
          <button
            className="select-button"
            onClick={() => onSelect(s.screening_id, s.salon_id)}
            disabled={availableSeats === 0}
          >
            Välj visning
          </button>
        </div>
      </div>
    </li>
  );
};
