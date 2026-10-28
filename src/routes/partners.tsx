import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Handshake,
  Landmark,
  Megaphone,
  Menu,
  Network,
  Presentation,
  RefreshCcw,
  Scale,
  Share2,
  Users,
  X } from
"lucide-react";

import { Button } from "@/components/ui/button";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
  head: () => ({
    meta: [
    { title: "KGHQ Partner Network — Help Small Businesses Execute" },
    { name: "description", content: "Join the KGHQ Partner Network and give your clients, members, or community hands-on business execution support." },
    { property: "og:title", content: "KGHQ Partner Network" },
    { property: "og:description", content: "An ecosystem of people and organizations helping small businesses move forward." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }]


  })
});

const audiences = [
"CPAs & Accounting Firms", "Attorneys", "Fractional Leaders",
"Business Coaches & Consultants", "Chambers of Commerce", "Associations",
"Entrepreneur Organizations", "Banks & Financial Professionals", "Coworking & Incubator Communities"];


const professionalPartners = [
"CPAs and bookkeepers", "Attorneys", "Fractional CMOs, COOs, CROs and CFOs",
"Business consultants and coaches", "Insurance, payroll and benefits advisors",
"Business bankers and financial professionals", "Web and marketing specialists"];


const organizationBenefits = [
"Free educational webinars and workshops", "Member-only Growth Planning Sessions",
"Exclusive member pricing or benefits", "Office hours and Ask KGHQ sessions",
"Co-branded small-business resources", "Speaker programming for events",
"Website and marketing audits", "Business growth clinics", "Co-marketing",
"Sponsorships or revenue-generating workshops", "A dedicated member landing page"];


const partnershipWays = [
[Share2, "Refer", "Know a business that needs execution support? Make an introduction."],
[Handshake, "Collaborate", "Work with KGHQ as an execution partner for your clients."],
[Presentation, "Educate", "Bring KGHQ workshops, webinars, office hours, and resources to your members."],
[Megaphone, "Co-Market", "Create joint content, events, guides, and campaigns."],
[Users, "Member Benefits", "Offer your members preferred KGHQ benefits or services."],
[RefreshCcw, "Refer Back", "We connect KGHQ clients with trusted experts when they need your expertise."]] as
const;

const capabilities = [
[Megaphone, "Marketing", "Websites, SEO, campaigns, content, and digital presence"],
[BriefcaseBusiness, "Sales", "Prospecting, outreach, CRM, lead follow-up, and sales support"],
[Network, "Technology", "Automation, AI, systems, integrations, and business tools"],
[Building2, "Admin & Operations", "Projects, processes, administrative support, and execution"]] as
const;

const examples = [
[Scale, "You’re a CPA.", "Your client says their website hasn’t been touched in six years. Introduce them to KGHQ."],
[BriefcaseBusiness, "You’re a Fractional CMO.", "You built the strategy, but your client doesn’t have a team to execute it. Bring in KGHQ."],
[Landmark, "You’re a business attorney.", "You helped establish the company. KGHQ can help build the systems, presence, and growth engine that comes next."],
[Users, "You’re a Chamber.", "Your members need help with AI, marketing, sales, and technology. KGHQ can provide programming and hands-on support."]] as
const;



function Hero() {
  return (
    <section className="layout-page-section layout-overflow-hidden layout-bg-kh-ink layout-px-5 layout-pb-20 layout-pt-20 layout-text-kh-white layout-tablet-px-8 layout-tablet-pb-28 layout-tablet-pt-28 layout-hero">
      
      <div className="layout-mx-auto layout-max-w-7xl">
        <div className="layout-flex layout-items-center layout-gap-3 layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-lime"><Network className="layout-size-4" />KGHQ Partner Network</div>
        <h1 className="layout-mt-7 layout-max-w-5xl layout-font-display layout-text-5xl layout-font-extrabold layout-leading-1-02 layout-tablet-text-6xl layout-tablet-text-7xl layout-desktop-text-8xl">Help small businesses get more done. <span className="layout-text-kh-lime">Together.</span></h1>
        <p className="layout-mt-7 layout-max-w-3xl layout-text-xl layout-leading-relaxed layout-text-kh-paper">You help entrepreneurs start, manage, and grow their businesses. KGHQ helps them execute.</p>
        <p className="layout-mt-4 layout-max-w-3xl layout-text-base layout-leading-relaxed layout-text-kh-dark-muted layout-tablet-text-lg">Join the KGHQ Partner Network and give your clients, members, and community access to hands-on support across marketing, sales, technology, and administration.</p>
        <div className="layout-mt-9 layout-flex layout-flex-wrap layout-gap-3"><a href="#partner-form" className="layout-inline-flex layout-min-h-12 layout-items-center layout-gap-2 layout-bg-kh-lime layout-px-6 layout-py-3 layout-font-display layout-text-sm layout-font-bold layout-text-kh-ink page-link">Join the Partner Network <ArrowRight className="layout-size-4" /></a><a href="#partner-form" className="layout-inline-flex layout-min-h-12 layout-items-center layout-border layout-border-kh-dark-line layout-px-6 layout-py-3 layout-font-display layout-text-sm layout-font-bold layout-text-kh-white page-link">Talk to A.J. About a Partnership</a></div>
      </div>
    </section>);

}

