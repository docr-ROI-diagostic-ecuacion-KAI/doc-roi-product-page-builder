import { Upload } from "lucide-react";
import type { EvidenceStatus, MediaAsset, ProductTreatmentState, TreatmentStep } from "../../schemas/productState";

interface StepEditorProps {
  state: ProductTreatmentState;
  step: TreatmentStep;
  updateSection: <Key extends keyof ProductTreatmentState>(section: Key, value: ProductTreatmentState[Key]) => void;
}

const fieldStatuses: EvidenceStatus[] = ["CONFIRMED", "DECISION", "HYPOTHESIS", "PENDING", "UNKNOWN"];

export function StepEditor({ state, step, updateSection }: StepEditorProps) {
  if (step.id === "productPromise") {
    return (
      <div className="form-grid">
        <Field label="Brand" value={state.brand.brand} onChange={(brand) => updateSection("brand", { ...state.brand, brand })} status={state.brand.brand ? "CONFIRMED" : "PENDING"} />
        <Field label="Product name" value={state.product.productName} onChange={(productName) => updateSection("product", { ...state.product, productName })} status={state.product.productName ? "CONFIRMED" : "PENDING"} />
        <Field label="Category" value={state.product.category} onChange={(category) => updateSection("product", { ...state.product, category })} status={state.product.category ? "CONFIRMED" : "PENDING"} />
        <Field label="Short description" value={state.product.shortDescription} onChange={(shortDescription) => updateSection("product", { ...state.product, shortDescription })} multiline />
        <Field label="Product promise" value={state.product.productPromise} onChange={(productPromise) => updateSection("product", { ...state.product, productPromise })} multiline status={state.product.productPromise ? "DECISION" : "PENDING"} />
        <Field label="Primary use" value={state.product.primaryUse} onChange={(primaryUse) => updateSection("product", { ...state.product, primaryUse })} />
        <Field label="Customer hypothesis" value={state.product.customerHypothesis} onChange={(customerHypothesis) => updateSection("product", { ...state.product, customerHypothesis })} multiline status="HYPOTHESIS" />
        <Field label="Main features" value={state.product.mainFeatures} onChange={(mainFeatures) => updateSection("product", { ...state.product, mainFeatures })} multiline />
      </div>
    );
  }

  if (step.id === "identity") {
    return (
      <div className="form-grid">
        <Field label="Product ID" value={state.identity.productId} onChange={(productId) => updateSection("identity", { ...state.identity, productId })} status={state.identity.productId === "PENDING" ? "PENDING" : undefined} />
        <Field label="SKU" value={state.identity.sku} onChange={(sku) => updateSection("identity", { ...state.identity, sku })} status={state.identity.sku ? "CONFIRMED" : "PENDING"} />
        <Field label="GTIN" value={state.identity.gtin} onChange={(gtin) => updateSection("identity", { ...state.identity, gtin })} status={state.identity.gtin === "PENDING" ? "PENDING" : state.identity.gtin === "UNKNOWN" ? "UNKNOWN" : "CONFIRMED"} />
        <Field label="Edition" value={state.identity.edition} onChange={(edition) => updateSection("identity", { ...state.identity, edition })} />
        <Field label="Origin country" value={state.identity.originCountry} onChange={(originCountry) => updateSection("identity", { ...state.identity, originCountry })} />
        <Field label="Origin region" value={state.identity.originRegion} onChange={(originRegion) => updateSection("identity", { ...state.identity, originRegion })} />
        <Field label="Format" value={state.identity.format} onChange={(format) => updateSection("identity", { ...state.identity, format })} />
        <Field label="Capacity" value={state.identity.capacity} onChange={(capacity) => updateSection("identity", { ...state.identity, capacity })} />
        <Field label="ABV" value={state.identity.abv} onChange={(abv) => updateSection("identity", { ...state.identity, abv })} />
        <Field label="Variant" value={state.identity.variant} onChange={(variant) => updateSection("identity", { ...state.identity, variant })} />
      </div>
    );
  }

  if (step.id === "media") {
    return (
      <div className="media-grid">
        {state.media.map((asset, index) => (
          <MediaSlot
            key={asset.id}
            asset={asset}
            index={index}
            onChange={(nextAsset) => updateSection("media", state.media.map((item) => (item.id === asset.id ? nextAsset : item)))}
          />
        ))}
      </div>
    );
  }

  if (step.id === "pricing") {
    return (
      <div className="form-grid compact">
        <Field label="Currency" value={state.pricing.currency} onChange={(currency) => updateSection("pricing", { ...state.pricing, currency })} />
        <NumberField label="Gross price" value={state.pricing.grossPrice} onChange={(grossPrice) => updateSection("pricing", { ...state.pricing, grossPrice })} />
        <NumberField label="Tax rate" value={state.pricing.taxRate} onChange={(taxRate) => updateSection("pricing", { ...state.pricing, taxRate })} />
        <NumberField label="Discount value" value={state.pricing.discountValue} onChange={(discountValue) => updateSection("pricing", { ...state.pricing, discountValue })} />
      </div>
    );
  }

  if (step.id === "inventory") {
    return (
      <div className="form-grid compact">
        <label className="field">
          <span>Stock status</span>
          <select value={state.inventory.stockStatus} onChange={(event) => updateSection("inventory", { ...state.inventory, stockStatus: event.target.value as ProductTreatmentState["inventory"]["stockStatus"] })}>
            <option>AVAILABLE</option>
            <option>LOW_STOCK</option>
            <option>OUT_OF_STOCK</option>
            <option>PREORDER</option>
            <option>WAITLIST</option>
          </select>
        </label>
        <NumberField label="Stock quantity" value={state.inventory.stockQty} onChange={(stockQty) => updateSection("inventory", { ...state.inventory, stockQty })} />
        <NumberField label="Quantity" value={state.inventory.quantity} onChange={(quantity) => updateSection("inventory", { ...state.inventory, quantity })} />
        <Field label="Availability message" value={state.inventory.availabilityMessage} onChange={(availabilityMessage) => updateSection("inventory", { ...state.inventory, availabilityMessage })} />
      </div>
    );
  }

  return (
    <div className="phase-placeholder">
      <h2>{step.title} workspace</h2>
      <p>This step is wired into routing, learning feed, autosave, and readiness. Its complete controls will be expanded in its implementation phase.</p>
    </div>
  );
}

