import { getDiscountedPrice } from "./pricing";
import type { ProductTreatmentState } from "../schemas/productState";

export interface ReadinessIssue {
  area: string;
  severity: "missing" | "warning" | "pending";
  message: string;
}

export function buildReadiness(state: ProductTreatmentState) {
  const issues: ReadinessIssue[] = [];

  if (!state.product.productName) issues.push({ area: "PRODUCT", severity: "missing", message: "Missing product name" });
  if (!state.brand.brand) issues.push({ area: "PRODUCT", severity: "missing", message: "Missing brand" });
  if (!state.product.productPromise) issues.push({ area: "PRODUCT", severity: "missing", message: "Missing product promise" });
  if (!state.identity.sku) issues.push({ area: "IDENTITY", severity: "missing", message: "Missing SKU" });
  if (!state.identity.gtin) issues.push({ area: "IDENTITY", severity: "warning", message: "GTIN must be PENDING or UNKNOWN, not empty" });
  if (!state.media.some((asset) => asset.isMain && asset.sourceType !== "empty")) issues.push({ area: "MEDIA", severity: "missing", message: "Missing Hero image" });
  if (state.media.some((asset) => asset.approvalStatus === "PENDING" || asset.approvalStatus === "UNKNOWN")) issues.push({ area: "MEDIA", severity: "pending", message: "Some image approval states are pending" });
  if (!(state.pricing.grossPrice > 0)) issues.push({ area: "PRICE", severity: "missing", message: "Missing price" });
  if (getDiscountedPrice(state.pricing) < 0) issues.push({ area: "PRICE", severity: "warning", message: "Discount cannot create a negative price" });
  if (state.inventory.stockQty < 0) issues.push({ area: "INVENTORY", severity: "warning", message: "Stock cannot be negative" });
  if (state.inventory.stockStatus === "OUT_OF_STOCK" && state.ctas.primary.label.toLowerCase().includes("buy")) issues.push({ area: "INVENTORY", severity: "warning", message: "Buy Now should be disabled or replaced when unavailable" });
  if (!state.ctas.primary.enabled || !state.ctas.primary.label) issues.push({ area: "COMMERCE", severity: "missing", message: "Missing primary CTA" });
  if (state.trust.some((claim) => claim.claim && (!claim.source || claim.source === "PENDING" || claim.source === "UNKNOWN"))) issues.push({ area: "EVIDENCE", severity: "warning", message: "Claim without confirmed evidence source" });
  if (state.commercialTerms.shipping && state.commercialTerms.shipping !== "PENDING" && (!state.service.deliverySla || state.service.deliverySla === "PENDING")) issues.push({ area: "SERVICE", severity: "warning", message: "Shipping promise without delivery SLA" });
  if (state.commercialTerms.legalAge && state.commercialTerms.legalAge !== "PENDING" && state.commercialTerms.legalAge !== "UNKNOWN") issues.push({ area: "LEGAL", severity: "warning", message: "Age-restricted product needs compliance review" });
  if (!state.seoAio.seoTitle) issues.push({ area: "SEO/AIO", severity: "pending", message: "SEO title pending" });

  const criticalMissing = issues.filter((issue) => issue.severity === "missing").length;
  const completed = Math.max(0, 10 - criticalMissing - Math.min(5, issues.filter((issue) => issue.severity === "warning").length));
  const progress = Math.round((completed / 10) * 100);
  const publishStatus = criticalMissing === 0 && !issues.some((issue) => issue.severity === "warning") ? "PUBLISH_READY" : criticalMissing <= 2 ? "REVIEW" : "DRAFT";

  return {
    progress,
    publishStatus,
    issues,
    missing: issues.filter((issue) => issue.severity === "missing"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
    pending: issues.filter((issue) => issue.severity === "pending"),
  };
}