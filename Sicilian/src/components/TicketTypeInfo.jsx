export const TicketTypeInfo = () => {
  return (
    <div className="ticket-info-popup">
      <strong>Biljettkategorier:</strong>
      <ul>
        <li>
          <strong>Vuxen</strong>: Ordinarie pris
        </li>
        <li>
          <strong>Student</strong>: 80% – studentkort krävs
        </li>
        <li>
          <strong>Barn</strong>: 50% – gäller upp till 12 år
        </li>
      </ul>
    </div>
  );
};
