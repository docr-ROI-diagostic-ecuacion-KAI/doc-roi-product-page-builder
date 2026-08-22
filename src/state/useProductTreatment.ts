import { useEffect, useMemo, useState } from "react";
import { steps } from "../data/steps";
import { donEspadinExample } from "../examples/donEspadin";
import { clearMediaBlobs, loadMediaBlob } from "../lib/mediaDb";
import { clearProjectState, loadProjectState, saveProjectState } from "../lib/storage";
import type { AppMode, ProductTreatmentState, StepId } from "../schemas/productState";
import { initialState } from "./initialState";

export function useProductTreatment() {
  const [state, setState] = useState<ProductTreatmentState>(() => loadProjectState() ?? initialState);
  const [mode, setMode] = useState<AppMode>("build");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsSaving(true);
    const timeout = window.setTimeout(() => {
      saveProjectState(state);
      setLastSavedAt(new Date());
      setIsSaving(false);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];
    async function resolveMedia() {
      const resolved: Record<string, string> = {};
      for (const asset of state.media) {
        if (asset.sourceType === "remote" && asset.url) resolved[asset.id] = asset.url;
        if (asset.sourceType === "indexeddb" && asset.blobKey) {
          const blob = await loadMediaBlob(asset.blobKey);
          if (blob) {
            const url = URL.createObjectURL(blob);
            objectUrls.push(url);
            resolved[asset.id] = url;
          }
        }
      }
      if (!cancelled) setMediaUrls(resolved);
    }
    resolveMedia();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [state.media]);

  const currentStep = useMemo(
    () => steps.find((step) => step.id === state.metadata.currentStep) ?? steps[0],
    [state.metadata.currentStep],
  );

  function setStep(stepId: StepId) {
    setState((current) => ({
      ...current,
      metadata: { ...current.metadata, currentStep: stepId },
    }));
    window.requestAnimationFrame(() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function updateSection<Key extends keyof ProductTreatmentState>(section: Key, value: ProductTreatmentState[Key]) {
    setState((current) => ({ ...current, [section]: value }));
  }

  function replaceState(nextState: ProductTreatmentState) {
    const hydrated = {
      ...nextState,
      metadata: { ...nextState.metadata, updatedAt: new Date().toISOString() },
    };
    setState(hydrated);
    saveProjectState(hydrated);
    setLastSavedAt(new Date());
  }

  function loadDonEspadinExample() {
    replaceState(donEspadinExample);
    setMode("build");
  }

  function saveNow() {
    saveProjectState(state);
    setLastSavedAt(new Date());
  }

  async function resetProject() {
    const confirmed = window.confirm("Reset the current project? This will clear saved local data and uploaded images.");
    if (!confirmed) return;
    clearProjectState();
    await clearMediaBlobs();
    setState(initialState);
    setMode("build");
  }

  function importProjectJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ProductTreatmentState;
        replaceState(parsed);
      } catch {
        window.alert("The selected JSON could not be imported.");
      }
    };
    reader.readAsText(file);
  }

  return {
    state,
    currentStep,
    mode,
    mediaUrls,
    isSaving,
    lastSavedAt,
    setMode,
    setStep,
    updateSection,
    replaceState,
    loadDonEspadinExample,
    importProjectJson,
    saveNow,
    resetProject,
  };
}