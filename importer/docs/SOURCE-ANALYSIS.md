# Source repository analysis

Source: `kyle041200/bizphone-ai-answer`, commit `4a66da501bbda92dd9fc318864decb215e8b3089` on `main` when inspected.

The application uses React 19, TanStack Start file routes, Vite 7, Tailwind 4, Lucide icons, and a Bun lockfile. It has 12 static routes plus nine concrete article URLs generated from `src/lib/articles.ts`. The scanner reads TypeScript ASTs and the article catalog without evaluating their code. `__root.tsx` is a shell rather than a separate page; `/articles_/$slug` uses TanStack's non-nesting underscore convention.

Static routes: `/`, `/articles`, `/bizphone`, `/bizsite`, `/business-support`, `/deliverables`, `/growth-reset`, `/marketing`, `/new-client`, `/partners`, `/sales`, `/training`.

The nine article slugs are catalog-driven; no runtime slug enumeration is assumed for other repositories. JSX React Router configurations and other router conventions require explicit `--routes` in the current MVP.

The chosen MVP pages, `/bizphone` and `/bizsite`, contain semantic sections, headings, text, photo backgrounds, pricing cards, buttons, responsive grid layouts, inline and standalone SVG icons, and native HTML Details FAQs. These are suitable for native blocks. Desktop/tablet/mobile screenshots were captured from the actual running local source server and compared with WordPress draft previews.

Seven original raster image assets and 58 distinct rasterized icon graphics are included in the final two-page bundle (65 deduplicated assets). Inline decorative spans are retained using zero-width content so Gutenberg RichText preserves them. SVGs are rasterized into transparent PNGs; no whole-page screenshot is used as imported content.

The repository declares font-family names such as Sora and Manrope, but the two tested source routes did not register downloadable FontFace objects in the browser. Their actual rendered fallback typography is retained. A separate WordPress-core WOFF2 fixture tests real font bytes, media import, and browser loading; it is not represented as a source-site font.

An attempted article-page conversion stopped at a source logo URL that returned HTTP 404 locally. This is a source asset availability issue, not a successful entire-site conversion. Other routes include forms, catalog filtering, and stateful application UI; these need dedicated native/custom-block adapters before claiming functional whole-site migration. Missing source assets are not silently replaced.

The Lovable app's existing tracked source, tests, root package manifest, and lockfile were left unchanged. All implementation files are under `importer/`.
