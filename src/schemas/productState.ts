export type AppMode = "build" | "preview" | "output";

export type EvidenceStatus =
  | "CONFIRMED"
  | "DECISION"
  | "HYPOTHESIS"
  | "SUPPLIER_EVIDENCE"
  | "MARKET_EVIDENCE"
  | "LEGAL_EVIDENCE"
  | "UNKNOWN";

export type PublishStatus = "DRAFT" | "REVIEW" | "PUBLISH_READY";

export type StepId =
  | "productPromise"
  | "identity"
  | "media"
  | "navigation"
  | "benefits"
  | "trust"
  | "pricing"
  | "inventory"
  | "commercialTerms"
  | "ctas"
  | "service"
  | "relationship"
  | "seoAio"
  | "crossSell"
  | "review";

export interface TreatmentStep {
  id: StepId;
  number: string;
  title: string;
  question: string;
  learning: {
    deciding: string;
    matters: string;
    goodAnswer: string;
    dataCreated: string[];
    usedLaterBy: string[];
  };
}

export interface MediaAsset {
  id: string;
  role: "HERO_RECOGNITION" | "DETAIL_QUALITY" | "RITUAL_USE_DESIRE" | "PACKAGING_TRUST";
  altText: string;
  approvalStatus: EvidenceStatus;
  usageRights: string;
  isMain: boolean;
  crop: { zoom: number; x: number; y: number };
  blobKey?: string;
}

export interface ProductTreatmentState {
  metadata: {
    projectName: string;
    currentStep: StepId;
    updatedAt: string;
    version: number;
  };
  brand: {
    brand: string;
    brandLogo: string;
  };
  product: {
    productName: string;
    category: string;
    shortDescription: string;
    productPromise: string;
    primaryUse: string;
    customerHypothesis: string;
    mainFeatures: string;
  };
  identity: {
    productId: string;
    sku: string;
    gtin: string;
    subcategory: string;
    variant: string;
    edition: string;
    model: string;
    originCountry: string;
    originRegion: string;
    format: string;
    capacity: string;
    abv: string;
    batchLotLogic: string;
    technicalSpecs: string;
    status: EvidenceStatus;
  };
  navigation: {
    store: string;
    breadcrumb: string;
    slug: string;
    canonicalUrl: string;
    navigationLabels: string;
  };
  media: MediaAsset[];
  benefits: Array<{ id: string; feature: string; benefit: string; evidence: string }>;
  trust: Array<{ id: string; claim: string; owner: string; source: string; status: EvidenceStatus; approval: string; market: string }>;
  pricing: {
    currency: string;
    grossPrice: number;
    taxRate: number;
    taxIncluded: boolean;
    referencePrice: number;
    discountType: "NONE" | "PERCENTAGE" | "AMOUNT";
    discountValue: number;
  };
  inventory: {
    stockStatus: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "PREORDER" | "WAITLIST";
    stockQty: number;
    lowStockThreshold: number;
    availabilityMessage: string;
    quantity: number;
  };
  ctas: {
    primary: { enabled: boolean; label: string; action: string; destination: string };
    secondary: { enabled: boolean; label: string; action: string; destination: string };
    personalisation: { enabled: boolean; label: string; action: string; destination: string };
  };
  commercialTerms: {
    paymentMethods: string;
    shipping: string;
    deliveryWindow: string;
    returns: string;
    refund: string;
    warranty: string;
    legalAge: string;
    securePayment: boolean;
  };
  service: {
    dispatchSla: string;
    deliverySla: string;
    carrier: string;
    breakagePolicy: string;
    customerService: string;
  };
  relationship: {
    customerArea: boolean;
    registration: string;
    consent: string;
    npsTrigger: string;
    crmDestination: string;
  };
  seoAio: {
    seoTitle: string;
    metaDescription: string;
    keywords: string;
    semanticEntities: string;
    faq: string;
    language: string;
    aiConditions: string;
  };
  crossSell: Array<{ id: string; title: string; type: string; price: string; cta: string }>;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    ctaColor: string;
    fontOption: string;
  };
  status: {
    publishStatus: PublishStatus;
  };
}
