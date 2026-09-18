import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BarChart3, Bot, CalendarDays, Check, ChevronDown, CircleDollarSign,
  Database, FileCheck2, FileText, Globe2, Inbox, Layers3, LayoutDashboard, Mail,
  Menu, MessageSquareText, PhoneCall, Search, Send, Sparkles, Star, Target,
  Users, WandSparkles, Workflow, X, Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";

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

type Category = "Marketing" | "Sales" | "Admin" | "Tech";
type Badge = "Popular" | "Quick Win" | "Best Value" | "Best for Outreach";

type Deliverable = {
  title: string;
  description: string;
  category: Category;
  tokens: number;
  icon: typeof Globe2;
  badge?: Badge;
  preview: "site" | "doc" | "social" | "dashboard" | "flow" | "email";
};

const deliverables: Deliverable[] = [
  { title: "Landing Page", description: "A focused page for your offer, campaign, or event.", category: "Marketing", tokens: 4, icon: Globe2, badge: "Popular", preview: "site" },
  { title: "SEO Article", description: "A researched article built to improve search visibility.", category: "Marketing", tokens: 3, icon: FileText, preview: "doc" },
  { title: "Social Content Pack", description: "Branded posts ready to publish across your channels.", category: "Marketing", tokens: 4, icon: MessageSquareText, badge: "Best Value", preview: "social" },
  { title: "Brand Refresh", description: "A sharper visual system for a more consistent presence.", category: "Marketing", tokens: 6, icon: WandSparkles, preview: "site" },
  { title: "Email Campaign", description: "A complete email sequence to nurture leads or customers.", category: "Marketing", tokens: 5, icon: Mail, preview: "email" },
  { title: "Lead Magnet", description: "A useful resource designed to capture qualified leads.", category: "Marketing", tokens: 4, icon: FileCheck2, badge: "Popular", preview: "doc" },
  { title: "Case Study", description: "Turn client results into a compelling customer story.", category: "Marketing", tokens: 4, icon: Star, preview: "doc" },
  { title: "Google Business Profile", description: "Improve local visibility and help customers find you.", category: "Marketing", tokens: 3, icon: Target, preview: "dashboard" },
  { title: "Outbound Email Sequence", description: "Personalized outreach designed to start conversations.", category: "Sales", tokens: 5, icon: Send, badge: "Best for Outreach", preview: "email" },
  { title: "Prospect List Build", description: "A targeted list of potential customers in your market.", category: "Sales", tokens: 4, icon: Users, preview: "dashboard" },
  { title: "CRM Cleanup", description: "Clean, organize, and improve the quality of your CRM data.", category: "Sales", tokens: 4, icon: Database, preview: "dashboard" },
  { title: "Call Script", description: "A practical script that gives every sales call structure.", category: "Sales", tokens: 3, icon: PhoneCall, preview: "doc" },
  { title: "Sales Deck", description: "A polished presentation that helps buyers understand the value.", category: "Sales", tokens: 5, icon: Layers3, preview: "doc" },
  { title: "Pipeline Follow-Up System", description: "A repeatable process for keeping opportunities moving.", category: "Sales", tokens: 5, icon: Workflow, preview: "flow" },
  { title: "Inbox Cleanup", description: "Organize your inbox and build a system that stays manageable.", category: "Admin", tokens: 3, icon: Inbox, badge: "Quick Win", preview: "dashboard" },
  { title: "Calendar Setup", description: "Create a cleaner appointment and scheduling workflow.", category: "Admin", tokens: 3, icon: CalendarDays, preview: "dashboard" },
  { title: "SOP Document", description: "Turn a recurring process into a clear, reusable guide.", category: "Admin", tokens: 4, icon: FileCheck2, preview: "doc" },
  { title: "Data Entry Project", description: "Handle structured research, records, or list-building work.", category: "Admin", tokens: 3, icon: Database, preview: "dashboard" },
  { title: "Client Onboarding", description: "Create a smoother welcome and kickoff experience.", category: "Admin", tokens: 4, icon: Users, preview: "flow" },
  { title: "Proposal Formatting", description: "Polish your proposals, scopes, or client documents.", category: "Admin", tokens: 3, icon: FileText, preview: "doc" },
  { title: "Website Update", description: "Improve existing pages, content, images, or sections.", category: "Tech", tokens: 4, icon: Globe2, badge: "Popular", preview: "site" },
  { title: "Automation Workflow", description: "Connect repetitive tasks so work moves automatically.", category: "Tech", tokens: 6, icon: Workflow, preview: "flow" },
  { title: "Chatbot Setup", description: "Add a helpful assistant to answer questions and capture leads.", category: "Tech", tokens: 5, icon: Bot, preview: "flow" },
  { title: "Analytics Dashboard", description: "Turn business data into a clear view of performance.", category: "Tech", tokens: 5, icon: BarChart3, preview: "dashboard" },
];