function MediaSlot({ asset, index, onChange }: { asset: MediaAsset; index: number; onChange: (asset: MediaAsset) => void }) {
  return (
    <section className="media-slot">
      <div className="media-upload-placeholder">
        <Upload size={20} />
        UPLOAD IMAGE
      </div>
      <div className="media-slot-body">
        <div className="media-slot-header">
          <strong>{String(index + 1).padStart(2, "0")} {roleLabel(asset.role)}</strong>
          {asset.isMain && <span className="status-badge confirmed">MAIN IMAGE</span>}
        </div>
        <Field label="Image role" value={roleLabel(asset.role)} onChange={() => undefined} />
        <Field label="Alt text" value={asset.altText} onChange={(altText) => onChange({ ...asset, altText })} status={asset.altText === "PENDING" ? "PENDING" : asset.altText ? "CONFIRMED" : "UNKNOWN"} />
        <label className="field">
          <span>Approval status</span>
          <select value={asset.approvalStatus} onChange={(event) => onChange({ ...asset, approvalStatus: event.target.value as EvidenceStatus })}>
            {fieldStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, multiline = false, status }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; status?: EvidenceStatus }) {
  return (
    <label className="field">
      <span>{label}{status && <em className={`status-badge ${status.toLowerCase()}`}>{status}</em>}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function roleLabel(role: MediaAsset["role"]) {
  return role.replaceAll("_", " / ");
}