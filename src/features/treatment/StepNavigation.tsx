import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { steps } from "../../data/steps";
import type { ProductTreatmentState, StepId } from "../../schemas/productState";

interface StepNavigationProps {
  activeStep: StepId;
  progress: number;
  state: ProductTreatmentState;
  onSelect: (step: StepId) => void;
}

export function StepNavigation({ activeStep, progress, state, onSelect }: StepNavigationProps) {
  return (
    <aside className="step-sidebar" aria-label="Treatment steps">
      <div className="progress-summary">
        <span>Step {String(steps.findIndex((step) => step.id === activeStep) + 1).padStart(2, "0")} of 15</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className="step-list">
        {steps.map((step) => {
          const status = getStepStatus(step.id, state);
          const StatusIcon = status === "complete" ? CheckCircle2 : status === "warning" ? AlertTriangle : Circle;
          return (
            <button
              type="button"
              key={step.id}
              className={`step-link ${activeStep === step.id ? "active" : ""} ${status}`}
              onClick={() => onSelect(step.id)}
              aria-current={activeStep === step.id ? "step" : undefined}
            >
              <span className="step-number">{step.number}</span>
              <span className="step-title-label">{step.title}</span>
              <StatusIcon size={15} aria-label={status} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function getStepStatus(stepId: StepId, state: ProductTreatmentState) {
  switch (stepId) {
    case "productPromise":
      return state.brand.brand && state.product.productName && state.product.productPromise ? "complete" : "warning";
    case "identity":
      return state.identity.sku && state.identity.gtin ? "complete" : "warning";
    case "media":
      return state.media.some((asset) => asset.blobKey) ? "complete" : "warning";
    case "pricing":
      return state.pricing.grossPrice > 0 && state.pricing.taxRate >= 0 ? "complete" : "warning";
    case "inventory":
      return state.inventory.stockQty >= 0 && state.inventory.stockStatus ? "complete" : "warning";
    case "ctas":
      return state.ctas.primary.enabled && state.ctas.primary.label ? "complete" : "warning";
    default:
      return "pending";
  }
}