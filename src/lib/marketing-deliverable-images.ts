import landing from "@/assets/deliv-landing-cool.jpg";
import leadMagnet from "@/assets/deliv-leadmagnet-cool.jpg";
import email from "@/assets/deliv-email-cool.jpg";
import social from "@/assets/deliv-social-cool.jpg";
import seo from "@/assets/deliv-seo-cool.jpg";
import local from "@/assets/deliv-local-cool.jpg";
import brand from "@/assets/deliv-brand-cool.jpg";
import website from "@/assets/deliv-website-cool.jpg";

export const marketingPreviewImages = {
  site: landing,
  doc: leadMagnet,
  email,
  social,
  search: seo,
  local,
  brand,
  story: website,
};

// Only matching booklet scopes share photos; Google Business Profile has no
// equivalent entry, so its photo stays specific to the Marketing preview.
export const marketingCatalogImages: Record<string, string> = {
  "deliverable-062": landing,
  "deliverable-064": leadMagnet,
  "deliverable-060": email,
  "deliverable-046": social,
  "deliverable-026": seo,
  "deliverable-002": brand,
  "deliverable-076": website,
};