export const TicketTypeInfo = () => {
  return (
    <div className="ticket-info-popup">
      <strong>Biljettkategorier:</strong>
      <ul>
        <li>
          <strong>Vuxen</strong>: Ordinarie pris
        </li>
        <li>
          <strong>Pensionär</strong>: 80% – pensionärskort krävs
        </li>
        <li>
          <strong>Barn</strong>: 50% – gäller upp till 12 år
        </li>
      </ul>
    </div>
  );
};
