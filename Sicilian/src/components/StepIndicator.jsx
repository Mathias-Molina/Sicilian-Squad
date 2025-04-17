export const StepIndicator = ({ currentStep }) => {
  const steps = [
    "1: Välj visning",
    "2: Välj antal",
    "3: Välj platser",
    "4: Boknings bekräftelse",
  ];

  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const number = i + 1;
        let statusClass;
        if (number < currentStep) statusClass = "completed";
        else if (number === currentStep) statusClass = "active";
        else statusClass = "upcoming";

        return (
          <div key={number} className={`step ${statusClass}`}>
            <span className="step-number">{number}</span>
            <span className="step-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
};
