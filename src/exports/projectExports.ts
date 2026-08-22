import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { ProductTreatmentState } from "../schemas/productState";

export async function downloadPdpPng() {
  const element = getPdpElement();
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff" });
  downloadUrl(canvas.toDataURL("image/png"), "doc-roi-pdp.png");
}

export async function downloadPdpPdf() {
  const pdf = await buildPdpPdf();
  pdf.save("doc-roi-pdp.pdf");
}

export async function sharePdpPng(): Promise<"shared" | "downloaded"> {
  const element = getPdpElement();
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff" });
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("PNG export failed")), "image/png"));
  const file = new File([blob], "doc-roi-pdp.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: "DOC ROI PDP", text: "DOC ROI product detail page PNG", files: [file] });
    return "shared";
  }
  await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  downloadUrl(URL.createObjectURL(blob), "doc-roi-pdp.png");
  return "downloaded";
}
async function buildPdpPdf() {
  const element = getPdpElement();
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff" });
  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: canvas.width >= canvas.height ? "landscape" : "portrait", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
  return pdf;
}
export function exportProjectJson(state: ProductTreatmentState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadUrl(URL.createObjectURL(blob), "doc-roi-product-project.json");
}

export function buildAiPrompt(state: ProductTreatmentState) {
  return `Build a professional ecommerce Product Detail Page from the following canonical product state.

RULES:
- Unknown and pending fields must remain explicitly UNKNOWN or PENDING.
- Do not invent facts, claims, evidence, certifications, reviews, stock or availability.
- The PDP is the visual deliverable. Structured data is the business asset. UX connects both.

PRODUCT DATA
Brand: ${state.brand.brand || "PENDING"}
Product name: ${state.product.productName || "PENDING"}
Category: ${state.product.category || "PENDING"}
Subcategory: ${state.product.subcategory || "PENDING"}
Promise: ${state.product.productPromise || "PENDING"}
Description: ${state.product.shortDescription || "PENDING"}
Use cases: ${state.product.useCases || "PENDING"}

BRAND ASSETS
Brand logo: ${state.brand.assets.brandLogo}
Label logo: ${state.brand.assets.labelLogo}
Profile logo: ${state.brand.assets.profileLogo}
Visual direction: primary ${state.theme.primaryColor}, secondary ${state.theme.secondaryColor}, CTA ${state.theme.ctaColor}, background ${state.theme.backgroundColor}, font ${state.theme.fontOption}

MEDIA
${state.media.map((asset) => `- ${asset.role}: ${asset.url || asset.fileName || asset.blobKey || "PENDING"}; alt=${asset.altText}; approval=${asset.approvalStatus}; rights=${asset.usageRights}; crop=${JSON.stringify(asset.crop)}`).join("\n")}

BENEFITS
${state.benefits.map((item) => `- Feature: ${item.feature || "PENDING"}; Benefit: ${item.benefit || "PENDING"}; Evidence: ${item.evidence || "PENDING"}`).join("\n")}

TRUST / EVIDENCE
${state.trust.map((claim) => `- Claim: ${claim.claim || "PENDING"}; Source: ${claim.source}; Status: ${claim.status}; Approval: ${claim.approvalStatus}`).join("\n")}

PRICE / TAX
Currency: ${state.pricing.currency}
Gross price: ${state.pricing.grossPrice}
Tax rate: ${state.pricing.taxRate}
Tax included: ${state.pricing.taxIncluded}
Discount: ${state.pricing.discountType} ${state.pricing.discountValue}

STOCK / VARIANTS
Stock status: ${state.inventory.stockStatus}
Stock quantity: ${state.inventory.stockQty}
Availability message: ${state.inventory.availabilityMessage}
Variants: ${JSON.stringify(state.variants)}

CTA / COMMERCIAL CONDITIONS
CTA: ${JSON.stringify(state.ctas)}
Commercial terms: ${JSON.stringify(state.commercialTerms)}

SERVICE / RELATIONSHIP
Service: ${JSON.stringify(state.service)}
Relationship: ${JSON.stringify(state.relationship)}

LEGAL / SEO / AIO / CROSS-SELL
Legal age: ${state.commercialTerms.legalAge}
SEO/AIO: ${JSON.stringify(state.seoAio)}
Cross-sell: ${JSON.stringify(state.crossSell)}

PDP INFORMATION ARCHITECTURE
Desktop: left gallery with hero/thumbnails/trust; right edition, brand, product name, category/format, description, promise, benefits, price, tax/net, discount, stock, quantity, variants, CTA, secondary actions, shipping, payment, protection, evidence, attributes.
Mobile: reorganize into a readable single-column commerce PDP with visible CTA and no overlapping text.`;
}

export function downloadPrompt(prompt: string, extension: "txt" | "md") {
  const blob = new Blob([prompt], { type: extension === "md" ? "text/markdown" : "text/plain" });
  downloadUrl(URL.createObjectURL(blob), `doc-roi-ai-product-page-prompt.${extension}`);
}

function getPdpElement() {
  const element = document.getElementById("pdp-export-frame");
  if (!element) throw new Error("PDP export frame not found");
  return element;
}

function downloadUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (url.startsWith("blob:")) window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}



