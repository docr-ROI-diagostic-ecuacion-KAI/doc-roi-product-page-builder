import type { ProductTreatmentState } from "../schemas/productState";
import { initialState } from "../state/initialState";

export const donEspadinExample: ProductTreatmentState = {
  ...initialState,
  metadata: {
    ...initialState.metadata,
    projectName: "Don Espadín PDP Treatment",
    currentStep: "productPromise",
    updatedAt: new Date().toISOString(),
  },
  brand: {
    ...initialState.brand,
    brand: "Don Espadín",
  },
  product: {
    ...initialState.product,
    productName: "Mezcal Espadín",
    category: "Mezcal",
    shortDescription: "Foundational mezcal expression built around Espadín agave from Oaxaca.",
    productPromise: "A clear, structured mezcal PDP that presents origin, format, price, and buying confidence without inventing evidence.",
    primaryUse: "Premium ecommerce product detail page",
    customerHypothesis: "Customers need fast confidence on origin, format, price, and service before buying mezcal online.",
    mainFeatures: "Espadín agave; Oaxaca origin; 750 ml; 43.6 ABV; Foundational Edition",
  },
  identity: {
    ...initialState.identity,
    productId: "PENDING",
    sku: "DE-MEZ-ESP-001",
    gtin: "PENDING",
    subcategory: "Agave spirits",
    variant: "Espadín",
    edition: "Foundational Edition",
    originCountry: "México",
    originRegion: "Oaxaca",
    format: "Bottle",
    capacity: "750 ml",
    abv: "43.6",
    status: "PENDING",
  },
  navigation: {
    ...initialState.navigation,
    breadcrumb: "Mezcal / Espadín / Don Espadín",
    slug: "don-espadin-mezcal-espadin",
    navigationLabels: "Mezcal, Espadín, Oaxaca",
  },
  media: initialState.media.map((asset) => ({
    ...asset,
    approvalStatus: "PENDING",
    altText: "PENDING",
    usageRights: "PENDING",
  })),
  benefits: [
    {
      id: "benefit-origin",
      feature: "Oaxaca origin",
      benefit: "Creates a clear provenance cue for the buyer.",
      evidence: "PENDING",
    },
    {
      id: "benefit-format",
      feature: "750 ml format",
      benefit: "Sets customer expectations for bottle size and commercial comparison.",
      evidence: "CONFIRMED BY PRODUCT DATA",
    },
  ],
  trust: [
    {
      id: "claim-origin",
      claim: "Origin Oaxaca",
      owner: "PENDING",
      source: "PENDING",
      status: "PENDING",
      approval: "PENDING",
      market: "PENDING",
    },
  ],
  pricing: {
    ...initialState.pricing,
    currency: "EUR",
    grossPrice: 89,
    taxRate: 21,
    taxIncluded: true,
  },
  inventory: {
    ...initialState.inventory,
    stockStatus: "AVAILABLE",
    stockQty: 0,
    availabilityMessage: "Availability PENDING",
  },
  ctas: {
    ...initialState.ctas,
    primary: { enabled: true, label: "Buy now", action: "checkout", destination: "PENDING" },
    secondary: { enabled: true, label: "Ask for advice", action: "contact", destination: "PENDING" },
  },
  commercialTerms: {
    ...initialState.commercialTerms,
    shipping: "PENDING",
    deliveryWindow: "PENDING",
    returns: "PENDING",
    warranty: "PENDING",
  },
  service: {
    ...initialState.service,
    customerService: "PENDING",
  },
  seoAio: {
    ...initialState.seoAio,
    seoTitle: "Don Espadín Mezcal Espadín",
    keywords: "mezcal, espadin, Oaxaca, Don Espadín",
    semanticEntities: "Don Espadín; Mezcal; Espadín; Oaxaca; México",
  },
};