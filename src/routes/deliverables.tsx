import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BarChart3, Check, ChevronDown, FileText, Globe2, Layers3,
  Mail, Menu, Mic, Palette, PhoneCall, Search, Target, Users, Video, Workflow, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";
import { StackedBricks } from "@/components/stacked-bricks";
import { brickAmount, categories, deliverables, deliverableImage, filterDeliverables, type Deliverable } from "@/lib/deliverables-catalog";

export const Route = createFileRoute("/deliverables")({
  component: DeliverablesPage,
  head: () => ({
    meta: [
      { title: "Deliverables Library — KGHQ" },
      { name: "description", content: "Explore the marketing, sales, technology, and operations work KGHQ can execute for your business." },
      { property: "og:title", content: "Explore the KGHQ Deliverables Library" },
      { property: "og:description", content: "Choose the work that moves your business forward across marketing, sales, technology, and operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" },
    ],
  }),
});

function itemIcon(item: Deliverable) {
  const title = item.title.toLowerCase();
  if (/phone|call|dialing|voicemail|sms|receptionist/.test(title)) return PhoneCall;
  if (/podcast|audio|voiceover/.test(title)) return Mic;
  if (/video|reel|thumbnail/.test(title)) return Video;
  if (/email|newsletter|spf/.test(title)) return Mail;
  if (/website|domain|hosting|ssl|dns|ecommerce|landing/.test(title)) return Globe2;
  if (/dashboard|report|analysis|bookkeeping/.test(title)) return BarChart3;
  if (/automation|system|integration|agent|chatbot/.test(title)) return Workflow;
  if (/lead|prospect|icp|account|territory/.test(title)) return Target;
  if (/brand|logo|design|brochure|merch|flyer|banner/.test(title)) return Palette;
  if (/social|outreach/.test(title)) return Users;
  if (/slide|deck/.test(title)) return Layers3;
  return FileText;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-kh-dark-line bg-kh-ink text-kh-white"><div className="mx-auto flex h-18 max-w-[1480px] items-center justify-between px-5 md:px-8"><Link to="/" aria-label="KGHQ home"><img src={logoLightAsset.url} alt="KGHQ" width={249} height={66} className="h-8 w-auto md:h-9" /></Link><nav className="hidden items-center gap-7 lg:flex" aria-label="Deliverables navigation"><Link to="/" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Home</Link><a href="#library" className="text-sm font-semibold text-kh-white">Library</a><Link to="/growth-reset" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Growth Reset</Link><Link to="/partners" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Partners</Link></nav><Link to="/new-client" className="hidden min-h-11 items-center gap-2 bg-kh-lime px-5 font-display text-sm font-bold text-kh-ink md:inline-flex">Get Started <ArrowRight className="size-4" /></Link><Button type="button" variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="text-kh-white hover:bg-kh-white/10 hover:text-kh-white lg:hidden">{open ? <X /> : <Menu />}</Button></div>{open && <nav className="border-t border-kh-dark-line px-5 py-5 lg:hidden"><Link to="/" className="block border-b border-kh-dark-line py-3 font-semibold">Home</Link><a href="#library" onClick={() => setOpen(false)} className="block border-b border-kh-dark-line py-3 font-semibold">Library</a><Link to="/growth-reset" className="block border-b border-kh-dark-line py-3 font-semibold">Growth Reset</Link><Link to="/partners" className="block border-b border-kh-dark-line py-3 font-semibold">Partners</Link><Link to="/new-client" className="mt-5 inline-flex min-h-11 items-center bg-kh-lime px-5 font-bold text-kh-ink">Get Started</Link></nav>}</header>;
}

function DeliverableCard({ item }: { item: Deliverable }) {
  const Icon = itemIcon(item);
  return <article data-deliverable-id={item.id} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-kh-line bg-kh-white shadow-kh transition-transform motion-safe:hover:-translate-y-1">
    <div className="relative">
      <div className="aspect-[4/3] overflow-hidden bg-kh-mist"><img src={deliverableImage(item)} alt={`${item.title} deliverable mockup`} loading="lazy" width={474} height={474} className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
      <span className="absolute -bottom-6 left-5 grid size-12 place-items-center rounded-full border border-kh-line bg-kh-white text-kh-green-deep shadow-kh"><Icon className="size-5" /></span>
    </div>
    <div className="flex flex-1 flex-col p-5 pt-9">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-kh-green-deep">{item.subcategory}</p>
      <h3 className="mt-2 font-display text-base font-extrabold leading-snug">{item.title}</h3>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-kh-muted">{item.description}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-kh-line pt-4 font-display text-sm font-bold text-kh-green-deep"><StackedBricks className="size-6 shrink-0" /><span data-brick-amount>{brickAmount(item)} Bricks</span></div>
    </div>
  </article>;
}

function BricksYourWay() {
  return <section className="mt-12 bg-kh-mist p-6 md:p-8"><div className="grid gap-6 md:grid-cols-2 md:items-center"><div><StackedBricks className="size-8 text-kh-green-deep" /><h2 className="mt-4 font-display text-xl font-extrabold md:text-2xl">Use your Bricks your way.</h2><p className="mt-2 text-sm font-semibold text-kh-green-deep">Mix and match deliverables every month.</p></div><ul className="grid gap-3 text-xs text-kh-muted sm:grid-cols-2">{["Choose what your business needs now", "Clear scope and Brick amounts", "Expert support across all categories", "Real progress, every month"].map(item => <li key={item} className="flex gap-2"><Check className="size-4 shrink-0 text-kh-green" />{item}</li>)}</ul></div></section>;
}

