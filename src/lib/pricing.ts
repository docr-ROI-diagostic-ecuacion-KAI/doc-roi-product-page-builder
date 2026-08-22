import type { ProductTreatmentState } from "../schemas/productState";

export function getNetPrice(pricing: ProductTreatmentState["pricing"]) {
  if (pricing.grossPrice <= 0) return 0;
  if (!pricing.taxIncluded) return roundMoney(pricing.grossPrice);
  return roundMoney(pricing.grossPrice / (1 + pricing.taxRate / 100));
}

export function getDiscountedPrice(pricing: ProductTreatmentState["pricing"]) {
  const gross = pricing.grossPrice;
  if (pricing.discountType === "PERCENTAGE") {
    return Math.max(0, roundMoney(gross - gross * (pricing.discountValue / 100)));
  }
  if (pricing.discountType === "AMOUNT") {
    return Math.max(0, roundMoney(gross - pricing.discountValue));
  }
  return roundMoney(gross);
}

export function getSavingAmount(pricing: ProductTreatmentState["pricing"]) {
  return roundMoney(Math.max(0, pricing.grossPrice - getDiscountedPrice(pricing)));
}

export function getSavingPercentage(pricing: ProductTreatmentState["pricing"]) {
  if (pricing.grossPrice <= 0) return 0;
  return roundMoney((getSavingAmount(pricing) / pricing.grossPrice) * 100);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}