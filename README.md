# DOC ROI Product Page Builder

Version 1.0.0 of the DOC ROI Product Page Builder is a guided Product Detail Page treatment for ecommerce product systems.

The application is built as a professional working tool, not a generic form. Users make product, media, evidence, price, stock, commerce, service and SEO/AIO decisions while the same canonical state renders a live PDP preview and powers exports.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Typecheck

```bash
npm run typecheck
```

## Production Build

```bash
npm run build
```

## Architecture

- `src/schemas/productState.ts` defines the canonical `ProductTreatmentState`.
- `src/state/useProductTreatment.ts` owns state, autosave, JSON import and media URL hydration.
- `src/lib/mediaDb.ts` persists uploaded image blobs in IndexedDB.
- `src/features/treatment/StepEditor.tsx` writes to the canonical state.
- `src/components/ProductDetailPage.tsx` reads the same state for Preview, PDF and PNG.
- `src/exports/projectExports.ts` generates PDF, PNG, AI prompt and JSON outputs.
- `src/examples/donEspadin.ts` contains the Don Espadín example dataset.

## DOC ROI CMS Assets

DOC ROI header logo:
https://docroi.marketing/wp-content/uploads/2024/12/Logo_Doctor_ROI.jpg

Don Espadín media:
- Hero / Recognition: https://docroi.marketing/wp-content/uploads/2026/08/Hero_Reconocimiento_Don_Es.png
- Detail / Quality: https://docroi.marketing/wp-content/uploads/2026/08/Detail_Calidad_Don_Es.png
- Ritual / Use / Desire: https://docroi.marketing/wp-content/uploads/2026/08/Ritual_Deseo_Don_Es.png
- Packaging / Trust: https://docroi.marketing/wp-content/uploads/2026/08/Packeging_Confianza__Don_Es.png

Don Espadín logos:
- Long logo: https://docroi.marketing/wp-content/uploads/2026/08/LNogo-Cuadrado.png
- Label logo: https://docroi.marketing/wp-content/uploads/2026/08/logo-etiqueta.png
- Profile logo: https://docroi.marketing/wp-content/uploads/2026/08/Logo_Perfil.png

## Notes

Remote CMS images are rendered with `crossOrigin="anonymous"` and exported through the same PDP DOM. If a CMS CORS policy changes and blocks canvas capture, the app will still preserve the original asset URL in the project JSON and AI prompt.