function AudienceBand() {
  return <section id="who" className="layout-page-section layout-bg-kh-lime layout-px-5 layout-py-12 layout-text-kh-ink layout-tablet-px-8"><div className="layout-mx-auto layout-max-w-7xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase">Built for people who serve small business</p><div className="layout-mt-7 layout-flex layout-flex-wrap layout-gap-2">{audiences.map((audience) => <span key={audience} className="layout-border layout-border-kh-ink-20 layout-bg-kh-paper layout-px-4 layout-py-2-5 layout-text-sm layout-font-bold">{audience}</span>)}</div></div></section>;
}

function Tracks() {
  return (
    <section id="tracks" className="layout-page-section layout-bg-kh-paper layout-px-5 layout-py-20 layout-text-kh-ink layout-tablet-px-8 layout-tablet-py-28">
      <div className="layout-mx-auto layout-max-w-7xl"><div className="layout-max-w-3xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">Two ways into the network</p><h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">A partnership built around <span className="layout-text-kh-green-deep">who you serve.</span></h2></div>
        <div className="layout-mt-14 layout-grid layout-gap-6 layout-desktop-grid-cols-2">
          <article className="layout-border-t-8 layout-border-kh-green layout-bg-kh-white layout-p-7 layout-shadow-kh layout-tablet-p-10 service-card"><BriefcaseBusiness className="layout-size-9 layout-text-kh-green-deep" /><p className="layout-mt-7 layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-muted">For professional partners</p><h3 className="layout-mt-3 layout-font-display layout-text-3xl layout-font-extrabold">Give your clients an execution team.</h3><p className="layout-mt-4 layout-leading-relaxed layout-text-kh-muted">You’re already advising clients on what they should do. KGHQ can help them actually do it.</p><ul className="layout-mt-7 layout-grid layout-gap-3 layout-tablet-grid-cols-2">{professionalPartners.map((item) => <li key={item} className="layout-flex layout-gap-2 layout-text-sm layout-font-semibold"><Check className="layout-mt-0-5 layout-size-4 layout-shrink-0 layout-text-kh-green" />{item}</li>)}</ul><div className="layout-mt-8 layout-border-l-4 layout-border-kh-green layout-bg-kh-mist layout-p-5"><h4 className="layout-font-display layout-text-lg layout-font-bold">Extend your team without building one.</h4><p className="layout-mt-2 layout-text-sm layout-leading-relaxed layout-text-kh-muted">KGHQ can work behind the scenes alongside fractional leaders to execute campaigns, websites, CRM work, outbound sales, automation, admin, and ongoing priorities.</p></div><p className="layout-mt-6 layout-text-sm layout-leading-relaxed layout-text-kh-muted">Refer clients when they need help executing. We’ll take care of them, keep you in the loop when appropriate, and refer business back when our clients need your expertise.</p></article>
          <article className="layout-border-t-8 layout-border-kh-coral layout-bg-kh-white layout-p-7 layout-shadow-kh layout-tablet-p-10 service-card"><Users className="layout-size-9 layout-text-kh-coral" /><p className="layout-mt-7 layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-muted">For chambers, associations & communities</p><h3 className="layout-mt-3 layout-font-display layout-text-3xl layout-font-extrabold">Bring more value to your members without adding more work.</h3><p className="layout-mt-4 layout-leading-relaxed layout-text-kh-muted">Build a program around what KGHQ can give your members—not simply around asking your organization for referrals.</p><ul className="layout-mt-7 layout-grid layout-gap-3 layout-tablet-grid-cols-2">{organizationBenefits.map((item) => <li key={item} className="layout-flex layout-gap-2 layout-text-sm layout-font-semibold"><Check className="layout-mt-0-5 layout-size-4 layout-shrink-0 layout-text-kh-coral" />{item}</li>)}</ul></article>
        </div>
      </div>
    </section>);

}

