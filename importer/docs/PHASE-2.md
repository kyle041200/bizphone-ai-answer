# Phase 2 development checkpoint, 0.3.0

## Status and evidence

This is a development checkpoint, not a universal compatibility certification or completion of the queued two-step worker workflow. No production deployment or live WordPress edits were performed. All mutations occurred on newly created QA drafts in isolated Docker staging. Import helpers refuse to overwrite an existing source key and verify all pre-existing page content/CSS hashes after each import. Published dummy BizPhone/BizSite protection fixtures remained intact; neither source route is included in test bundles.

Source A: `kyle041200/bizphone-ai-answer`, commit `4a66da501bbda92dd9fc318864decb215e8b3089`, routes `/`, `/business-support`, `/marketing`. Source B: `GuidoPenta/TrackZilla`, commit `d8099fdb253f0d21eaece84a2895d9d0671c8aa7`, unauthenticated landing route `/`. Source B is a separate public Lovable project with different layout, colors, typography, imagery, and Supabase authentication/job-tracking functionality. Only its public rendered landing state was converted; its application is not migrated.

The published source URL `https://bizphone-ai-answer.lovable.app/` and Google Fonts were rejected by the environment outbound proxy (403). Comparisons therefore use locally rendered repository source with external requests blocked consistently on both sides. Missing source fonts, the source logo, and another original asset remain explicit warnings. Matching a local fallback font does not prove the original published font was preserved.

## Universal improvements

- Preserve CSS-driven native Group hierarchy instead of inferring Columns from utility class counts. Exact flex/grid, responsive rules, gradients, widths, gaps, shadows, typography, and image cropping come from the project's own CSS.
- Keep distinct HTML/body cascade boundaries and exact unitless line heights. Map rem lengths to the original root font size without changing media query breakpoints.
- Namespace custom properties with CSS ASTs, preserving arbitrary utility selectors and asset URLs. Namespace fonts, keyframes, and project scopes. Normalize ampersand utility tokens consistently through block/CSS serialization to survive WordPress sanitization.
- Raise scoped source selector specificity and reset source elements locally to reduce theme leakage. Preserve viewport background on the optional imported canvas, including source horizontal overflow. No theme files or global site settings are edited.
- Promote source classes to real button/image leaves on the front end and in the editor. Preserve canonical saved core block markup. Fix duplicated margins introduced by generic leaf selectors.
- Preserve semantic figure/figcaption/blockquote/strong elements. Normalize native Details summaries so editor wrappers do not add line boxes on the public page. Accessible disclosure patterns can use native Details; unknown event handlers are reported.
- Provide reusable KGHQ Linked Layout for linked cards containing native editable child blocks, with URL/target inspector controls. Its independent companion registration must persist.
- Native colors, spacing, layout, and typography changes are mirrored into the visual editor and rendered as explicit front-end styles. Imported images now receive real attachment IDs recovered from saved image markup, enabling native Media Library replacement.
- Analyze each repository independently with static AST/CSS inspection: framework/router inventory, routes, shared components, Tailwind literal tokens, CSS variables/fonts/breakpoints, shadcn/cva variants, assets, integration calls, state/events, and custom-block candidates. Config/source code is not executed by analysis. Credential files and credential-like values are excluded/redacted.
- Emit compatibility reports before conversion. Interaction loss and missing source assets require explicit operator acknowledgment; unknown functionality is not claimed as migrated.

No rule identifies BizPhone, BizSite, KGHQ component names, routes, or design tokens to select conversion templates.

## Comparison method and measured results

Playwright Chromium 154, device scale 1, viewport height 1000, widths 1440/768/390, en-US, UTC, light scheme, reduced motion, transitions/animations/caret disabled. Full-page and native section crops use identical browser conditions; lazy images are decoded before final captures. No image registration, resizing, content masks, or omitted mismatching sections.

