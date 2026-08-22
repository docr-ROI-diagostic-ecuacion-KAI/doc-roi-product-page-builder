import { MessageCircle, Share2, ShieldCheck, ShoppingBag } from "lucide-react";
import type { CSSProperties } from "react";
import { getDiscountedPrice, getNetPrice } from "../lib/pricing";
import type { ProductTreatmentState } from "../schemas/productState";

export function ProductDetailPage({ data, compact = false }: { data: ProductTreatmentState; compact?: boolean }) {
  const netPrice = getNetPrice(data.pricing);
  const discountedPrice = getDiscountedPrice(data.pricing);
  const ctaLabel = getPrimaryCta(data);
  const cssVars = {
    "--pdp-primary": data.theme.primaryColor,
    "--pdp-cta": data.theme.ctaColor,
    "--pdp-bg": data.theme.backgroundColor,
  } as CSSProperties;

  return (
    <article className={compact ? "pdp compact" : "pdp"} style={cssVars}>
      <section className="pdp-media">
        <div className="pdp-hero">
          <span>{data.media.find((asset) => asset.isMain)?.blobKey ? "Product image" : "Hero image pending"}</span>
        </div>
        <div className="pdp-thumbs">
          {data.media.map((asset, index) => (
            <div key={asset.id}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{asset.role.split("_")[0]}</span>
            </div>
          ))}
        </div>
        <div className="confidence-strip">
          <ShieldCheck size={18} />
          <span>Availability, service, and evidence remain tied to structured data.</span>
        </div>
      </section>

      <section className="pdp-info">
        <p className="edition">{data.identity.edition || "Edition PENDING"}</p>
        <p className="pdp-brand">{data.brand.brand || "Brand PENDING"}</p>
        <h1>{data.product.productName || "Product name PENDING"}</h1>
        <p className="category-line">{[data.product.category, data.identity.variant, data.identity.format].filter(Boolean).join(" · ") || "Category PENDING"}</p>
        <p className="description">{data.product.shortDescription || "Short description PENDING"}</p>

        <div className="price-block">
          <strong>{formatMoney(discountedPrice, data.pricing.currency)}</strong>
          <span>PVP {formatMoney(data.pricing.grossPrice, data.pricing.currency)} · Net {formatMoney(netPrice, data.pricing.currency)} · Tax {data.pricing.taxRate}%</span>
        </div>

        <div className="purchase-panel">
          <p className="availability">{data.inventory.availabilityMessage || data.inventory.stockStatus}</p>
          <label className="quantity-control">
            <span>Quantity</span>
            <input type="number" value={data.inventory.quantity} readOnly />
          </label>
          <p className="variant-line">Variant: {data.identity.variant || "PENDING"}</p>
          <div className="cta-row">
            <button type="button" className="buy-button" disabled={ctaLabel.disabled}>
              <ShoppingBag size={18} />
              {ctaLabel.label}
            </button>
            <button type="button" className="ghost-button">{data.ctas.secondary.label || "Secondary CTA"}</button>
          </div>
          <div className="cta-row secondary-actions">
            <button type="button" className="ghost-button"><Share2 size={18} /> Share</button>
            <button type="button" className="ghost-button"><MessageCircle size={18} /> Help</button>
          </div>
        </div>

        <div className="promise-box">
          <strong>Product promise</strong>
          <span>{data.product.productPromise || "Promise PENDING"}</span>
        </div>
        <div className="trust-chips">
          <span>{data.identity.originRegion || "Origin region PENDING"}</span>
          <span>{data.identity.originCountry || "Origin country PENDING"}</span>
          <span>{data.identity.gtin ? `GTIN ${data.identity.gtin}` : "GTIN UNKNOWN"}</span>
          <span>{data.identity.status}</span>
        </div>
      </section>

      <section className="pdp-lower-band">
        <PdpSection title="Benefits">
          {data.benefits.map((item) => (
            <div className="pdp-list-item" key={item.id}>
              <strong>{item.feature || "Feature PENDING"}</strong>
              <span>{item.benefit || "Benefit PENDING"}</span>
              <small>Evidence: {item.evidence || "PENDING"}</small>
            </div>
          ))}
        </PdpSection>
        <PdpSection title="Shipping">
          <p>{data.commercialTerms.shipping || "PENDING"}</p>
          <small>Delivery window: {data.commercialTerms.deliveryWindow || "PENDING"}</small>
        </PdpSection>
        <PdpSection title="Protection">
          <p>{data.commercialTerms.warranty || "PENDING"}</p>
          <small>Returns: {data.commercialTerms.returns || "PENDING"}</small>
        </PdpSection>
        <PdpSection title="Evidence">
          {data.trust.map((claim) => (
            <div className="pdp-list-item" key={claim.id}>
              <strong>{claim.claim || "Claim PENDING"}</strong>
              <span>{claim.source || "Source PENDING"}</span>
              <small>{claim.status}</small>
            </div>
          ))}
        </PdpSection>
        <PdpSection title="Attributes">
          <dl className="attribute-list">
            <div><dt>SKU</dt><dd>{data.identity.sku || "PENDING"}</dd></div>
            <div><dt>Capacity</dt><dd>{data.identity.capacity || "PENDING"}</dd></div>
            <div><dt>ABV</dt><dd>{data.identity.abv || "PENDING"}</dd></div>
            <div><dt>Service</dt><dd>{data.service.customerService || "PENDING"}</dd></div>
          </dl>
        </PdpSection>
      </section>
    </article>
  );
}

function PdpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pdp-detail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function getPrimaryCta(data: ProductTreatmentState) {
  if (data.inventory.stockStatus === "OUT_OF_STOCK") return { label: "Notify me", disabled: false };
  if (data.inventory.stockStatus === "WAITLIST") return { label: "Join waitlist", disabled: false };
  if (data.inventory.stockStatus === "PREORDER") return { label: "Preorder", disabled: false };
  return { label: data.ctas.primary.label || "Buy now", disabled: !data.ctas.primary.enabled };
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency: currency || "EUR" }).format(value || 0);
}