function Ways() {
  return <section id="ways" className="layout-page-section layout-bg-kh-ink layout-px-5 layout-py-20 layout-text-kh-white layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-max-w-3xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-lime">Ways we can partner</p><h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">Built for mutual value.<br /><span className="layout-text-kh-lime">Not one-way referrals.</span></h2></div><div className="layout-mt-14 layout-grid layout-gap-px layout-bg-kh-dark-line layout-tablet-grid-cols-2 layout-desktop-grid-cols-3">{partnershipWays.map(([Icon, title, copy], index) => <article key={title} className="layout-min-h-64 layout-bg-kh-ink-soft layout-p-7 service-card"><span className={`layout-grid layout-size-11 layout-place-items-center layout- ${index % 2 ? "layout-bg-kh-yellow layout-text-kh-ink" : "layout-bg-kh-lime layout-text-kh-ink"}layout- `}><Icon className="layout-size-5" /></span><h3 className="layout-mt-8 layout-font-display layout-text-2xl layout-font-bold">{title}</h3><p className="layout-mt-3 layout-text-sm layout-leading-relaxed layout-text-kh-dark-muted">{copy}</p></article>)}</div></div></section>;
}

function WhyKghq() {
  return <section className="layout-page-section layout-bg-kh-mist layout-px-5 layout-py-20 layout-text-kh-ink layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-grid layout-gap-12 layout-desktop-grid-cols-0-8fr-1-2fr"><div><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">Why KGHQ?</p><h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">Your clients don’t need another person telling them what to do.</h2><p className="layout-mt-6 layout-font-display layout-text-2xl layout-font-bold layout-text-kh-green-deep">They need help getting it done.</p><p className="layout-mt-5 layout-leading-relaxed layout-text-kh-muted">KGHQ is an AI-assisted, human-executed growth hub for small business. We combine strategy, technology, and hands-on execution.</p></div><div className="layout-grid layout-gap-px layout-bg-kh-line layout-tablet-grid-cols-2">{capabilities.map(([Icon, title, copy]) => <article key={title} className="layout-bg-kh-white layout-p-7 service-card"><Icon className="layout-size-7 layout-text-kh-green-deep" /><h3 className="layout-mt-7 layout-font-display layout-text-xl layout-font-bold">{title}</h3><p className="layout-mt-3 layout-text-sm layout-leading-relaxed layout-text-kh-muted">{copy}</p></article>)}</div></div><blockquote className="layout-mt-14 layout-border-l-8 layout-border-kh-green layout-bg-kh-white layout-p-7 layout-font-display layout-text-2xl layout-font-bold layout-shadow-kh layout-tablet-p-10 layout-tablet-text-4xl">“I know I need to do that. I just don’t have the time or people.”<span className="layout-mt-4 layout-block layout-text-base layout-font-semibold layout-text-kh-muted">Now you have somewhere to send them.</span></blockquote></div></section>;
}

function Examples() {
  return <section id="examples" className="layout-page-section layout-bg-kh-paper layout-px-5 layout-py-20 layout-text-kh-ink layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-max-w-3xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">See yourself in the network</p><h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">A warm handoff. A capable team. <span className="layout-text-kh-green-deep">A better next step.</span></h2></div><div className="layout-mt-14 layout-grid layout-gap-5 layout-tablet-grid-cols-2">{examples.map(([Icon, title, copy], index) => <article key={title} className="layout-border layout-border-kh-line layout-bg-kh-white layout-p-7 layout-shadow-kh service-card"><div className="layout-flex layout-items-center layout-justify-between"><Icon className="layout-size-7 layout-text-kh-green-deep" /><span className="layout-font-display layout-text-4xl layout-font-extrabold layout-text-kh-mist">0{index + 1}</span></div><h3 className="layout-mt-7 layout-font-display layout-text-2xl layout-font-bold">{title}</h3><p className="layout-mt-3 layout-leading-relaxed layout-text-kh-muted">{copy}</p></article>)}</div></div></section>;
}

