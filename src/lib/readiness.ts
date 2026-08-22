import type { ProductTreatmentState } from "../schemas/productState";

export function buildReadiness(state: ProductTreatmentState) {
  const checks = [
    Boolean(state.product.productName),
    Boolean(state.brand.brand),
    Boolean(state.product.productPromise),
    state.media.some((asset) => asset.isMain && asset.blobKey),
    state.pricing.grossPrice > 0,
    Boolean(state.ctas.primary.enabled && state.ctas.primary.label),
    state.identity.gtin !== "",
  ];

  const completed = checks.filter(Boolean).length;

  return {
    progress: Math.round((completed / checks.length) * 100),
    missing: [
      !state.product.productName && "Product name",
      !state.brand.brand && "Brand",
      !state.product.productPromise && "Product promise",
      !state.media.some((asset) => asset.isMain && asset.blobKey) && "Hero image",
      !(state.pricing.grossPrice > 0) && "Price",
      !(state.ctas.primary.enabled && state.ctas.primary.label) && "Primary CTA",
      state.identity.gtin === "" && "GTIN must be UNKNOWN, not empty",
    ].filter(Boolean) as string[],
  };
}