function Library({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [sort, setSort] = useState("menu");
  const filtered = useMemo(() => filterDeliverables(query, category, subcategory, sort), [category, subcategory, query, sort]);
  const sections = [...new Set(deliverables.filter(item => category === "All" || item.category === category).map(item => item.subcategory))];
  return <section id="library" className="scroll-mt-18 bg-kh-paper px-5 py-10 text-kh-ink md:px-8 md:py-14"><div className="mx-auto max-w-[1480px]">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h2 aria-live="polite" className="font-display text-3xl font-extrabold">{filtered.length} Deliverables</h2><p className="mt-2 text-sm text-kh-muted">Clear scopes. Coordinated execution. Put your Bricks to work.</p></div><label className="flex items-center gap-3 text-xs font-bold">Sort by<span className="relative"><select aria-label="Sort deliverables" value={sort} onChange={event => setSort(event.target.value)} className="min-h-11 appearance-none rounded-md border border-kh-line bg-kh-white py-2 pl-3 pr-9 text-xs outline-none focus:border-kh-green"><option value="menu">Booklet Order</option><option value="bricks-low">Bricks: Low to High</option><option value="bricks-high">Bricks: High to Low</option><option value="name">Name: A to Z</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-3.5 size-4" /></span></label></div>
    <div className="mt-7 flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-3.5 size-5 text-kh-muted"/><input value={query} onChange={event => setQuery(event.target.value)} className="min-h-12 w-full min-w-0 rounded-md border border-kh-line bg-kh-white pl-12 pr-11 text-sm outline-none focus:border-kh-green" placeholder="Search deliverables (e.g. website, email, CRM)..." aria-label="Search deliverables" />{query && <Button type="button" variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-1 top-1 text-kh-muted"><X className="size-4"/></Button>}</div><label className="flex items-center gap-3 text-xs font-bold"><span>Specialty</span><select aria-label="Filter by specialty" value={subcategory} onChange={event => setSubcategory(event.target.value)} className="min-h-12 min-w-0 flex-1 rounded-md border border-kh-line bg-kh-white px-3 text-xs outline-none focus:border-kh-green"><option value="All">All specialties</option>{sections.map(section => <option key={section}>{section}</option>)}</select></label></div>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Deliverable categories">{["All", ...categories].map(item => <Button key={item} type="button" variant="outline" aria-pressed={category === item} onClick={() => { setCategory(item); setSubcategory("All"); }} className={`rounded-md px-4 text-xs ${category === item ? "border-kh-green bg-kh-green text-kh-white hover:bg-kh-green-deep hover:text-kh-white" : "border-kh-line bg-kh-white text-kh-ink hover:bg-kh-mist"}`}>{item}<span className="ml-1 opacity-70">{item === "All" ? deliverables.length : deliverables.filter(d => d.category === item).length}</span></Button>)}</div>
    <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(item => <DeliverableCard key={item.id} item={item} />)}{filtered.length === 0 && <div className="col-span-full border border-kh-line bg-kh-white p-10 text-center"><Search className="mx-auto size-8 text-kh-green"/><h3 className="mt-4 font-display text-xl font-bold">No deliverables found</h3><p className="mt-2 text-sm text-kh-muted">Try a broader search or another category.</p><Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); setSubcategory("All"); }} className="mt-5">Clear filters</Button></div>}</div>
    <BricksYourWay />
  </div></section>;
}

function Hero({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  return <section className="relative overflow-hidden bg-kh-ink px-5 py-14 text-kh-white md:px-8 md:py-20"><div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--kh-dark-line)_1px,transparent_1px),linear-gradient(90deg,var(--kh-dark-line)_1px,transparent_1px)] [background-size:48px_48px]"/><div className="relative mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Deliverables Library</p><h1 className="mt-4 max-w-5xl font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl md:text-7xl">Explore the <span className="text-kh-lime">work that gets growth moving.</span></h1><p className="mt-5 max-w-3xl text-lg text-kh-dark-muted">Browse practical, high-quality deliverables across marketing, sales development, and business support.</p><form className="relative mt-8 max-w-4xl" onSubmit={event => { event.preventDefault(); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}><Search className="absolute left-4 top-3.5 size-5 text-kh-muted"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="What do you need to get done?" className="min-h-12 w-full bg-kh-white pl-12 pr-28 text-sm text-kh-ink outline-none"/><Button type="submit" className="absolute right-1.5 top-1.5 rounded-none bg-kh-green text-kh-white hover:bg-kh-green-deep">Explore</Button></form></div><div className="border-l-4 border-kh-lime pl-6"><p className="font-display text-2xl font-extrabold italic">Choose what gets done.</p><div className="mt-5 flex items-center gap-3 text-sm text-kh-dark-muted"><StackedBricks className="size-6 shrink-0 text-kh-lime"/>Flexible Bricks. Managed execution.</div></div></div></section>;
}

function FinalCta() {
  return <section className="bg-kh-ink px-5 py-14 text-kh-white md:px-8"><div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Ready to make progress?</p><h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">Don’t know where to start? We’ll build your plan.</h2><p className="mt-3 text-kh-dark-muted">Tell us your goals and we’ll recommend the best mix of deliverables for your business.</p></div><Link to="/new-client" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-kh-lime px-7 font-display text-sm font-bold text-kh-ink">Build My Plan <ArrowRight className="size-4" /></Link></div></section>;
}

function DeliverablesPage() {
  const [query, setQuery] = useState("");
  return <main className="min-h-screen bg-kh-paper font-body text-kh-ink antialiased"><Header /><Hero query={query} setQuery={setQuery} /><Library query={query} setQuery={setQuery} /><FinalCta /></main>;
}