const categoryStyles: Record<Category, string> = {
  Marketing: "bg-kh-mist text-kh-green-deep",
  Sales: "bg-kh-yellow text-kh-ink",
  Admin: "bg-kh-coral text-kh-ink",
  Tech: "bg-kh-lime text-kh-ink",
};

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-kh-dark-line bg-kh-ink text-kh-white"><div className="mx-auto flex h-18 max-w-[1480px] items-center justify-between px-5 md:px-8"><Link to="/" aria-label="KGHQ home"><img src={logoLightAsset.url} alt="KGHQ" width={249} height={66} className="h-8 w-auto md:h-9" /></Link><nav className="hidden items-center gap-7 lg:flex" aria-label="Deliverables navigation"><Link to="/" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Home</Link><a href="#library" className="text-sm font-semibold text-kh-white">Library</a><Link to="/growth-reset" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Growth Reset</Link><Link to="/partners" className="text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Partners</Link></nav><Link to="/new-client" className="hidden min-h-11 items-center gap-2 bg-kh-lime px-5 font-display text-sm font-bold text-kh-ink md:inline-flex">Get Started <ArrowRight className="size-4" /></Link><Button type="button" variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="text-kh-white hover:bg-kh-white/10 hover:text-kh-white lg:hidden">{open ? <X /> : <Menu />}</Button></div>{open && <nav className="border-t border-kh-dark-line px-5 py-5 lg:hidden"><Link to="/" className="block border-b border-kh-dark-line py-3 font-semibold">Home</Link><a href="#library" onClick={() => setOpen(false)} className="block border-b border-kh-dark-line py-3 font-semibold">Library</a><Link to="/growth-reset" className="block border-b border-kh-dark-line py-3 font-semibold">Growth Reset</Link><Link to="/partners" className="block border-b border-kh-dark-line py-3 font-semibold">Partners</Link><Link to="/new-client" className="mt-5 inline-flex min-h-11 items-center bg-kh-lime px-5 font-bold text-kh-ink">Get Started</Link></nav>}</header>;
}

function Preview({ type, category }: { type: Deliverable["preview"]; category: Category }) {
  return <div className="relative h-28 overflow-hidden border-b border-kh-line bg-kh-mist p-3"><div className="absolute inset-x-0 top-0 h-2 bg-kh-ink" />{type === "site" && <div className="mt-2 grid h-20 grid-cols-[1.1fr_.9fr] gap-2 bg-kh-white p-2 shadow-sm"><div><div className="h-2 w-12 bg-kh-green" /><div className="mt-2 h-1.5 w-16 bg-kh-line"/><div className="mt-1 h-1.5 w-12 bg-kh-line"/><div className="mt-3 h-4 w-10 bg-kh-lime"/></div><div className="bg-kh-ink" /></div>}{type === "doc" && <div className="mx-auto mt-2 h-20 w-3/4 bg-kh-white p-3 shadow-sm"><div className="h-2 w-1/2 bg-kh-green"/><div className="mt-3 space-y-1.5">{[1,2,3,4].map(i => <div key={i} className="h-1 bg-kh-line" />)}</div></div>}{type === "social" && <div className="mt-3 flex justify-center gap-2">{["M","S","T"].map((x,i) => <div key={x} className={`grid size-14 place-items-center font-display text-lg font-extrabold ${i === 0 ? "bg-kh-green text-kh-white" : i === 1 ? "bg-kh-ink text-kh-white" : "bg-kh-yellow text-kh-ink"}`}>{x}</div>)}</div>}{type === "dashboard" && <div className="mt-2 h-20 bg-kh-white p-2 shadow-sm"><div className="grid grid-cols-3 gap-1.5">{[1,2,3].map(i => <div key={i} className={`h-5 ${i === 1 ? "bg-kh-lime" : "bg-kh-mist"}`} />)}</div><div className="mt-2 flex h-10 items-end gap-1">{[3,7,5,9,6,10,8].map((h,i) => <span key={i} className="flex-1 bg-kh-green" style={{height: `${h * 10}%`}} />)}</div></div>}{type === "flow" && <div className="mt-7 flex items-center justify-center gap-1.5">{[1,2,3,4].map((i) => <span key={i} className={`grid size-9 place-items-center text-xs font-bold ${i % 2 ? "bg-kh-ink text-kh-white" : "bg-kh-lime text-kh-ink"}`}>{i}</span>)}</div>}{type === "email" && <div className="mx-auto mt-3 h-16 w-4/5 bg-kh-white p-2 shadow-sm"><div className="flex items-center gap-2"><span className={`size-5 ${categoryStyles[category]}`} /><span className="h-2 w-24 bg-kh-line" /></div><div className="mt-3 h-1.5 w-full bg-kh-line"/><div className="mt-1.5 h-1.5 w-2/3 bg-kh-line"/></div>}</div>;
}

