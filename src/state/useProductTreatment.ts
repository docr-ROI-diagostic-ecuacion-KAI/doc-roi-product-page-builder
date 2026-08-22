import { useEffect, useMemo, useState } from "react";
import { steps } from "../data/steps";
import { donEspadinExample } from "../examples/donEspadin";
import { clearProjectState, loadProjectState, saveProjectState } from "../lib/storage";
import type { AppMode, ProductTreatmentState, StepId } from "../schemas/productState";
import { initialState } from "./initialState";

export function useProductTreatment() {
  const [state, setState] = useState<ProductTreatmentState>(() => loadProjectState() ?? initialState);
  const [mode, setMode] = useState<AppMode>("build");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    setIsSaving(true);
    const timeout = window.setTimeout(() => {
      saveProjectState(state);
      setLastSavedAt(new Date());
      setIsSaving(false);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [state]);

  const currentStep = useMemo(
    () => steps.find((step) => step.id === state.metadata.currentStep) ?? steps[0],
    [state.metadata.currentStep],
  );

  function setStep(stepId: StepId) {
    setState((current) => ({
      ...current,
      metadata: { ...current.metadata, currentStep: stepId },
    }));
  }

  function updateSection<Key extends keyof ProductTreatmentState>(section: Key, value: ProductTreatmentState[Key]) {
    setState((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function loadDonEspadinExample() {
    const nextState: ProductTreatmentState = {
      ...donEspadinExample,
      metadata: {
        ...donEspadinExample.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    setState(nextState);
    saveProjectState(nextState);
    setLastSavedAt(new Date());
  }

  function saveNow() {
    saveProjectState(state);
    setLastSavedAt(new Date());
  }

  function resetProject() {
    const confirmed = window.confirm("Reset the current project? This will clear saved local data.");
    if (!confirmed) return;
    clearProjectState();
    setState(initialState);
    setMode("build");
  }

  return {
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
  };
}