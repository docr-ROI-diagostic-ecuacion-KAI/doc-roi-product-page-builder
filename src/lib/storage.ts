import type { MediaAsset, ProductTreatmentState, StepId } from "../schemas/productState";
import { initialState } from "../state/initialState";

const STORAGE_KEY = "doc-roi-product-treatment-state";

export function loadProjectState(): ProductTreatmentState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ProductTreatmentState> & Record<string, unknown>;
    return migrateProjectState(parsed);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveProjectState(state: ProductTreatmentState) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, metadata: { ...state.metadata, updatedAt: new Date().toISOString() } }),
  );
}

export function clearProjectState() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function migrateProjectState(saved: Partial<ProductTreatmentState> & Record<string, unknown>): ProductTreatmentState {
  const oldNavigation = (saved as { navigation?: Partial<ProductTreatmentState["catalogue"]> }).navigation;
  const oldBrand = saved.brand as Partial<ProductTreatmentState["brand"]> & { brandLogo?: string } | undefined;
  const oldIdentity = saved.identity as Partial<ProductTreatmentState["identity"]> & { batchLotLogic?: string } | undefined;

  return {
    ...initialState,
    ...saved,
    metadata: {
      ...initialState.metadata,
      ...saved.metadata,
      currentStep: mapStep(saved.metadata?.currentStep),
      version: 1,
    },
    brand: {
      ...initialState.brand,
      ...saved.brand,
      assets: {
        ...initialState.brand.assets,
        ...(oldBrand?.assets ?? {}),
        brandLogo: oldBrand?.assets?.brandLogo ?? oldBrand?.brandLogo ?? initialState.brand.assets.brandLogo,
      },
    },
    product: { ...initialState.product, ...saved.product },
    identity: {
      ...initialState.identity,
      ...saved.identity,
      lotBatchLogic: oldIdentity?.lotBatchLogic ?? oldIdentity?.batchLotLogic ?? initialState.identity.lotBatchLogic,
    },
    catalogue: {
      ...initialState.catalogue,
      ...(oldNavigation ?? {}),
      ...saved.catalogue,
    },
    media: normalizeMedia(saved.media),
    benefits: saved.benefits?.length ? saved.benefits : initialState.benefits,
    trust: normalizeTrust(saved.trust),
    evidence: { ...initialState.evidence, ...saved.evidence },
    pricing: { ...initialState.pricing, ...saved.pricing },
    inventory: { ...initialState.inventory, ...saved.inventory },
    variants: saved.variants?.length ? saved.variants : initialState.variants,
    ctas: {
      ...initialState.ctas,
      ...saved.ctas,
      primary: { ...initialState.ctas.primary, ...saved.ctas?.primary },
      secondary: { ...initialState.ctas.secondary, ...saved.ctas?.secondary },
      personalisation: { ...initialState.ctas.personalisation, ...saved.ctas?.personalisation },
    },
    commercialTerms: { ...initialState.commercialTerms, ...saved.commercialTerms },
    service: { ...initialState.service, ...saved.service },
    relationship: { ...initialState.relationship, ...saved.relationship },
    seoAio: { ...initialState.seoAio, ...saved.seoAio },
    crossSell: saved.crossSell?.length ? saved.crossSell : initialState.crossSell,
    theme: { ...initialState.theme, ...saved.theme },
    status: { ...initialState.status, ...saved.status },
  };
}

function mapStep(step: unknown): StepId {
  const stepMap: Record<string, StepId> = {
    productPromise: "productPromise",
    identity: "identityCatalogue",
    media: "brandMedia",
    navigation: "identityCatalogue",
    benefits: "benefitsTrust",
    trust: "benefitsTrust",
    pricing: "priceStockVariants",
    inventory: "priceStockVariants",
    commercialTerms: "commerceConversion",
    ctas: "commerceConversion",
    service: "serviceRelationship",
    relationship: "serviceRelationship",
    seoAio: "seoAioComplements",
    crossSell: "seoAioComplements",
    review: "reviewFinal",
  };
  return typeof step === "string" ? stepMap[step] ?? "productPromise" : "productPromise";
}

function normalizeMedia(media: ProductTreatmentState["media"] | undefined): ProductTreatmentState["media"] {
  const source = media?.length ? media : initialState.media;
  return initialState.media.map((fallback, index) => {
    const saved = source[index] as Partial<MediaAsset> | undefined;
    const url = normalizeAssetUrl(saved?.url ?? fallback.url);
    return {
      ...fallback,
      ...saved,
      url,
      title: saved?.title ?? fallback.title,
      order: saved?.order ?? index + 1,
      sourceType: saved?.sourceType ?? (url ? "remote" : saved?.blobKey ? "indexeddb" : "empty"),
      crop: { ...fallback.crop, ...saved?.crop },
    };
  });
}

function normalizeAssetUrl(url: string | undefined) {
  if (!url) return url;
  const localAssets: Record<string, string> = {
    Hero_Reconocimiento_Don_Es: "/don-espadin/Hero_Reconocimiento_Don_Es.png",
    Detail_Calidad_Don_Es: "/don-espadin/Detail_Calidad_Don_Es.png",
    Ritual_Deseo_Don_Es: "/don-espadin/Ritual_Deseo_Don_Es.png",
    Packeging_Confianza__Don_Es: "/don-espadin/Packeging_Confianza__Don_Es.png",
  };
  const match = Object.entries(localAssets).find(([name]) => url.includes(name));
  return match?.[1] ?? url;
}

function normalizeTrust(trust: ProductTreatmentState["trust"] | undefined): ProductTreatmentState["trust"] {
  if (!trust?.length) return initialState.trust;
  return trust.map((claim) => ({
    ...initialState.trust[0],
    ...claim,
    reviewDate: claim.reviewDate ?? "PENDING",
    approvalStatus: claim.approvalStatus ?? claim.status ?? "PENDING",
  }));
}