function DeliverableCard({ item, selected, onToggle }: { item: Deliverable; selected: boolean; onToggle: () => void }) {
  const Icon = item.icon;
  return <article className={`group flex min-h-[330px] flex-col overflow-hidden border bg-kh-white shadow-kh transition-all hover:-translate-y-1 ${selected ? "border-kh-green ring-2 ring-kh-green/20" : "border-kh-line"}`}><div className="relative"><Preview type={item.preview} category={item.category} />{item.badge && <span className="absolute right-2 top-3 bg-kh-green px-2 py-1 text-[10px] font-extrabold uppercase text-kh-white">{item.badge}</span>}</div><div className="flex flex-1 flex-col p-4"><div className="flex items-start gap-2.5"><span className={`grid size-8 shrink-0 place-items-center ${categoryStyles[item.category]}`}><Icon className="size-4" /></span><h3 className="pt-1 font-display text-sm font-extrabold leading-tight">{item.title}</h3></div><p className="mt-3 flex-1 text-xs leading-relaxed text-kh-muted">{item.description}</p><div className="mt-4 flex items-center justify-between border-t border-kh-line pt-3"><span className="flex items-center gap-1.5 font-display text-xs font-extrabold text-kh-green-deep"><Database className="size-4" />{item.tokens} Tokens</span><Button type="button" variant="ghost" size="sm" onClick={onToggle} aria-label={`${selected ? "Remove" : "Add"} ${item.title} ${selected ? "from" : "to"} plan`} className={`rounded-none px-2 text-xs font-bold ${selected ? "bg-kh-green text-kh-white hover:bg-kh-green-deep hover:text-kh-white" : "text-kh-green-deep hover:bg-kh-mist"}`}>{selected ? <><Check className="size-3.5" /> Added</> : "+ Add"}</Button></div></div></article>;
}

function Assistant({ onRecommend }: { onRecommend: (goal: string) => void }) {
  const prompts = ["I want to generate more leads.", "Help me improve my website.", "I need to streamline operations.", "What should I focus on this month?"];
  const [goal, setGoal] = useState("");
  return <section className="bg-kh-ink p-5 text-kh-white shadow-kh"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center bg-kh-green text-kh-white"><Bot className="size-6" /></span><div><h2 className="font-display text-xl font-extrabold">BizAI <Sparkles className="inline size-4 text-kh-lime" /></h2><p className="text-xs text-kh-dark-muted">Your KGHQ growth assistant</p></div></div><h3 className="mt-6 font-display text-lg font-extrabold">Not sure what to choose?</h3><p className="mt-1 text-sm leading-relaxed text-kh-dark-muted">Tell BizAI your goal and we’ll recommend the right deliverables.</p><div className="mt-5 space-y-2">{prompts.map(prompt => <Button key={prompt} type="button" variant="outline" onClick={() => { setGoal(prompt); onRecommend(prompt); }} className="h-auto w-full justify-start rounded-none border-kh-dark-line bg-kh-white/5 px-3 py-2.5 text-left text-xs text-kh-paper hover:bg-kh-white/10 hover:text-kh-white">“{prompt}”</Button>)}</div><form className="mt-4 flex border-2 border-kh-lime bg-kh-white" onSubmit={(event) => { event.preventDefault(); onRecommend(goal); }}><label className="sr-only" htmlFor="goal">Your goal</label><input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Type your goal here..." className="min-w-0 flex-1 bg-transparent px-3 text-xs text-kh-ink outline-none"/><Button type="submit" size="icon" className="rounded-none bg-kh-green text-kh-white hover:bg-kh-green-deep" aria-label="Recommend deliverables"><ArrowRight className="size-4" /></Button></form><p className="mt-4 flex items-center justify-between text-[10px] text-kh-dark-muted"><span>Powered by KGHQ</span><span>Real advice. Real execution.</span></p></section>;
}

