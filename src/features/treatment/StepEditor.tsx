import type { ProductTreatmentState, TreatmentStep } from "../../schemas/productState";

interface StepEditorProps {
  state: ProductTreatmentState;
  step: TreatmentStep;
  updateSection: <Key extends keyof ProductTreatmentState>(section: Key, value: ProductTreatmentState[Key]) => void;
}

export function StepEditor({ state, step, updateSection }: StepEditorProps) {
  if (step.id === "productPromise") {
    return (
      <div className="form-grid">
        <Field label="Brand" value={state.brand.brand} onChange={(brand) => updateSection("brand", { ...state.brand, brand })} />
        <Field label="Product name" value={state.product.productName} onChange={(productName) => updateSection("product", { ...state.product, productName })} />
        <Field label="Category" value={state.product.category} onChange={(category) => updateSection("product", { ...state.product, category })} />
        <Field label="Short description" value={state.product.shortDescription} onChange={(shortDescription) => updateSection("product", { ...state.product, shortDescription })} multiline />
        <Field label="Product promise" value={state.product.productPromise} onChange={(productPromise) => updateSection("product", { ...state.product, productPromise })} multiline />
        <Field label="Primary use" value={state.product.primaryUse} onChange={(primaryUse) => updateSection("product", { ...state.product, primaryUse })} />
        <Field label="Customer hypothesis" value={state.product.customerHypothesis} onChange={(customerHypothesis) => updateSection("product", { ...state.product, customerHypothesis })} multiline />
        <Field label="Main features" value={state.product.mainFeatures} onChange={(mainFeatures) => updateSection("product", { ...state.product, mainFeatures })} multiline />
      </div>
    );
  }

  if (step.id === "identity") {
    return (
      <div className="form-grid">
        <Field label="Product ID" value={state.identity.productId} onChange={(productId) => updateSection("identity", { ...state.identity, productId })} />
        <Field label="SKU" value={state.identity.sku} onChange={(sku) => updateSection("identity", { ...state.identity, sku })} />
        <Field label="GTIN" value={state.identity.gtin} onChange={(gtin) => updateSection("identity", { ...state.identity, gtin })} />
        <Field label="Edition" value={state.identity.edition} onChange={(edition) => updateSection("identity", { ...state.identity, edition })} />
        <Field label="Origin country" value={state.identity.originCountry} onChange={(originCountry) => updateSection("identity", { ...state.identity, originCountry })} />
        <Field label="Format" value={state.identity.format} onChange={(format) => updateSection("identity", { ...state.identity, format })} />
        <Field label="Capacity" value={state.identity.capacity} onChange={(capacity) => updateSection("identity", { ...state.identity, capacity })} />
        <Field label="ABV" value={state.identity.abv} onChange={(abv) => updateSection("identity", { ...state.identity, abv })} />
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

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="field">
      <span>{label}</span>
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
