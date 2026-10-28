import { createFileRoute, Link } from "@tanstack/react-router";
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
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
    
  }),
});

const audiences = [
  "CPAs & Accounting Firms", "Attorneys", "Fractional Leaders",
  "Business Coaches & Consultants", "Chambers of Commerce", "Associations",
  "Entrepreneur Organizations", "Banks & Financial Professionals", "Coworking & Incubator Communities",
];

const professionalPartners = [
  "CPAs and bookkeepers", "Attorneys", "Fractional CMOs, COOs, CROs and CFOs",
  "Business consultants and coaches", "Insurance, payroll and benefits advisors",
  "Business bankers and financial professionals", "Web and marketing specialists",
];

const organizationBenefits = [
  "Free educational webinars and workshops", "Member-only Growth Planning Sessions",
  "Exclusive member pricing or benefits", "Office hours and Ask KGHQ sessions",
  "Co-branded small-business resources", "Speaker programming for events",
  "Website and marketing audits", "Business growth clinics", "Co-marketing",
  "Sponsorships or revenue-generating workshops", "A dedicated member landing page",
];

const partnershipWays = [
  [Share2, "Refer", "Know a business that needs execution support? Make an introduction."],
  [Handshake, "Collaborate", "Work with KGHQ as an execution partner for your clients."],
  [Presentation, "Educate", "Bring KGHQ workshops, webinars, office hours, and resources to your members."],
  [Megaphone, "Co-Market", "Create joint content, events, guides, and campaigns."],
  [Users, "Member Benefits", "Offer your members preferred KGHQ benefits or services."],
  [RefreshCcw, "Refer Back", "We connect KGHQ clients with trusted experts when they need your expertise."],
] as const;

const capabilities = [
  [Megaphone, "Marketing", "Websites, SEO, campaigns, content, and digital presence"],
  [BriefcaseBusiness, "Sales", "Prospecting, outreach, CRM, lead follow-up, and sales support"],
  [Network, "Technology", "Automation, AI, systems, integrations, and business tools"],
  [Building2, "Admin & Operations", "Projects, processes, administrative support, and execution"],
] as const;

const examples = [
  [Scale, "You’re a CPA.", "Your client says their website hasn’t been touched in six years. Introduce them to KGHQ."],
  [BriefcaseBusiness, "You’re a Fractional CMO.", "You built the strategy, but your client doesn’t have a team to execute it. Bring in KGHQ."],
  [Landmark, "You’re a business attorney.", "You helped establish the company. KGHQ can help build the systems, presence, and growth engine that comes next."],
  [Users, "You’re a Chamber.", "Your members need help with AI, marketing, sales, and technology. KGHQ can provide programming and hands-on support."],
] as const;



function Hero() {
  return (
    <section className="relative overflow-hidden bg-kh-ink px-5 pb-20 pt-20 text-kh-white md:px-8 md:pb-28 md:pt-28">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--kh-dark-line)_1px,transparent_1px),linear-gradient(90deg,var(--kh-dark-line)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime"><Network className="size-4" />KGHQ Partner Network</div>
        <h1 className="mt-7 max-w-5xl font-display text-5xl font-extrabold leading-[1.02] tracking-normal sm:text-6xl md:text-7xl lg:text-8xl">Help small businesses get more done. <span className="text-kh-lime">Together.</span></h1>
        <p className="mt-7 max-w-3xl text-xl leading-relaxed text-kh-paper">You help entrepreneurs start, manage, and grow their businesses. KGHQ helps them execute.</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-kh-dark-muted md:text-lg">Join the KGHQ Partner Network and give your clients, members, and community access to hands-on support across marketing, sales, technology, and administration.</p>
        <div className="mt-9 flex flex-wrap gap-3"><a href="#partner-form" className="inline-flex min-h-12 items-center gap-2 bg-kh-lime px-6 py-3 font-display text-sm font-bold text-kh-ink">Join the Partner Network <ArrowRight className="size-4" /></a><a href="#partner-form" className="inline-flex min-h-12 items-center border border-kh-dark-line px-6 py-3 font-display text-sm font-bold text-kh-white hover:bg-kh-white/10">Talk to A.J. About a Partnership</a></div>
      </div>
    </section>
  );
}

