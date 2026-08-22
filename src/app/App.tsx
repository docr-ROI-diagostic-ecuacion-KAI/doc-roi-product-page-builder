import { ArrowLeft, ArrowRight, CheckCircle2, Download, Eye, FileJson, Hammer, RotateCcw, Save, Share2 } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { ClosingSections } from "../components/ClosingSections";
import { ProductDetailPage } from "../components/ProductDetailPage";
import { steps } from "../data/steps";
import { buildAiPrompt, downloadPdpPdf, downloadPdpPng, sharePdpPdf } from "../exports/projectExports";
import { LearningFeed } from "../features/learning/LearningFeed";
import { StepEditor } from "../features/treatment/StepEditor";
import { StepNavigation } from "../features/treatment/StepNavigation";
import { buildReadiness } from "../lib/readiness";
import type { AppMode } from "../schemas/productState";
import { useProductTreatment } from "../state/useProductTreatment";

const docRoiLogo = "https://docroi.marketing/wp-content/uploads/2026/07/Logo_Negro_DoC_ROI.jpg";

const modes: Array<{ id: AppMode; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "build", label: "build", icon: Hammer },
  { id: "preview", label: "preview", icon: Eye },
  { id: "output", label: "output", icon: Download },
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
    saveNow,
    resetProject,
  } = useProductTreatment();
  const [prompt, setPrompt] = useState("");
  const activeIndex = steps.findIndex((step) => step.id === currentStep.id);
  const readiness = buildReadiness(state);
  const promptText = useMemo(() => prompt || buildAiPrompt(state), [prompt, state]);

  function switchMode(nextMode: AppMode) {
    setMode(nextMode);
    window.requestAnimationFrame(() => document.getElementById(nextMode === "build" ? "builder" : nextMode)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function loadExampleAndPreview() {
    loadDonEspadinExample();
    setMode("preview");
    window.requestAnimationFrame(() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function generatePrompt() {
    const nextPrompt = buildAiPrompt(state);
    setPrompt(nextPrompt);
    navigator.clipboard?.writeText(nextPrompt).catch(() => undefined);
  }

  return (
    <div className="app-shell">
      <header className="docroi-header"><a className="docroi-logo-link" href="https://el-botiquin-del-doc-roi.vercel.app/" target="_blank" rel="noreferrer"><img src={docRoiLogo} alt="DOC ROI" /></a><nav className="docroi-header-nav" aria-label="DOC ROI navigation"><a className="docroi-header-action" href="#builder">Open Tool</a></nav></header>

      <section id="method" className="tool-intro docroi-anchor-target"><div className="hero-copy"><strong className="hero-specialty">STRATEGY SPECIALIZATION · MARKET RESEARCH STRATEGY</strong><span>TREATMENT · PILL · PRODUCT SYSTEM</span><h1>Build My Product Page</h1><p>A structured learning experience to convert product data, media, price, stock, evidence and service into a professional ecommerce Product Detail Page.</p><div className="hero-actions"><button type="button" className="hero-primary" onClick={loadExampleAndPreview}>Load Example</button><a className="hero-secondary" href="#builder">Open Treatment</a></div></div><div className="hero-video-frame" aria-label="introductory video placeholder"><button type="button" className="video-play" aria-label="Play introduction video">▶</button><div><strong>Product System</strong><span>intro video placeholder</span></div></div></section>

      <section id="builder" className="builder-shell docroi-anchor-target">
        <div className="workspace-toolbar">
          <nav className="mode-tabs" aria-label="Workspace mode">{modes.map((item) => { const Icon = item.icon; return <button className={mode === item.id ? "mode-tab active" : "mode-tab"} type="button" key={item.id} onClick={() => switchMode(item.id)}><Icon size={17} /><span>{item.label}</span></button>; })}</nav>
          <div className="topbar-actions" aria-label="Application status and actions"><button className="example-button" type="button" onClick={loadExampleAndPreview}>Load Example</button><div className="autosave" aria-live="polite"><CheckCircle2 size={16} />{isSaving ? "saving" : lastSavedAt ? `saved ${lastSavedAt.toLocaleTimeString()}` : "autosave ready"}</div><button className="icon-button" type="button" onClick={saveNow} aria-label="Save project" title="Save project"><Save size={18} /></button><button className="reset-button" type="button" onClick={resetProject}><RotateCcw size={16} />reset project</button></div>
        </div>

        {mode === "build" && <main className="build-layout"><StepNavigation activeStep={currentStep.id} onSelect={setStep} progress={readiness.progress} state={state} /><section className="work-area" aria-labelledby="step-title"><div className="step-kicker">step {String(activeIndex + 1).padStart(2, "0")} of 09 · {readiness.publishStatus.toLowerCase().replace("_", " ")}</div><h2 id="step-title">{currentStep.title}</h2><p className="step-question">{currentStep.question}</p><StepEditor state={state} mediaUrls={mediaUrls} step={currentStep} updateSection={updateSection} /><div className="step-controls"><button className="secondary-button" type="button" disabled={activeIndex === 0} onClick={() => setStep(steps[activeIndex - 1].id)}><ArrowLeft size={18} />previous</button><button className="primary-button" type="button" disabled={activeIndex === steps.length - 1} onClick={() => setStep(steps[activeIndex + 1].id)}>next<ArrowRight size={18} /></button></div></section><LearningFeed step={currentStep} /></main>}

        {mode === "preview" && <main id="preview" className="preview-layout docroi-anchor-target"><ProductDetailPage data={state} mediaUrls={mediaUrls} /></main>}

        {mode === "output" && <main id="output" className="output-layout docroi-anchor-target"><section className="output-panel"><h2>output center</h2><p>all outputs read the same canonical state used by preview.</p><div className="output-grid"><button type="button" className="output-action" onClick={downloadPdpPdf}><Download size={18} /><span>download pdp as pdf</span></button><button type="button" className="output-action" onClick={downloadPdpPng}><Download size={18} /><span>download pdp as png</span></button><button type="button" className="output-action" onClick={generatePrompt}><FileJson size={18} /><span>generate ai product page prompt</span></button><button type="button" className="output-action" onClick={sharePdpPdf}><Share2 size={18} /><span>share pdp pdf</span></button></div><textarea className="prompt-output" value={promptText} onChange={(event) => setPrompt(event.target.value)} /></section><section><ProductDetailPage data={state} mediaUrls={mediaUrls} compact /><ReadinessPanel readiness={readiness} /></section></main>}
      </section>

      <ClosingSections logoUrl={docRoiLogo} />
    </div>
  );
}

function ReadinessPanel({ readiness }: { readiness: ReturnType<typeof buildReadiness> }) {
  return <section className="readiness-panel"><h2>pdp readiness</h2><div className="readiness-grid"><ReadinessColumn title="missing data" items={readiness.missing.map((item) => item.message)} /><ReadinessColumn title="warnings" items={readiness.warnings.map((item) => item.message)} /><ReadinessColumn title="pending" items={readiness.pending.map((item) => item.message)} /></div></section>;
}

function ReadinessColumn({ title, items }: { title: string; items: string[] }) { return <div><h3>{title}</h3>{items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>no items.</p>}</div>; }