function PartnerForm() {

  const interests = ["Referrals", "Client Execution", "Workshops & Events", "Member Benefits", "Co-Marketing", "Other"];
  return <section id="partner-form" className="layout-page-section layout-bg-kh-ink layout-px-5 layout-py-20 layout-text-kh-white layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-grid layout-max-w-7xl layout-gap-14 layout-desktop-grid-cols-0-8fr-1-2fr"><div><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-lime">KGHQ Partner Network</p><h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">Let’s find a way to work together.</h2><p className="layout-mt-6 layout-text-lg layout-leading-relaxed layout-text-kh-dark-muted">Every partnership is a little different. Tell us who you serve and what you have in mind. We’ll explore where KGHQ can create value for you, your clients, or your members.</p><div className="layout-mt-9 layout-border-t layout-border-kh-dark-line layout-pt-7"><p className="layout-font-display layout-text-xl layout-font-bold">An ecosystem of people and organizations helping small businesses move forward.</p></div></div><form className="layout-bg-kh-white layout-p-6 layout-text-kh-ink layout-shadow-kh layout-tablet-p-9 layout-wp-form-placeholder" method="post" data-wordpress-form="replace-with-form-plugin"><div className="layout-grid layout-gap-5 layout-tablet-grid-cols-2"><Field label="Name" name="name" required /><Field label="Organization" name="organization" required /><Field label="Website" name="website" type="url" /><Field label="Email" name="email" type="email" required /><label className="layout-tablet-col-span-2"><span className="layout-font-display layout-text-sm layout-font-bold">Type of Partner</span><select name="partnerType" required defaultValue="" className="layout-mt-2 layout-min-h-12 layout-w-full layout-border layout-border-kh-line layout-bg-kh-paper layout-px-4 layout-text-sm layout-outline-none layout-focus-border-kh-green"><option value="" disabled>Select one</option><option>Professional Partner</option><option>Chamber or Association</option><option>Entrepreneur Community</option><option>Financial Institution</option><option>Other Organization</option></select></label><label className="layout-tablet-col-span-2"><span className="layout-font-display layout-text-sm layout-font-bold">Who do you serve?</span><textarea name="audience" required rows={3} className="layout-mt-2 layout-w-full layout-resize-y layout-border layout-border-kh-line layout-bg-kh-paper layout-p-4 layout-text-sm layout-outline-none layout-focus-border-kh-green" /></label></div><fieldset className="layout-mt-6"><legend className="layout-font-display layout-text-sm layout-font-bold">I’m interested in</legend><div className="layout-mt-3 layout-grid layout-gap-2 layout-tablet-grid-cols-2">{interests.map((interest) => <label key={interest} className="layout-flex layout-min-h-11 layout-items-center layout-gap-3 layout-border layout-border-kh-line layout-bg-kh-paper layout-px-4 layout-text-sm layout-font-semibold"><input type="checkbox" name="interests" value={interest} className="layout-size-4 layout-accent-primary" />{interest}</label>)}</div></fieldset><label className="layout-mt-6 layout-block"><span className="layout-font-display layout-text-sm layout-font-bold">Tell us about your idea</span><textarea name="idea" required rows={5} className="layout-mt-2 layout-w-full layout-resize-y layout-border layout-border-kh-line layout-bg-kh-paper layout-p-4 layout-text-sm layout-outline-none layout-focus-border-kh-green" placeholder="What could we create together?" /></label><Button type="submit" className="layout-mt-7 layout-min-h-12 layout-rounded-none layout-bg-kh-green layout-px-6 layout-font-display layout-font-bold layout-text-kh-white">Explore a Partnership <ArrowRight /></Button></form></div></section>;
}

function Field({ label, name, type = "text", required = false }: {label: string;name: string;type?: string;required?: boolean;}) {
  return <label><span className="layout-font-display layout-text-sm layout-font-bold">{label}</span><input name={name} type={type} required={required} className="layout-mt-2 layout-min-h-12 layout-w-full layout-border layout-border-kh-line layout-bg-kh-paper layout-px-4 layout-text-sm layout-outline-none layout-focus-border-kh-green" /></label>;
}



function PartnersPage() {
  return <main className="layout-bg-kh-paper layout-font-body layout-text-kh-ink layout-antialiased"><Hero /><AudienceBand /><Tracks /><Ways /><WhyKghq /><Examples /><PartnerForm /></main>;
}