Reports include RGB changed pixels where any channel differs by more than 25, mean absolute RGB error, 16px local luminance SSIM, section geometry, element computed styles, missing images/fonts, and probable causes. The internal gate requires <=5% changed pixels **and** SSIM >=0.95 **and** section boxes within 2px **and** no unmatched source elements. Unsupported functionality/assets are separate review blockers. This is not a percentage-only success claim.

Source A full-page changed pixels (desktop / tablet / mobile):

| Page | Baseline | Updated |
|---|---|---|
| Home | 16.815 / 24.633 / 22.813% | 0.402 / 0.682 / 0.663% |
| Business support | 12.789 / 23.015 / 24.901% | 0.048 / 0.069 / 0.038% |
| Marketing | 11.622 / 18.788 / 21.979% | 0.123 / 0.173 / 0.152% |

Source B updated: 0.177 / 0.173 / 0.127%, with identical document heights at all widths. Before the universal viewport-paint fix its mobile result was 15.229%. The source itself has horizontal overflow at 390px; faithfully reproducing it is not a mobile usability certification.

The home page still differs by 6px in total height on tablet/mobile. Some SVG/native-image and text element correspondences remain unmatched; native control states and editor wrappers require further parity work. Strict acceptance is therefore **review required**, despite low full-page pixel error. Missing fonts/images and unsupported interactions remain unresolved. See machine-readable per-section reports; do not treat aggregate metrics as approval to publish.

## Separate grades

- **Visual fidelity: B, review required.** Strong measured local front-end improvement across two independent projects. Live comparison/font availability blocked; 6px home drift, SVG state differences, editor/default-state parity and named-theme certification remain unresolved.
- **Gutenberg editability: B, partial acceptance.** Nine independent checks pass on Source A, including actual RichText typing, actual Media Library replacement, style/layout preview, section mutations, and save/reopen with no recovery errors. Some style/layout actions use the standard block data store rather than clicking every inspector control. Source B and classic-child results are recorded separately in evidence. These checks do not certify intuitive editing of every layout or all editor responsive states.
- **Functional integrity: C, static-content scope only.** Draft-only imports, duplicate preservation, selected-route bundles, native validation, and importer-removal persistence are verified on staging. React event handlers, auth, database application state, forms, service integrations, and all internal-link remapping are not implemented as functioning WordPress features. Reports flag these; configure integrations before publishing.

## Theme scope and lifecycle

Tested classic parent: Twenty Seventeen development checkout. Additional QA-only child theme deliberately overrides headings, buttons, paragraphs, links, images, and block gaps; it is test evidence, not a commercially supported theme. GeneratePress, Neve, Astra, Kadence, and OceanWP remain **untested** in this phase because official theme downloads were blocked/unavailable. Architecture supports classic themes; universal compatibility is not claimed.

The lifecycle test deactivates the importer and removes its installed plugin files, compares all staging page content/CSS hashes, verifies media and companion block registration, then restores the staging installation. The independent companion must stay active. Removing both plugins preserves content/media but loses scoped CSS/canvas behavior and custom editor registration. Back up post metadata and uploads.

## Next phase

Implement and verify the secure asynchronous external worker and two-step normal dashboard: repository URL/default branch detection → checkbox selection → Convert & Import Selected Pages → progress → editable draft. No JSON/CLI steps for end users. Current 0.3.0 checkpoint still uses the earlier manual dashboard; no hosted worker is deployed or certified. Worker build isolation, disk quotas, server-side private credentials, authentication, bounded retries, and public staging E2E remain required. Do not install an unfinished worker in production.

### Completed additional staging results

All nine independent editor checks also passed for Source B and for Source A with the QA classic child theme active. Child-theme front-end changed-pixel metrics matched parent results for Source A home and Source B landing at all three widths. A lazy-image capture race initially produced a false photo mismatch; final capture explicitly waits for image decoding identically on both sides. The importer lifecycle check passed with 22 styled staging pages and 120 media attachments preserved at the test snapshot. These are QA-only drafts/media, not production counts.
