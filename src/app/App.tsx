import { ArrowLeft, ArrowRight, CheckCircle2, Download, Eye, FileJson, Hammer, RotateCcw, Save, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useRef, useState } from "react";
import { ClosingSections } from "../components/ClosingSections";
import { ProductDetailPage } from "../components/ProductDetailPage";
import { steps } from "../data/steps";
import { buildAiPrompt, downloadPdpPdf, downloadPdpPng, downloadPrompt, exportProjectJson } from "../exports/projectExports";
import { LearningFeed } from "../features/learning/LearningFeed";
import { StepEditor } from "../features/treatment/StepEditor";
import { StepNavigation } from "../features/treatment/StepNavigation";
import { buildReadiness } from "../lib/readiness";
import type { AppMode } from "../schemas/productState";
import { useProductTreatment } from "../state/useProductTreatment";

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
    mediaUrls,
    isSaving,
    lastSavedAt,
    setMode,
    setStep,
    updateSection,
    loadDonEspadinExample,
    importProjectJson,
    saveNow,
    resetProject,
  } = useProductTreatment();
  const importRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const activeIndex = steps.findIndex((step) => step.id === currentStep.id);
  const readiness = buildReadiness(state);
  const promptText = useMemo(() => prompt || buildAiPrompt(state), [prompt, state]);

  function switchMode(nextMode: AppMode) {
    setMode(nextMode);
    window.requestAnimationFrame(() => document.getElementById(nextMode === "build" ? "builder" : nextMode)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function generatePrompt() {
    const nextPrompt = buildAiPrompt(state);
    setPrompt(nextPrompt);
    navigator.clipboard?.writeText(nextPrompt).catch(() => undefined);
  }

  return (
    <div className="app-shell">
      <header className="docroi-header">
        <a className="docroi-logo-link" href="https://el-botiquin-del-doc-roi.vercel.app/" target="_blank" rel="noreferrer"><img src="https://docroi.marketing/wp-content/uploads/2024/12/Logo_Doctor_ROI.jpg" alt="DOC ROI" /></a>
        <nav className="docroi-header-nav" aria-label="DOC ROI navigation"><a href="#method">Method</a><a href="#resources">Resources</a><a className="docroi-header-action" href="#builder">Open tool</a></nav>
      </header>

      <section id="method" className="tool-intro docroi-anchor-target"><div><span>DOC ROI · Phase 03 · Product System</span><h1>Build a professional ecommerce Product Detail Page from structured product decisions.</h1><p>The PDP is the visual deliverable. Structured data is the business asset. UX connects both.</p></div><button type="button" className="example-button" onClick={loadDonEspadinExample}><Sparkles size={16} />LOAD EXAMPLE · DON ESPADÍN</button></section>

      <section id="builder" className="builder-shell docroi-anchor-target">
        <div className="workspace-toolbar">
          <nav className="mode-tabs" aria-label="Workspace mode">{modes.map((item) => { const Icon = item.icon; return <button className={mode === item.id ? "mode-tab active" : "mode-tab"} type="button" key={item.id} onClick={() => switchMode(item.id)}><Icon size={17} /><span>{item.label}</span></button>; })}</nav>
          <div className="topbar-actions" aria-label="Application status and actions"><div className="autosave" aria-live="polite"><CheckCircle2 size={16} />{isSaving ? "Saving" : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : "Autosave ready"}</div><button className="icon-button" type="button" onClick={saveNow} aria-label="Save project" title="Save project"><Save size={18} /></button><button className="reset-button" type="button" onClick={resetProject}><RotateCcw size={16} />RESET PROJECT</button></div>
        </div>

        {mode === "build" && <main className="build-layout"><StepNavigation activeStep={currentStep.id} onSelect={setStep} progress={readiness.progress} state={state} /><section className="work-area" aria-labelledby="step-title"><div className="step-kicker">Step {String(activeIndex + 1).padStart(2, "0")} of 09 · {readiness.publishStatus}</div><h2 id="step-title">{currentStep.title}</h2><p className="step-question">{currentStep.question}</p><StepEditor state={state} mediaUrls={mediaUrls} step={currentStep} updateSection={updateSection} /><div className="step-controls"><button className="secondary-button" type="button" disabled={activeIndex === 0} onClick={() => setStep(steps[activeIndex - 1].id)}><ArrowLeft size={18} />Previous</button><button className="primary-button" type="button" disabled={activeIndex === steps.length - 1} onClick={() => setStep(steps[activeIndex + 1].id)}>Next<ArrowRight size={18} /></button></div></section><LearningFeed step={currentStep} /></main>}

        {mode === "preview" && <main id="preview" className="preview-layout docroi-anchor-target"><ProductDetailPage data={state} mediaUrls={mediaUrls} /></main>}

        {mode === "output" && <main id="output" className="output-layout docroi-anchor-target"><section className="output-panel"><h2>Output Center</h2><p>All outputs read the same canonical state used by Preview.</p><div className="output-grid"><button type="button" className="output-action" onClick={downloadPdpPdf}><Download size={18} />Download PDP as PDF</button><button type="button" className="output-action" onClick={downloadPdpPng}><Download size={18} />Download PDP as PNG</button><button type="button" className="output-action" onClick={generatePrompt}><FileJson size={18} />Generate AI Product Page Prompt</button><button type="button" className="output-action" onClick={() => exportProjectJson(state)}><FileJson size={18} />Export Project JSON</button><button type="button" className="output-action" onClick={() => importRef.current?.click()}><FileJson size={18} />Import Project JSON</button><input ref={importRef} type="file" accept="application/json" hidden onChange={(event) => event.target.files?.[0] && importProjectJson(event.target.files[0])} /></div><textarea className="prompt-output" value={promptText} onChange={(event) => setPrompt(event.target.value)} /></section><section><ProductDetailPage data={state} mediaUrls={mediaUrls} compact /><ReadinessPanel readiness={readiness} /></section></main>}
      </section>

      <ClosingSections />
    </div>
  );
}

function ReadinessPanel({ readiness }: { readiness: ReturnType<typeof buildReadiness> }) {
  return <section className="readiness-panel"><h2>PDP Readiness</h2><div className="readiness-grid"><ReadinessColumn title="Missing Data" items={readiness.missing.map((item) => item.message)} /><ReadinessColumn title="Warnings" items={readiness.warnings.map((item) => item.message)} /><ReadinessColumn title="Pending" items={readiness.pending.map((item) => item.message)} /></div></section>;
}

function ReadinessColumn({ title, items }: { title: string; items: string[] }) { return <div><h3>{title}</h3>{items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No items.</p>}</div>; }