function AudienceBand() {
  return <section id="who" className="bg-kh-lime px-5 py-12 text-kh-ink md:px-8"><div className="mx-auto max-w-7xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em]">Built for people who serve small business</p><div className="mt-7 flex flex-wrap gap-2">{audiences.map(audience => <span key={audience} className="border border-kh-ink/20 bg-kh-paper px-4 py-2.5 text-sm font-bold">{audience}</span>)}</div></div></section>;
}

function Tracks() {
  return (
    <section id="tracks" className="bg-kh-paper px-5 py-20 text-kh-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">Two ways into the network</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">A partnership built around <span className="text-kh-green-deep">who you serve.</span></h2></div>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="border-t-8 border-kh-green bg-kh-white p-7 shadow-kh md:p-10"><BriefcaseBusiness className="size-9 text-kh-green-deep" /><p className="mt-7 font-display text-xs font-bold uppercase tracking-[0.16em] text-kh-muted">For professional partners</p><h3 className="mt-3 font-display text-3xl font-extrabold">Give your clients an execution team.</h3><p className="mt-4 leading-relaxed text-kh-muted">You’re already advising clients on what they should do. KGHQ can help them actually do it.</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{professionalPartners.map(item => <li key={item} className="flex gap-2 text-sm font-semibold"><Check className="mt-0.5 size-4 shrink-0 text-kh-green" />{item}</li>)}</ul><div className="mt-8 border-l-4 border-kh-green bg-kh-mist p-5"><h4 className="font-display text-lg font-bold">Extend your team without building one.</h4><p className="mt-2 text-sm leading-relaxed text-kh-muted">KGHQ can work behind the scenes alongside fractional leaders to execute campaigns, websites, CRM work, outbound sales, automation, admin, and ongoing priorities.</p></div><p className="mt-6 text-sm leading-relaxed text-kh-muted">Refer clients when they need help executing. We’ll take care of them, keep you in the loop when appropriate, and refer business back when our clients need your expertise.</p></article>
          <article className="border-t-8 border-kh-coral bg-kh-white p-7 shadow-kh md:p-10"><Users className="size-9 text-kh-coral" /><p className="mt-7 font-display text-xs font-bold uppercase tracking-[0.16em] text-kh-muted">For chambers, associations & communities</p><h3 className="mt-3 font-display text-3xl font-extrabold">Bring more value to your members without adding more work.</h3><p className="mt-4 leading-relaxed text-kh-muted">Build a program around what KGHQ can give your members—not simply around asking your organization for referrals.</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{organizationBenefits.map(item => <li key={item} className="flex gap-2 text-sm font-semibold"><Check className="mt-0.5 size-4 shrink-0 text-kh-coral" />{item}</li>)}</ul></article>
        </div>
      </div>
    </section>
  );
}

function Ways() {
  return <section id="ways" className="bg-kh-ink px-5 py-20 text-kh-white md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Ways we can partner</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Built for mutual value.<br /><span className="text-kh-lime">Not one-way referrals.</span></h2></div><div className="mt-14 grid gap-px bg-kh-dark-line sm:grid-cols-2 lg:grid-cols-3">{partnershipWays.map(([Icon, title, copy], index) => <article key={title} className="min-h-64 bg-kh-ink-soft p-7"><span className={`grid size-11 place-items-center ${index % 2 ? "bg-kh-yellow text-kh-ink" : "bg-kh-lime text-kh-ink"}`}><Icon className="size-5" /></span><h3 className="mt-8 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-kh-dark-muted">{copy}</p></article>)}</div></div></section>;
}

function WhyKghq() {
  return <section className="bg-kh-mist px-5 py-20 text-kh-ink md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">Why KGHQ?</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Your clients don’t need another person telling them what to do.</h2><p className="mt-6 font-display text-2xl font-bold text-kh-green-deep">They need help getting it done.</p><p className="mt-5 leading-relaxed text-kh-muted">KGHQ is an AI-assisted, human-executed growth hub for small business. We combine strategy, technology, and hands-on execution.</p></div><div className="grid gap-px bg-kh-line sm:grid-cols-2">{capabilities.map(([Icon, title, copy]) => <article key={title} className="bg-kh-white p-7"><Icon className="size-7 text-kh-green-deep" /><h3 className="mt-7 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-kh-muted">{copy}</p></article>)}</div></div><blockquote className="mt-14 border-l-8 border-kh-green bg-kh-white p-7 font-display text-2xl font-bold shadow-kh md:p-10 md:text-4xl">“I know I need to do that. I just don’t have the time or people.”<span className="mt-4 block text-base font-semibold text-kh-muted">Now you have somewhere to send them.</span></blockquote></div></section>;
}

