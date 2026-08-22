import { MessageCircle, Share2, ShieldCheck, ShoppingBag } from "lucide-react";
import type { CSSProperties } from "react";
import { getDiscountedPrice, getNetPrice } from "../lib/pricing";
import type { ProductTreatmentState } from "../schemas/productState";

export function ProductDetailPage({ data, compact = false }: { data: ProductTreatmentState; compact?: boolean }) {
  const netPrice = getNetPrice(data.pricing);
  const discountedPrice = getDiscountedPrice(data.pricing);
  const ctaLabel = getPrimaryCta(data);

  return (
    <article className={compact ? "pdp compact" : "pdp"} style={{ "--pdp-primary": data.theme.primaryColor, "--pdp-cta": data.theme.ctaColor, "--pdp-bg": data.theme.backgroundColor } as CSSProperties}>
      <section className="pdp-media">
        <div className="pdp-hero">
          <span>{data.media.find((asset) => asset.isMain)?.blobKey ? "Product image" : "Hero image pending"}</span>
        </div>
        <div className="pdp-thumbs">
          {data.media.map((asset) => (
            <div key={asset.id}>{asset.role.split("_")[0]}</div>
          ))}
        </div>
        <div className="confidence-strip">
          <ShieldCheck size={18} />
          Buyer confidence, availability, and service indicators
        </div>
      </section>

      <section className="pdp-info">
        <p className="edition">{data.identity.edition || "Edition pending"}</p>
        <p className="pdp-brand">{data.brand.brand || "Brand pending"}</p>
        <h1>{data.product.productName || "Product name pending"}</h1>
        <p className="category-line">{[data.product.category, data.identity.format].filter(Boolean).join(" · ") || "Category pending"}</p>
        <p className="description">{data.product.shortDescription || "Short description will appear here as structured product data."}</p>
        <div className="promise-box">
          <strong>Product promise</strong>
          <span>{data.product.productPromise || "Promise pending"}</span>
        </div>
        <div className="trust-chips">
          <span>{data.identity.originCountry || "Origin UNKNOWN"}</span>
          <span>{data.identity.gtin ? `GTIN ${data.identity.gtin}` : "GTIN must be UNKNOWN"}</span>
          <span>{data.identity.status}</span>
        </div>
        <div className="price-block">
          <strong>{formatMoney(discountedPrice, data.pricing.currency)}</strong>
          <span>PVP {formatMoney(data.pricing.grossPrice, data.pricing.currency)} · Net {formatMoney(netPrice, data.pricing.currency)} · Tax {data.pricing.taxRate}%</span>
        </div>
        <p className="availability">{data.inventory.availabilityMessage || data.inventory.stockStatus}</p>
        <div className="cta-row">
          <button type="button" className="buy-button" disabled={ctaLabel.disabled}>
            <ShoppingBag size={18} />
            {ctaLabel.label}
          </button>
          <button type="button" className="ghost-button"><Share2 size={18} /> Share</button>
          <button type="button" className="ghost-button"><MessageCircle size={18} /> Help</button>
        </div>
        <dl className="service-list">
          <div><dt>Shipping</dt><dd>{data.commercialTerms.shipping || "UNKNOWN"}</dd></div>
          <div><dt>Protection</dt><dd>{data.commercialTerms.warranty || "UNKNOWN"}</dd></div>
          <div><dt>Service</dt><dd>{data.service.customerService || "UNKNOWN"}</dd></div>
        </dl>
      </section>
    </article>
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
