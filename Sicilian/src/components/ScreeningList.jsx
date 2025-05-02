import { ScreeningItem } from "./ScreeningItem";
export const ScreeningList = ({
  screenings,
  loading,
  error,
  onSelect,
  isCustom,
}) => {
  if (loading) return <div className="loading-message">Laddar visningar…</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (screenings.length === 0) {
    return (
      <p className="no-screenings">
        {isCustom
          ? "Inga visningar det datumet."
          : "Inga visningar de närmaste tre dagarna."}
      </p>
    );
  }

  return (
    <ul className="screening-list">
      {screenings.map(s => (
        <ScreeningItem key={s.screening_id} screening={s} onSelect={onSelect} />
      ))}
    </ul>
  );
};
