# KGHQ published importer styling guide

Applies to the **0.6.0-alpha1 PHP preview**. This guide distinguishes working
behavior from the design-preservation work still needed. It does not claim that
the preview reproduces a Lovable design or fixes the reported live editor widths.

## Editing content now

Headings, paragraphs, images, buttons, lists, groups, basic tables, quotes,
separators and details use WordPress core blocks. Click text to edit it. Select an
Image block and use Replace → Media Library to change the image. Select a Button
to edit its text and link. Use List View to move, duplicate or delete a Group.
Core block color, typography and spacing controls remain available wherever the
installed WordPress version and theme expose them.

The converter currently copies supported **literal inline declarations** into
native `style` attributes: hexadecimal text/background colors, font size, line
height and explicit margin/padding sides on headings, paragraphs and groups.
It preserves the actual supplied values rather than inferring values from a class
name. Unsupported declarations are reported. Most Tailwind designs define styles
in external CSS, so these mappings alone are insufficient for visual fidelity.

## Where the current styles live

`wordpress/kghq-lovable-importer/published.css` is the single base stylesheet.
`styles.php` enqueues the same file for imported front-end content and the block
editor. It also enables classic theme editor styles and wide alignment support.
When the imported editor page is recognized, Customizer Additional CSS is appended
to the editor stylesheet. Additional CSS is already emitted by WordPress on the
front end. This loading path still needs iframe/browser acceptance checks.

The root Group has two readable classes, for example:

```text
kghq-published kghq-site-project-name--lovable--app
```

Dots in the host become double hyphens. No random IDs or generated hash classes
are added. Source classes are retained only when they are short readable class
tokens; complex Tailwind utility tokens and generated-looking tokens are excluded.
This is another reason source stylesheet fidelity is not yet achieved.

Content styles target `.kghq-published` descendants, and canvas/editor rules are
restricted to imported pages. The stylesheet does not set individual
block font families, load Google Fonts, alter theme files or change global theme
colors. Fonts currently inherit from WordPress/the theme. **No source fonts are
downloaded or self-hosted in this preview.**

The active theme may still enqueue its own remote fonts. This preview does not
rewrite or disable those global theme requests; zero remote-font requests have
not been certified.

## Widths: current behavior and limitations

The root Group uses native `alignfull`. The base stylesheet has provisional
`--kghq-content-width: 1200px` and `--kghq-wide-width: 1440px` variables. Descendant
normal/wide/full rules use those variables. These values are baseline defaults,
not measurements extracted from the source site. The converter does not yet infer
which source sections should be wide or full width.

An independent imported-page canvas now bypasses the classic theme's page-content
wrapper while retaining `get_header()` and `get_footer()`. It applies only to pages
with this preview's source metadata. No theme files or global options change.
For developer troubleshooting, `_kghq_published_template = theme` restores a
page's normal theme template. The companion packages the same canvas for removal.

In the Gutenberg editor, the theme was constraining the iframe body to a 580px
maximum. Scoped rules now remove that body limit and the root alignment wrapper's
extra margins only when `.kghq-published` exists. Normal pages keep their editor
widths. This addresses a measured wrapper constraint, not source layout inference.

The synthetic Twenty Seventeen test improved front-end root widths from
524.3125/389.75/300px to 1440/768/390px at those viewports. The editor root improved
from 616px to its available iframe width; exact final measurements are in the test
evidence. The editor's available viewport can be narrower than the browser window
because WordPress's settings sidebar occupies space. Compare at matching content
viewport widths. Matching computed theme font-family declarations does not prove
source font files are preserved or loaded.

Neve, GeneratePress, Astra and child-theme width parity remain **not tested for
this preview**. Do not globally widen every page to hide another theme conflict.

## Styling architecture for the next pass (not implemented yet)

1. Read each source project's published CSS and declared tokens independently.
   Do not hardcode this test project's typography, sections or component names.
2. Keep editable native properties in block attributes. Store project-wide fonts,
   tokens, media queries, hover/focus states and unsupported layout properties in
   one readable per-project stylesheet under a dedicated uploads directory.
3. Scope every selector to the readable project root. Scope variables and animation
   names too. Keep source breakpoints and exact values; do not guess Tailwind defaults.
4. Download verified assets and fonts through safe WordPress HTTP transport. Rewrite
   local URLs, use `font-display: optional` and preload only the needed primary
   weights. Reject executable assets and unsafe CSS. Do not leave remote font or
   background-image dependencies that the visitor must load from the source host.
5. Load the same project stylesheet in the front end and editor content iframe.
   Translate source normal/wide/full widths consistently into native attributes.
   Resolve classic theme container conflicts per imported page, without changing
   unrelated pages or global settings.
6. Keep the small independent styling companion responsible only for loading those
   stored styles. Content must remain core blocks after importer deletion.

The current companion retains only the base stylesheet. It does **not** implement
the per-project design export described above.

## How to verify styling changes

Compare the original and imported main regions at 1440, 768 and 390 pixels using
identical browser versions, device scale, locale and font availability. Wait for
fonts and images; disable animation during capture. Record pixel differences,
section geometry, missing assets and text changes. Capture the editor separately:
front-end similarity does not prove an accurate editor or useful editing controls.

Edit text, replace an image, change a button URL/color, adjust supported spacing,
duplicate/reorder a section, then save and reopen. Test ordinary content outside
the imported scope and a second source project for styling leakage. Finally,
remove the importer while retaining the styling companion and confirm pages,
attachments, local fonts and styling survive. Until those tests pass, report
visual fidelity, editability and functional integrity separately.

Do not add page-specific CSS to conceal a converter defect. Fix the conversion
rule and rerun the regression cases first.
