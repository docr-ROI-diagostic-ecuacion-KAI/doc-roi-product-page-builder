import { ArrowLeft, ArrowRight, CheckCircle2, Download, Eye, FileJson, Hammer, RotateCcw, Save, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import { ProductDetailPage } from "../components/ProductDetailPage";
import { LearningFeed } from "../features/learning/LearningFeed";
import { StepEditor } from "../features/treatment/StepEditor";
import { StepNavigation } from "../features/treatment/StepNavigation";
import { buildReadiness } from "../lib/readiness";
import { useProductTreatment } from "../state/useProductTreatment";
import { steps } from "../data/steps";
import type { AppMode } from "../schemas/productState";

const modes: Array<{ id: AppMode; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "build", label: "Build", icon: Hammer },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "output", label: "Output", icon: Download },
];

export function App() {
  const {
    state,
    currentStep,
    mode,
    isSaving,
    lastSavedAt,
    setMode,
    setStep,
    updateSection,
    loadDonEspadinExample,
    saveNow,
    resetProject,
  } = useProductTreatment();
  const activeIndex = steps.findIndex((step) => step.id === currentStep.id);
  const readiness = buildReadiness(state);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <span className="phase-capsule">03 · PRODUCT</span>
          <span className="topbar-separator" />
          <div>
            <p className="brand-mark">Phase 03 · Product System</p>
            <p className="phase-label">Professional PDP builder treatment</p>
          </div>
        </div>
        <div className="topbar-actions" aria-label="Application status and actions">
          <button className="example-button" type="button" onClick={loadDonEspadinExample}>
            <Sparkles size={16} />
            LOAD EXAMPLE · DON ESPADÍN
          </button>
          <div className="autosave" aria-live="polite">
            <CheckCircle2 size={16} />
            {isSaving ? "Saving" : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : "Autosave ready"}
          </div>
          <button className="icon-button" type="button" onClick={saveNow} aria-label="Save project" title="Save project">
            <Save size={18} />
          </button>
          <button className="reset-button" type="button" onClick={resetProject}>
            <RotateCcw size={16} />
            RESET PROJECT
          </button>
          <div className="logo-box" aria-label="DOC ROI logo">DOC ROI</div>
          <span className="treatment-capsule">TREATMENT</span>
        </div>
      </header>

      <nav className="mode-tabs" aria-label="Workspace mode">
        {modes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={mode === item.id ? "mode-tab active" : "mode-tab"}
              type="button"
              key={item.id}
              onClick={() => setMode(item.id)}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {mode === "build" && (
        <main className="build-layout">
          <StepNavigation activeStep={currentStep.id} onSelect={setStep} progress={readiness.progress} state={state} />
          <section className="work-area" aria-labelledby="step-title">
            <div className="step-kicker">Step {String(activeIndex + 1).padStart(2, "0")} of 15</div>
            <h1 id="step-title">{currentStep.title}</h1>
            <p className="step-question">{currentStep.question}</p>
            <StepEditor state={state} step={currentStep} updateSection={updateSection} />
            <div className="step-controls">
              <button className="secondary-button" type="button" disabled={activeIndex === 0} onClick={() => setStep(steps[activeIndex - 1].id)}>
                <ArrowLeft size={18} />
                Previous
              </button>
              <button className="primary-button" type="button" disabled={activeIndex === steps.length - 1} onClick={() => setStep(steps[activeIndex + 1].id)}>
                Next
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
          <LearningFeed step={currentStep} />
        </main>
      )}

      {mode === "preview" && (
        <main className="preview-layout">
          <ProductDetailPage data={state} />
        </main>
      )}

      {mode === "output" && (
        <main className="output-layout">
          <section className="output-panel">
            <h1>Output Center</h1>
            <p>COMING IN NEXT ITERATION</p>
            <div className="output-grid" aria-disabled="true">
              <button type="button" className="output-action" disabled><Download size={18} /> Download PDP as PDF</button>
              <button type="button" className="output-action" disabled><Download size={18} /> Download PDP as PNG</button>
              <button type="button" className="output-action" disabled><FileJson size={18} /> Generate AI Product Page Prompt</button>
              <button type="button" className="output-action" disabled><FileJson size={18} /> Export / Import Project JSON</button>
            </div>
          </section>
          <ProductDetailPage data={state} compact />
        </main>
      )}
    </div>
  );
}