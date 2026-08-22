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
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  return (
    <aside className="step-sidebar" aria-label="Treatment steps">
      <div className="progress-summary">
        <span>Step {String(activeIndex + 1).padStart(2, "0")} of 09</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true"><div style={{ width: `${progress}%` }} /></div>
      <div className="step-list">
        {steps.map((step) => {
          const status = getStepStatus(step.id, state);
          const StatusIcon = status === "complete" ? CheckCircle2 : status === "warning" ? AlertTriangle : Circle;
          return <button type="button" key={step.id} className={`step-link ${activeStep === step.id ? "active" : ""} ${status}`} onClick={() => onSelect(step.id)} aria-current={activeStep === step.id ? "step" : undefined}><span className="step-number">{step.number}</span><span className="step-title-label">{step.title}</span><StatusIcon size={15} aria-label={status} /></button>;
        })}
      </div>
    </aside>
  );
}

function getStepStatus(stepId: StepId, state: ProductTreatmentState) {
  switch (stepId) {
    case "productPromise": return state.brand.brand && state.product.productName && state.product.productPromise ? "complete" : "warning";
    case "identityCatalogue": return state.identity.sku && state.identity.gtin && state.catalogue.slug ? "complete" : "warning";
    case "brandMedia": return state.media.every((asset) => asset.sourceType !== "empty") ? "complete" : "warning";
    case "benefitsTrust": return state.benefits.some((item) => item.feature && item.benefit) ? "complete" : "warning";
    case "priceStockVariants": return state.pricing.grossPrice > 0 && state.inventory.stockQty >= 0 ? "complete" : "warning";
    case "commerceConversion": return state.ctas.primary.label && state.commercialTerms.shipping ? "complete" : "warning";
    case "serviceRelationship": return state.service.customerService && state.relationship.crmDestination ? "complete" : "warning";
    case "seoAioComplements": return state.seoAio.seoTitle && state.seoAio.metaDescription ? "complete" : "warning";
    case "reviewFinal": return "pending";
  }
}