function Library() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("popular");
  const [selected, setSelected] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState("");
  const filters = ["All", "Marketing", "Sales", "Admin", "Tech", "Popular", "Quick Wins", "Best Value"];
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const result = deliverables.filter(item => {
      const matchesSearch = `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || item.category === filter || (filter === "Popular" && item.badge === "Popular") || (filter === "Quick Wins" && item.badge === "Quick Win") || (filter === "Best Value" && item.badge === "Best Value");
      return matchesSearch && matchesFilter;
    });
    return [...result].sort((a, b) => sort === "tokens-low" ? a.tokens - b.tokens : sort === "tokens-high" ? b.tokens - a.tokens : Number(Boolean(b.badge)) - Number(Boolean(a.badge)));
  }, [filter, query, sort]);
  const selectedItems = deliverables.filter(item => selected.includes(item.title));
  const used = selectedItems.reduce((sum, item) => sum + item.tokens, 0);
  const recommend = (goal: string) => {
    const text = goal.toLowerCase();
    const titles = text.includes("website") ? ["Landing Page", "Website Update", "SEO Article"] : text.includes("operation") ? ["SOP Document", "Automation Workflow", "Inbox Cleanup"] : text.includes("lead") ? ["Landing Page", "Lead Magnet", "Prospect List Build"] : ["Google Business Profile", "Outbound Email Sequence", "Analytics Dashboard"];
    setSelected(titles); setRecommendation(`We built a focused ${titles.length}-deliverable starting plan for that goal.`);
  };
  return <section id="library" className="bg-kh-paper px-4 py-8 text-kh-ink md:px-6"><div className="mx-auto max-w-[1480px]"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="flex items-baseline gap-3"><h2 className="font-display text-3xl font-extrabold">{filtered.length} Deliverables</h2><span className="hidden text-xs text-kh-muted sm:block">High-quality work. Real results. Available through flexible tokens.</span></div>{recommendation && <p className="mt-2 text-sm font-bold text-kh-green-deep">{recommendation}</p>}</div><label className="flex items-center gap-2 text-xs font-bold">Sort by:<span className="relative"><select value={sort} onChange={event => setSort(event.target.value)} className="min-h-10 appearance-none border border-kh-line bg-kh-white py-2 pl-3 pr-9 text-xs outline-none focus:border-kh-green"><option value="popular">Most Popular</option><option value="tokens-low">Tokens: Low to High</option><option value="tokens-high">Tokens: High to Low</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-3 size-4" /></span></label></div><div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"><div className="col-span-full"><div className="relative"><Search className="absolute left-4 top-3.5 size-5 text-kh-muted"/><input value={query} onChange={event => setQuery(event.target.value)} className="min-h-12 w-full border border-kh-line bg-kh-white pl-12 pr-4 text-sm outline-none focus:border-kh-green" placeholder="Search deliverables (e.g. landing page, email, CRM)..." aria-label="Search deliverables" /></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map(item => <Button key={item} type="button" variant="outline" size="sm" onClick={() => setFilter(item)} className={`shrink-0 rounded-none px-4 text-xs ${filter === item ? "border-kh-green bg-kh-green text-kh-white hover:bg-kh-green-deep hover:text-kh-white" : "border-kh-line bg-kh-white text-kh-ink hover:bg-kh-mist"}`}>{item === "Popular" && <Star className="size-3.5"/>}{item === "Quick Wins" && <Zap className="size-3.5"/>}{item}</Button>)}</div></div>{filtered.map(item => <DeliverableCard key={item.title} item={item} selected={selected.includes(item.title)} onToggle={() => setSelected(current => current.includes(item.title) ? current.filter(title => title !== item.title) : [...current, item.title])} />)}{filtered.length === 0 && <div className="col-span-full border border-kh-line bg-kh-white p-12 text-center"><Search className="mx-auto size-8 text-kh-green"/><h3 className="mt-4 font-display text-xl font-bold">No deliverables found</h3><p className="mt-2 text-sm text-kh-muted">Try a broader search or another category.</p></div>}</div><aside className="space-y-4 xl:sticky xl:top-24"><Assistant onRecommend={recommend} /><section className="border border-kh-line bg-kh-white p-5 shadow-kh"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-kh-mist text-kh-green-deep"><Database className="size-5" /></span><h2 className="font-display text-base font-extrabold">Your Token Plan</h2></div><div className="mt-5 flex items-center justify-between text-sm"><strong>{Math.max(0, 25 - used)} tokens remaining</strong><span className="text-kh-muted">{used} used</span></div><div className="mt-3 h-2 overflow-hidden bg-kh-mist"><div className="h-full bg-kh-green transition-all" style={{width: `${Math.min(100, used / 25 * 100)}%`}} /></div><div className="mt-5 space-y-2">{selectedItems.length ? selectedItems.map(item => <div key={item.title} className="flex items-center justify-between border-t border-kh-line pt-2 text-xs"><span className="font-semibold">{item.title}</span><Button type="button" variant="ghost" size="icon" onClick={() => setSelected(current => current.filter(title => title !== item.title))} className="size-7 rounded-none text-kh-muted" aria-label={`Remove ${item.title}`}><X className="size-3.5" /></Button></div>) : <p className="text-xs leading-relaxed text-kh-muted">Add deliverables to start building your plan.</p>}</div><Link to="/new-client" className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold text-kh-green-deep">Build Your Plan <ArrowRight className="size-4" /></Link></section><section className="bg-kh-mist p-5"><Zap className="size-7 text-kh-green-deep"/><h2 className="mt-4 font-display text-lg font-extrabold">Use your tokens your way.</h2><p className="mt-1 text-sm font-semibold text-kh-green-deep">Mix and match deliverables every month.</p><ul className="mt-5 space-y-2 text-xs text-kh-muted">{["No long-term contracts", "Choose what you need, when you need it", "Expert support across all categories", "Real progress, every month"].map(item => <li key={item} className="flex gap-2"><Check className="size-4 shrink-0 text-kh-green" />{item}</li>)}</ul></section></aside></div></div></section>;
}

function Hero() {
  const [query, setQuery] = useState("");
  return <section className="relative overflow-hidden bg-kh-ink px-5 py-14 text-kh-white md:px-8 md:py-20"><div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--kh-dark-line)_1px,transparent_1px),linear-gradient(90deg,var(--kh-dark-line)_1px,transparent_1px)] [background-size:48px_48px]"/><div className="relative mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Deliverables Library</p><h1 className="mt-4 max-w-5xl font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl md:text-7xl">Explore the <span className="text-kh-lime">work that gets growth moving.</span></h1><p className="mt-5 max-w-3xl text-lg text-kh-dark-muted">Browse practical, high-quality deliverables across marketing, sales, administration, and technology.</p><form className="relative mt-8 max-w-4xl" onSubmit={event => { event.preventDefault(); document.querySelector<HTMLInputElement>('#library input[aria-label="Search deliverables"]')?.focus(); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}><Search className="absolute left-4 top-3.5 size-5 text-kh-muted"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="What do you need to get done?" className="min-h-12 w-full bg-kh-white pl-12 pr-28 text-sm text-kh-ink outline-none"/><Button type="submit" className="absolute right-1.5 top-1.5 rounded-none bg-kh-green text-kh-white hover:bg-kh-green-deep">Explore</Button></form></div><div className="border-l-4 border-kh-lime pl-6"><p className="font-display text-2xl font-extrabold italic">Choose what gets done.</p><div className="mt-5 flex items-center gap-3 text-sm text-kh-dark-muted"><CircleDollarSign className="size-5 text-kh-lime"/>Flexible tokens. Managed execution.</div></div></div></section>;
}

function FinalCta() {
  return <section className="bg-kh-ink px-5 py-14 text-kh-white md:px-8"><div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Ready to make progress?</p><h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">Don’t know where to start? We’ll build your plan.</h2><p className="mt-3 text-kh-dark-muted">Tell us your goals and we’ll recommend the best mix of deliverables for your business.</p></div><Link to="/new-client" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-kh-lime px-7 font-display text-sm font-bold text-kh-ink">Build My Plan <ArrowRight className="size-4" /></Link></div></section>;
}

function DeliverablesPage() {
  return <main className="min-h-screen bg-kh-paper font-body text-kh-ink antialiased"><Header /><Hero /><Library /><FinalCta /></main>;
}