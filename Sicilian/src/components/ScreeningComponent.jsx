import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreeningList } from "./ScreeningList";
import { useScreeningsData } from "../hooks/useScreeningData";

export const ScreeningComponent = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [isCustom, setIsCustom] = useState(false);
  const { screenings, loading, error } = useScreeningsData(date, isCustom);

  const handleChangeDate = e => {
    setDate(e.target.value);
    setIsCustom(true);
  };

  const handleSelect = (screeningId, salonId) => {
    navigate(`/boka/screening/${screeningId}/${salonId}`);
  };

  return (
    <section className="screening-section">
      <h1 className="section-title">
        {isCustom
          ? `Visningar för ${date}`
          : "Visningar de närmaste tre dagarna"}
      </h1>

      <div className="date-picker-wrapper">
        <label htmlFor="screening-date" className="date-picker-label">
          Välj datum för visningar att boka:
        </label>
        <input
          id="screening-date"
          type="date"
          value={date}
          min={today}
          onChange={handleChangeDate}
          className="date-picker-input"
        />
      </div>

      <ScreeningList
        screenings={screenings}
        loading={loading}
        error={error}
        onSelect={handleSelect}
        isCustom={isCustom}
      />
    </section>
  );
};
