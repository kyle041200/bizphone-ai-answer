# KGHQ Homepage

## Build
- Replace the current root page with a new KGHQ homepage using the supplied copy and the established dark, energetic KGHQ visual style.
- Use a clickable KGHQ wordmark as the Home control in the header, with navigation to Services, Programs, Tools, How It Works, and Resources sections.
- Structure the long page into visually distinct editorial sections: opening statement, execution problem, Execution Engine, flexible capacity, three ways to work with KGHQ, AI plus people, use cases, Growth Skyscraper, process, comparison, on-demand support, unified workspace, outcomes, founder story, final action, and footer.
- Add purposeful visual storytelling with custom generated imagery and diagrams while keeping the page fast, legible, and responsive.

## Preserve Existing Pages
- Move the current BizPhone experience to `/bizphone` so it remains available after the homepage replaces `/`.
- Keep BizSite at `/bizsite` and New Client at `/new-client`.
- Make the logo/brand in each page header link back to the new homepage, and expose BizPhone and BizSite from the new homepage.

## Interactions
- Keep homepage navigation as smooth in-page navigation because the supplied content defines one complete homepage.
- Route “Get Something Done” actions to the New Client onboarding page.
- Use existing destinations where available; keep future-only offerings as informative homepage content rather than dead links.

## Technical Details
- Preserve TanStack route conventions and add unique metadata for the new homepage and relocated BizPhone page.
- Extend semantic theme tokens for the KGHQ homepage rather than hardcoding visual colors in page markup.
- Verify desktop and mobile layouts, header navigation, internal links, and all existing routes after implementation.
