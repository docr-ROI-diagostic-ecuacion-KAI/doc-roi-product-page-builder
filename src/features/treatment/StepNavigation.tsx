import { steps } from "../../data/steps";
import type { StepId } from "../../schemas/productState";

interface StepNavigationProps {
  activeStep: StepId;
  progress: number;
  onSelect: (step: StepId) => void;
}

export function StepNavigation({ activeStep, progress, onSelect }: StepNavigationProps) {
  return (
    <aside className="step-sidebar" aria-label="Treatment steps">
      <div className="progress-summary">
        <span>PDP readiness</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className="step-list">
        {steps.map((step) => (
          <button
            type="button"
            key={step.id}
            className={activeStep === step.id ? "step-link active" : "step-link"}
            onClick={() => onSelect(step.id)}
          >
            <span>{step.number}</span>
            {step.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
