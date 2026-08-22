import type { ProductTreatmentState } from "../schemas/productState";

export function getNetPrice(pricing: ProductTreatmentState["pricing"]) {
  if (pricing.grossPrice <= 0) return 0;
  if (!pricing.taxIncluded) return pricing.grossPrice;
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
  return gross;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