function Examples() {
  return <section id="examples" className="bg-kh-paper px-5 py-20 text-kh-ink md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">See yourself in the network</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">A warm handoff. A capable team. <span className="text-kh-green-deep">A better next step.</span></h2></div><div className="mt-14 grid gap-5 md:grid-cols-2">{examples.map(([Icon, title, copy], index) => <article key={title} className="border border-kh-line bg-kh-white p-7 shadow-kh"><div className="flex items-center justify-between"><Icon className="size-7 text-kh-green-deep" /><span className="font-display text-4xl font-extrabold text-kh-mist">0{index + 1}</span></div><h3 className="mt-7 font-display text-2xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-kh-muted">{copy}</p></article>)}</div></div></section>;
}

function PartnerForm() {

  const interests = ["Referrals", "Client Execution", "Workshops & Events", "Member Benefits", "Co-Marketing", "Other"];
  return <section id="partner-form" className="bg-kh-ink px-5 py-20 text-kh-white md:px-8 md:py-28"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">KGHQ Partner Network</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Let’s find a way to work together.</h2><p className="mt-6 text-lg leading-relaxed text-kh-dark-muted">Every partnership is a little different. Tell us who you serve and what you have in mind. We’ll explore where KGHQ can create value for you, your clients, or your members.</p><div className="mt-9 border-t border-kh-dark-line pt-7"><p className="font-display text-xl font-bold">An ecosystem of people and organizations helping small businesses move forward.</p></div></div><form onSubmit={submit} className="bg-kh-white p-6 text-kh-ink shadow-kh md:p-9"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" required /><Field label="Organization" name="organization" required /><Field label="Website" name="website" type="url" /><Field label="Email" name="email" type="email" required /><label className="sm:col-span-2"><span className="font-display text-sm font-bold">Type of Partner</span><select name="partnerType" required defaultValue="" className="mt-2 min-h-12 w-full border border-kh-line bg-kh-paper px-4 text-sm outline-none focus:border-kh-green"><option value="" disabled>Select one</option><option>Professional Partner</option><option>Chamber or Association</option><option>Entrepreneur Community</option><option>Financial Institution</option><option>Other Organization</option></select></label><label className="sm:col-span-2"><span className="font-display text-sm font-bold">Who do you serve?</span><textarea name="audience" required rows={3} className="mt-2 w-full resize-y border border-kh-line bg-kh-paper p-4 text-sm outline-none focus:border-kh-green" /></label></div><fieldset className="mt-6"><legend className="font-display text-sm font-bold">I’m interested in</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{interests.map(interest => <label key={interest} className="flex min-h-11 items-center gap-3 border border-kh-line bg-kh-paper px-4 text-sm font-semibold"><input type="checkbox" name="interests" value={interest} className="size-4 accent-primary" />{interest}</label>)}</div></fieldset><label className="mt-6 block"><span className="font-display text-sm font-bold">Tell us about your idea</span><textarea name="idea" required rows={5} className="mt-2 w-full resize-y border border-kh-line bg-kh-paper p-4 text-sm outline-none focus:border-kh-green" placeholder="What could we create together?" /></label><Button type="submit" className="mt-7 min-h-12 rounded-none bg-kh-green px-6 font-display font-bold text-kh-white hover:bg-kh-green-deep">Explore a Partnership <ArrowRight /></Button></form></div></section>;
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label><span className="font-display text-sm font-bold">{label}</span><input name={name} type={type} required={required} className="mt-2 min-h-12 w-full border border-kh-line bg-kh-paper px-4 text-sm outline-none focus:border-kh-green" /></label>;
}



function PartnersPage() {
  return <main className="bg-kh-paper font-body text-kh-ink antialiased"><Hero /><AudienceBand /><Tracks /><Ways /><WhyKghq /><Examples /><PartnerForm /></main>;
}