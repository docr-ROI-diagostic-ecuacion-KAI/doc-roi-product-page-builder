export type AppMode = "build" | "preview" | "output";

export type EvidenceStatus =
  | "CONFIRMED"
  | "DECISION"
  | "HYPOTHESIS"
  | "SUPPLIER_EVIDENCE"
  | "MARKET_EVIDENCE"
  | "LEGAL_EVIDENCE"
  | "PENDING"
  | "UNKNOWN";

export type PublishStatus = "DRAFT" | "REVIEW" | "PUBLISH_READY";

export type StepId =
  | "productPromise"
  | "identityCatalogue"
  | "brandMedia"
  | "benefitsTrust"
  | "priceStockVariants"
  | "commerceConversion"
  | "serviceRelationship"
  | "seoAioComplements"
  | "reviewFinal";

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

export interface ImageCrop {
  zoom: number;
  x: number;
  y: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface MediaAsset {
  id: string;
  role: "HERO_RECOGNITION" | "DETAIL_QUALITY" | "RITUAL_USE_DESIRE" | "PACKAGING_TRUST";
  title: string;
  altText: string;
  approvalStatus: EvidenceStatus;
  usageRights: string;
  isMain: boolean;
  order: number;
  sourceType: "empty" | "remote" | "indexeddb";
  url?: string;
  blobKey?: string;
  fileName?: string;
  crop: ImageCrop;
}

export interface BrandAssets {
  brandLogo: string;
  labelLogo: string;
  profileLogo: string;
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
    assets: BrandAssets;
  };
  product: {
    productName: string;
    category: string;
    subcategory: string;
    shortDescription: string;
    productPromise: string;
    primaryUse: string;
    mainFeatures: string;
    useCases: string;
    customerHypothesis: string;
  };
  identity: {
    productId: string;
    sku: string;
    gtin: string;
    variant: string;
    edition: string;
    model: string;
    originCountry: string;
    originRegion: string;
    composition: string;
    format: string;
    capacity: string;
    technicalSpecs: string;
    abv: string;
    lotBatchLogic: string;
    status: EvidenceStatus;
  };
  catalogue: {
    store: string;
    breadcrumb: string;
    slug: string;
    canonicalUrl: string;
    labels: string;
  };
  media: MediaAsset[];
  benefits: Array<{ id: string; feature: string; benefit: string; evidence: string }>;
  trust: Array<{ id: string; claim: string; owner: string; source: string; status: EvidenceStatus; reviewDate: string; approvalStatus: EvidenceStatus; market: string }>;
  evidence: {
    trustBadges: string;
    originEvidence: string;
    lotEvidence: string;
    certificate: string;
    laboratoryEvidence: string;
    guarantee: string;
    supplierEvidence: string;
    responsibleUse: string;
  };
  pricing: {
    currency: string;
    grossPrice: number;
    taxRate: number;
    taxIncluded: boolean;
    referencePrice: number;
    discountType: "NONE" | "PERCENTAGE" | "AMOUNT";
    discountValue: number;
    quantityTiers: string;
    promoCode: string;
    validFrom: string;
    validTo: string;
  };
  inventory: {
    stockStatus: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "PREORDER" | "WAITLIST";
    stockQty: number;
    lowStockThreshold: number;
    availabilityMessage: string;
    nextLot: string;
    quantity: number;
  };
  variants: Array<{ id: string; variant: string; option: string; pack: string; quantity: string; personalisation: string }>;
  ctas: {
    primary: { enabled: boolean; label: string; action: string; destination: string };
    secondary: { enabled: boolean; label: string; action: string; destination: string };
    personalisation: { enabled: boolean; label: string; action: string; destination: string };
    save: boolean;
    share: boolean;
    help: boolean;
    chat: boolean;
  };
  commercialTerms: {
    paymentMethods: string;
    securePayment: boolean;
    shipping: string;
    deliveryWindow: string;
    marketRestrictions: string;
    orderConditions: string;
    legalAge: string;
    returns: string;
    refund: string;
    warranty: string;
  };
  service: {
    dispatchSla: string;
    deliverySla: string;
    carrier: string;
    breakagePolicy: string;
    incidentRoute: string;
    rma: string;
    returnsRoute: string;
    refundRoute: string;
    customerService: string;
    postSaleCommunication: string;
    stockIncidentHandling: string;
  };
  relationship: {
    customerArea: boolean;
    registration: string;
    consent: string;
    npsTrigger: string;
    referral: string;
    loyalty: string;
    reactivation: string;
    crmDestination: string;
  };
  seoAio: {
    seoTitle: string;
    metaDescription: string;
    keywords: string;
    semanticEntities: string;
    faq: string;
    approvedClaims: string;
    productSchema: string;
    offerSchema: string;
    market: string;
    language: string;
    aiReadableConditions: string;
  };
  crossSell: Array<{ id: string; type: string; title: string; price: string; cta: string }>;
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