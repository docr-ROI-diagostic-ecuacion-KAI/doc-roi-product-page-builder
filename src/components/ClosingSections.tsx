export function ClosingSections({ logoUrl }: { logoUrl: string }) {
  const diiip = [
    ["D", "Data", "Raw product data: identity, images, pricing, stock, commercial conditions and evidence."],
    ["I", "Information", "The data is structured as SKU, attributes, media roles, prices, states, SLA and claims."],
    ["I", "Intelligence", "Rules interpret information through validations, availability, commercial coherence and PDP readiness."],
    ["I", "Insights", "The builder reveals evidence gaps, content issues, conversion opportunities and service inconsistencies."],
    ["P", "Personalization Actions", "The information activates PDP, CTA, service, relationship, SEO/AIO and future decisions."],
  ];

  return (
    <>
      <section id="resources" className="diiip-section docroi-anchor-target">
        <div className="diiip-inner">
          <div className="closing-heading"><span>METHODOLOGY AT THE END OF THE JOURNEY</span><h2>DIIIP explains why this product-data connection creates value</h2><p>In the Product System, value appears when raw product data becomes a visible, validated and reusable decision inside the PDP.</p></div>
          <div className="diiip-list">{diiip.map(([letter, title, copy]) => <div className="diiip-item" key={title}><div>{letter}</div><section><strong>{title}</strong><p>{copy}</p></section></div>)}</div>
        </div>
      </section>

      <section id="kai-roi" className="kai-section docroi-anchor-target">
        <div className="kai-inner">
          <div><span className="kai-pill">KAI·ROI EQUATION · CUSTOMER EQUITY</span><h2>This Product System creates operational evidence for the KAI·ROI layer</h2><p>The Product Page Builder does not redefine KAI·ROI. It creates a structured operational asset that can later support implementation, ROI analysis, Customer Equity reasoning and defensible strategic decisions.</p><p>The formal KAI·ROI structure remains sovereign; this V1 does not calculate or reinterpret its variables.</p></div>
          <div className="kai-card"><span>EXECUTIVE RESOURCE</span><h3>The KAI·ROI Equation Book</h3><p>A concise guide to understand how data, ROI, Customer Equity and strategic decisions connect inside the DOC ROI ecosystem.</p><div><strong>Inside the document:</strong><ul><li>What the KAI·ROI Equation is</li><li>Why Customer Equity matters</li><li>How ROI becomes a decision system</li><li>Why data must be monetized with purpose</li></ul></div><a href="https://docroi.marketing/kai-equation/" target="_blank" rel="noreferrer">Access the KAI·ROI Equation →</a></div>
        </div>
      </section>

      <footer className="docroi-footer"><div><a href="https://el-botiquin-del-doc-roi.vercel.app/" target="_blank" rel="noreferrer"><img src={logoUrl} alt="DOC ROI" /></a><p><a href="https://doc-roi-executive.vercel.app/" target="_blank" rel="noreferrer">Consult with DOC ROI →</a></p><nav><a href="https://docroi.marketing/aviso-legal/" target="_blank" rel="noreferrer">Privacy Policy</a><span>|</span><a href="https://docroi.marketing/aviso-legal/" target="_blank" rel="noreferrer">Legal Notice</a><span>|</span><a href="https://docroi.marketing/aviso-legal/" target="_blank" rel="noreferrer">Intellectual Property</a></nav><p className="copyright">The intellectual property of the DOC ROI ecosystem belongs to <a href="https://docroi.marketing/ph-d-jorge-lucio/" target="_blank" rel="noreferrer">Ph. D. Jorge Lucio Sánchez Galán.</a></p></div></footer>
    </>
  );
}
