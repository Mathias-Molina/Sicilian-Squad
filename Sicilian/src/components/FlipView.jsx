export function FlipView({ flipped, front, back }) {
  return (
    <div className={`flip-container ${flipped ? "flipped" : ""}`}>
      <div className="flipper">
        <div className={`front ${flipped && "hide"}`}>{front}</div>
        <div className={`back ${!flipped && "hide"}`}>{back}</div>
      </div>
    </div>
  );
}
