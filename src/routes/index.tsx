import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Bot, BriefcaseBusiness, Building2, Check, ChevronRight,
  CircleGauge, Compass, FileSearch, Globe2, Layers3, Lightbulb, Menu,
  MessageSquareText, Network, Play, Search, Settings2, Sparkles, Target,
  TrendingUp, Users, WandSparkles, Workflow, Wrench, X,
} from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/kghq-home-hero.jpg";
import teamImg from "@/assets/kghq-team-work.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "KGHQ — The Execution Engine for Small Business" },
      { name: "description", content: "KGHQ combines strategy, AI, technology, and human execution to help growing businesses know what to do next — then get it done." },
      { property: "og:title", content: "KGHQ — Know What to Do Next. Then Get It Done." },
      { property: "og:description", content: "Flexible strategy, specialists, technology, and execution for growing businesses." },
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

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" aria-label="KGHQ home" className="group inline-flex items-center gap-2.5">
      <span className="grid size-9 grid-cols-2 gap-0.5 bg-kh-lime p-2 text-kh-ink transition-transform group-hover:-rotate-3" aria-hidden="true">
        <span className="border-b-2 border-r-2 border-current" /><span className="border-b-2 border-current" />
        <span className="border-r-2 border-current" /><span />
      </span>
      <span className={cx("font-display text-xl font-extrabold tracking-normal", light ? "text-kh-white" : "text-kh-ink")}>KGHQ</span>
    </Link>
  );
}

function PrimaryCTA({ label = "Get Something Done", light = false }: { label?: string; light?: boolean }) {
  return <Link to="/new-client" className={cx("inline-flex min-h-12 items-center gap-2 px-6 py-3 font-display text-sm font-bold transition-transform hover:-translate-y-0.5", light ? "bg-kh-lime text-kh-ink" : "bg-kh-ink text-kh-white")}>{label}<ArrowRight className="size-4" /></Link>;
}

function Section({ children, id, dark = false, className = "" }: { children: React.ReactNode; id?: string; dark?: boolean; className?: string }) {
  return <section id={id} className={cx("px-5 py-20 md:px-8 md:py-28", dark ? "bg-kh-ink text-kh-white" : "bg-kh-paper text-kh-ink", className)}><div className="mx-auto max-w-7xl">{children}</div></section>;
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={cx("flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.18em]", dark ? "text-kh-lime" : "text-kh-green-deep")}><span className={cx("h-0.5 w-8", dark ? "bg-kh-lime" : "bg-kh-green")} />{children}</div>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [["Services", "#services"], ["Programs", "#programs"], ["Tools", "#tools"], ["How It Works", "#how-it-works"], ["Resources", "#resources"]];
  return (
    <header className="sticky top-0 z-50 border-b border-kh-dark-line bg-kh-ink">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo light />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={label} href={href} className="font-display text-sm font-semibold text-kh-dark-muted transition-colors hover:text-kh-lime">{label}</a>)}
        </nav>
        <div className="hidden md:block"><PrimaryCTA light /></div>
        <button type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="grid size-11 place-items-center text-kh-white lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="border-t border-kh-dark-line bg-kh-ink px-5 py-5 lg:hidden">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="block border-b border-kh-dark-line py-3 font-display font-semibold text-kh-white">{label}</a>)}<div className="mt-5"><PrimaryCTA light /></div></nav>}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-kh-ink text-kh-white md:min-h-[820px]">
      <img src={heroImg} alt="A small business team planning and executing work together" width={1920} height={1088} className="absolute inset-0 size-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-kh-ink via-kh-ink/95 to-kh-ink/15" />
      <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 py-20 md:min-h-[820px] md:px-8">
        <div className="max-w-3xl">
          <Kicker dark>The execution engine for small businesses &amp; entrepreneurs</Kicker>
          <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.02] tracking-normal sm:text-6xl md:text-7xl lg:text-8xl">Know what to do next.<br /><span className="text-kh-lime">Then get it done.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-kh-paper md:text-xl">KGHQ combines strategy, AI, technology, and on-demand human execution to turn ideas, priorities, and plans into work that actually gets finished.</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-kh-dark-muted md:text-lg">From websites and lead generation to automation, operations, content, sales, and growth strategy — get the help you need without building an entire team.</p>
          <div className="mt-9 flex flex-wrap gap-3"><PrimaryCTA light /><a href="#execution-engine" className="inline-flex min-h-12 items-center gap-2 border border-kh-dark-line px-6 py-3 font-display text-sm font-bold text-kh-white transition-colors hover:bg-kh-white/10"><Play className="size-4" />See How KGHQ Works</a></div>
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-kh-dark-line pt-6 text-sm font-semibold text-kh-dark-muted"><span>AI-assisted.</span><span>Human-executed.</span><span>Built for growing businesses.</span></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-kh-dark-line bg-kh-ink/80 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 font-display text-xs font-bold uppercase tracking-[0.16em] text-kh-lime md:px-8 md:text-sm"><span>Strategy</span><ChevronRight /><span>Priorities</span><ChevronRight /><span>Execution</span><ChevronRight /><span>Momentum</span></div></div>
    </section>
  );
}

const taskList = ["Follow up with those leads.", "Fix the website.", "Launch the campaign.", "Create the content.", "Build the automation.", "Clean up the CRM.", "Find new customers.", "Update the proposal."];

function Problem() {
  return <Section><div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24"><div><Kicker>The problem</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-normal md:text-6xl">Your business probably doesn't need more ideas.<br /><span className="text-kh-green-deep">It needs more execution.</span></h2><p className="mt-6 text-lg leading-relaxed text-kh-muted">Traditional agencies want big retainers. Freelancers need managing. Hiring adds overhead. AI can give you a hundred ideas in seconds — but somebody still has to turn those ideas into results.</p><p className="mt-7 text-xl font-bold">That's where KGHQ comes in.</p><p className="mt-2 text-kh-muted">We help you figure out what matters, organize the work, and get it done.</p><div className="mt-8"><PrimaryCTA label="Start With Your Biggest Priority" /></div></div><div className="grid gap-px bg-kh-line sm:grid-cols-2">{taskList.map((task, i) => <div key={task} className="flex min-h-28 items-center gap-4 bg-kh-white p-5"><span className="font-display text-2xl font-extrabold text-kh-green">{String(i + 1).padStart(2, "0")}</span><span className="font-display font-bold">{task}</span></div>)}</div></div></Section>;
}

const engine = [
  ["01", "Tell us the goal", "More leads? Better systems? A new website? A launch? Start with what you want to accomplish."],
  ["02", "Find the next move", "We identify the priorities most likely to move the business forward. Clear priorities. Clear actions."],
  ["03", "Put it into motion", "AI, technology, specialists, contractors, and your team come together to execute the work."],
  ["04", "Keep moving", "See what's happening, what's finished, what needs attention, and what should happen next."],
];

function Engine() {
  return <Section id="execution-engine" dark><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div className="lg:sticky lg:top-28 lg:self-start"><Kicker dark>Meet the KGHQ Execution Engine</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-normal md:text-6xl">From “we should do that” to <span className="text-kh-lime">“it's done.”</span></h2><p className="mt-6 text-lg leading-relaxed text-kh-dark-muted">The KGHQ Execution Engine connects the strategy, people, AI, systems, and tools behind your business so work keeps moving.</p></div><div className="border-t border-kh-dark-line">{engine.map(([n, title, body]) => <article key={n} className="grid gap-4 border-b border-kh-dark-line py-8 sm:grid-cols-[80px_1fr]"><span className="font-display text-4xl font-extrabold text-kh-lime">{n}</span><div><h3 className="font-display text-2xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-kh-dark-muted">{body}</p></div></article>)}</div></div></Section>;
}

const experts = ["A designer today", "A sales development rep tomorrow", "An automation specialist next week", "A strategist when things feel stuck", "A researcher before an important meeting", "An SEO specialist when traffic drops"];

function Capacity() {
  return <Section className="bg-kh-mist"><div className="grid items-center gap-14 lg:grid-cols-2"><div><Kicker>Flexible capacity</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">More clarity.<br />More capacity.<br /><span className="text-kh-green-deep">More done.</span></h2><p className="mt-6 max-w-xl text-lg leading-relaxed text-kh-muted">Growing businesses often don't need another full-time employee. They need access to the <strong className="text-kh-ink">right capability at the right moment.</strong></p></div><div className="bg-kh-white p-5 shadow-kh md:p-8"><div className="space-y-2">{experts.map((expert, i) => <div key={expert} className="flex items-center gap-4 border-b border-kh-line py-4 last:border-0"><span className={cx("grid size-9 shrink-0 place-items-center font-display text-xs font-extrabold text-kh-ink", i % 3 === 0 ? "bg-kh-lime" : i % 3 === 1 ? "bg-kh-yellow" : "bg-kh-coral")}>{i + 1}</span><span className="font-display text-lg font-bold">{expert}</span></div>)}</div><p className="mt-6 border-l-4 border-kh-green pl-5 text-kh-muted">Scale support up or down. Keep your team focused. Move projects off the to-do list.</p></div></div></Section>;
}

const pillars = [
  { id: "services", icon: Wrench, tag: "Services", title: "Get It Done.", copy: "On-demand execution for the work behind your growth.", items: ["Websites & landing pages", "SEO & lead generation", "Outbound sales", "CRM & automation", "Content & design", "Research & operations"], link: "/bizsite" as const, cta: "Explore Services" },
  { id: "programs", icon: Users, tag: "Programs", title: "Build It Better.", copy: "Structured programs and advisory experiences that pair strategy with implementation.", items: ["Growth planning", "Sales development", "Growth workshops", "AI implementation", "Business systems", "Team training"], link: "/new-client" as const, cta: "Explore Programs" },
  { id: "tools", icon: CircleGauge, tag: "Tools", title: "Run It Smarter.", copy: "Practical technology that helps small businesses decide and execute faster.", items: ["Execution Engine", "BizPhone", "BizSite", "Growth assessments", "Buyer-intent intelligence", "Client dashboards"], link: "/bizphone" as const, cta: "Explore Tools" },
];

function Pillars() {
  return <Section><div className="max-w-3xl"><Kicker>Three ways to plug into KGHQ</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">One growth partner.<br /><span className="text-kh-green-deep">Multiple ways forward.</span></h2><p className="mt-6 text-lg leading-relaxed text-kh-muted">Whether you need execution, a structured program, or technology that helps you operate smarter, KGHQ meets you where you are.</p></div><div className="mt-14 grid gap-5 lg:grid-cols-3">{pillars.map(({ id, icon: Icon, tag, title, copy, items, link, cta }, i) => <article id={id} key={id} className={cx("flex flex-col border-t-8 p-7 shadow-kh", i === 0 ? "border-kh-green bg-kh-white" : i === 1 ? "border-kh-yellow bg-kh-white" : "border-kh-coral bg-kh-white")}><div className="flex items-center justify-between"><Icon className="size-8" /><span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-muted">{tag}</span></div><h3 className="mt-8 font-display text-3xl font-extrabold">{title}</h3><p className="mt-3 leading-relaxed text-kh-muted">{copy}</p><ul className="mt-7 flex-1 space-y-3">{items.map(item => <li key={item} className="flex gap-2.5 text-sm font-semibold"><Check className="mt-0.5 size-4 shrink-0 text-kh-green" />{item}</li>)}</ul><Link to={link} className="mt-8 inline-flex items-center gap-2 border-t border-kh-line pt-5 font-display text-sm font-bold">{cta}<ArrowRight className="size-4" /></Link></article>)}</div></Section>;
}

function HumanAI() {
  const ai = ["Research", "Analyze", "Recommend", "Automate", "Prioritize", "Accelerate"];
  const people = ["Build", "Create", "Sell", "Manage", "Communicate", "Execute"];
  return <Section dark><div className="grid gap-12 lg:grid-cols-2"><div><Kicker dark>AI-assisted. Human-executed.</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">AI can tell you what to do.<br /><span className="text-kh-lime">KGHQ helps make sure it happens.</span></h2><p className="mt-6 text-lg leading-relaxed text-kh-dark-muted">KGHQ combines the speed and intelligence of AI with the creativity, judgment, and execution of real people.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="border border-kh-dark-line bg-kh-white/5 p-6"><Bot className="size-8 text-kh-lime" /><h3 className="mt-5 font-display text-xl font-bold">AI helps us</h3><ul className="mt-5 space-y-3 text-kh-dark-muted">{ai.map(x => <li key={x} className="flex gap-2"><Sparkles className="size-4 text-kh-lime" />{x}</li>)}</ul></div><div className="border border-kh-dark-line bg-kh-white/5 p-6"><Users className="size-8 text-kh-yellow" /><h3 className="mt-5 font-display text-xl font-bold">People help us</h3><ul className="mt-5 space-y-3 text-kh-dark-muted">{people.map(x => <li key={x} className="flex gap-2"><Check className="size-4 text-kh-yellow" />{x}</li>)}</ul></div></div></div></Section>;
}

const useCases = [
  [Target, "I need more leads.", "Build prospect lists, identify buyer intent, launch outbound, and turn signals into conversations.", "Lead Generation"],
  [TrendingUp, "I need more customers.", "Strengthen your sales process, improve conversion, and create better paths from interest to revenue.", "Sales Growth"],
  [Globe2, "I need a better website.", "Create a professional website designed to communicate clearly, convert visitors, and support growth.", "Websites"],
  [Workflow, "I need better systems.", "Connect tools, automate repetitive work, improve your CRM, and reduce operational chaos.", "Automation"],
  [MessageSquareText, "I need better marketing.", "Build content, improve SEO, strengthen messaging, and consistently show up.", "Marketing"],
  [Compass, "I'm not sure what I need.", "We'll find the bottlenecks and help determine what deserves attention first.", "Find My Next Move"],
] as const;

function UseCases() {
  return <Section><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><Kicker>What do you need to get done?</Kicker><h2 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-normal md:text-6xl">Start with the problem.<br /><span className="text-kh-green-deep">We'll help with the path.</span></h2></div><PrimaryCTA /></div><div className="mt-14 grid gap-px bg-kh-line md:grid-cols-2 lg:grid-cols-3">{useCases.map(([Icon, title, body, action]) => <article key={title} className="group bg-kh-white p-7 transition-colors hover:bg-kh-mist"><Icon className="size-7 text-kh-green-deep" /><h3 className="mt-8 font-display text-xl font-bold">{title}</h3><p className="mt-3 min-h-24 text-sm leading-relaxed text-kh-muted">{body}</p><Link to={action === "Websites" ? "/bizsite" : "/new-client"} className="mt-5 inline-flex items-center gap-1 font-display text-sm font-bold text-kh-green-deep">Explore {action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></article>)}</div></Section>;
}

const levels = [["Rooftop", "Expansion, opportunity, and long-term value."], ["Penthouse", "Scale, leadership, and leverage."], ["Upper levels", "Repeatable growth."], ["Mezzanine", "Systems, process, technology, and operations."], ["Lobby", "Go-to-market and customer acquisition."], ["Ground level", "Offer, positioning, and market fit."], ["Foundation", "The fundamentals that hold everything up."]];

function Skyscraper() {
  return <Section className="bg-kh-mist"><div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]"><div><Kicker>Growth is built one level at a time</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">How strong is the business <span className="text-kh-green-deep">you're building?</span></h2><p className="mt-6 text-lg leading-relaxed text-kh-muted">Most businesses don't struggle because of one missing tactic. They're trying to build the penthouse before fixing the foundation.</p><p className="mt-4 text-kh-muted">The KGHQ Growth Skyscraper shows where your business stands, what needs attention, and what must be true before the next level.</p><div className="mt-8"><PrimaryCTA label="Find My Growth Level" /></div></div><div className="flex flex-col items-center justify-end gap-1">{levels.map(([name, copy], i) => <div key={name} className={cx("group flex min-h-14 items-center justify-between gap-4 border border-kh-line bg-kh-white px-5 shadow-kh", i === 0 ? "w-[58%] bg-kh-lime" : i === 1 ? "w-[66%]" : i === 2 ? "w-[73%]" : i === 3 ? "w-[80%]" : i === 4 ? "w-[87%]" : i === 5 ? "w-[94%]" : "w-full bg-kh-ink text-kh-white")}><span className="font-display text-xs font-extrabold uppercase tracking-[0.12em]">{name}</span><span className={cx("hidden text-right text-xs sm:block", i === 6 ? "text-kh-dark-muted" : "text-kh-muted")}>{copy}</span></div>)}</div></div></Section>;
}

const process = [["01", "Tell us what you need.", "Submit a request, book a growth session, or start with an assessment."], ["02", "We figure out the best path.", "A service, specialist, program, automation, AI workflow — or a combination."], ["03", "Work gets assigned and executed.", "See what is happening, who owns it, and where things stand."], ["04", "We identify what's next.", "As work gets completed, the Engine surfaces the next priorities."]];

function HowItWorks() {
  return <Section id="how-it-works"><div className="text-center"><Kicker>Simple to start. Built to grow with you.</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Start with one problem.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-kh-muted">You don't need to overhaul your entire business on day one. Start with the thing slowing you down right now.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{process.map(([n, title, body]) => <article key={n} className="border border-kh-line bg-kh-white p-6"><span className="font-display text-5xl font-extrabold text-kh-green">{n}</span><h3 className="mt-7 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-kh-muted">{body}</p></article>)}</div></Section>;
}

const comparisons = [["Traditional agency", "Big retainer. Fixed scope. Limited flexibility."], ["Freelancer marketplace", "Lots of options. You find the person. You manage the work."], ["AI software", "Fast answers. Powerful technology. You still have to execute."], ["KGHQ", "Strategy + execution. AI + people. Flexible, managed support."]];

function Difference() {
  return <Section dark><div className="max-w-4xl"><Kicker dark>Why KGHQ?</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Not another agency.<br />Not another marketplace.<br /><span className="text-kh-lime">Not another AI app.</span></h2></div><div className="mt-14 grid gap-px bg-kh-dark-line lg:grid-cols-4">{comparisons.map(([title, body], i) => <article key={title} className={cx("p-6", i === 3 ? "bg-kh-lime text-kh-ink" : "bg-kh-ink-soft")}><h3 className="font-display text-lg font-bold">{title}</h3><p className={cx("mt-4 text-sm leading-relaxed", i === 3 ? "text-kh-ink" : "text-kh-dark-muted")}>{body}</p></article>)}</div><p className="mt-10 max-w-4xl font-display text-2xl font-bold">We don't just connect you with people. We build the system around getting the work done.</p></Section>;
}

function OnDemand() {
  return <Section><div className="grid items-center gap-12 lg:grid-cols-2"><div className="relative overflow-hidden shadow-kh"><img src={teamImg} alt="Entrepreneurs collaborating on business work in a creative studio" loading="lazy" width={1600} height={1008} className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-0 left-0 bg-kh-lime px-5 py-4 font-display text-sm font-extrabold text-kh-ink">BUILT FOR HOW SMALL BUSINESSES ACTUALLY WORK.</div></div><div><Kicker>On-demand execution</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Get the help you need without building a bigger team.</h2><p className="mt-6 text-lg leading-relaxed text-kh-muted">One month you need sales support. The next month, a website. Then automation. Then SEO. Then help launching something completely new.</p><p className="mt-5 text-2xl font-bold">That's normal. KGHQ is designed around it.</p><p className="mt-4 text-kh-muted">Use what you need. Add capabilities as the business grows. Keep execution moving without constantly rebuilding your team.</p><div className="mt-8"><PrimaryCTA label="See What KGHQ Can Do" /></div></div></div></Section>;
}

function Dashboard() {
  const items = ["Current priorities", "Active projects", "Completed work", "Requests", "Growth recommendations", "Business signals", "Upcoming actions", "Your KGHQ team"];
  return <Section className="bg-kh-mist"><div className="text-center"><Kicker>One place to see what's moving</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Your business shouldn't live in <span className="text-kh-green-deep">37 open tabs.</span></h2></div><div className="mx-auto mt-14 max-w-5xl overflow-hidden border border-kh-line bg-kh-white shadow-kh"><div className="flex items-center justify-between border-b border-kh-line bg-kh-ink px-5 py-4 text-kh-white"><Logo light /><span className="text-xs text-kh-dark-muted">Execution overview</span></div><div className="grid gap-px bg-kh-line sm:grid-cols-2 lg:grid-cols-4">{items.map((item, i) => <div key={item} className="bg-kh-white p-5"><span className="font-display text-3xl font-extrabold text-kh-green">{i + 2}</span><p className="mt-4 text-sm font-bold">{item}</p></div>)}</div><div className="flex flex-col items-start justify-between gap-4 border-t border-kh-line p-5 sm:flex-row sm:items-center"><span className="font-display font-bold">And when something new comes up?</span><PrimaryCTA label="+ Get Something Done" /></div></div></Section>;
}

function Outcomes() {
  const outcomes = ["More opportunities", "More customers", "Better systems", "Faster execution", "Stronger online presence", "Less founder bottleneck", "Less operational chaos"];
  return <Section id="resources"><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"><div><Kicker>The goal isn't more activity</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">It's more progress.</h2><p className="mt-5 text-lg text-kh-muted">KGHQ is built around outcomes that matter to growing businesses.</p></div><div className="grid gap-px bg-kh-line sm:grid-cols-2">{outcomes.map((outcome, i) => <div key={outcome} className="flex items-center gap-3 bg-kh-white p-5"><Check className={cx("size-5", i % 2 ? "text-kh-green" : "text-kh-coral")} /><span className="font-display font-bold">{outcome}</span></div>)}<div className="flex items-center bg-kh-ink p-5 font-display font-bold text-kh-lime sm:col-span-2">More time building the business instead of chasing unfinished tasks.</div></div></div></Section>;
}

function Founder() {
  return <Section className="bg-kh-yellow"><div className="mx-auto max-w-5xl text-center"><Kicker>Built by entrepreneurs, for entrepreneurs</Kicker><h2 className="mt-6 font-display text-4xl font-extrabold tracking-normal md:text-6xl">We know what the list feels like.</h2><p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed">Entrepreneurs rarely lack ambition. They lack time, capacity, systems, and enough people to execute every opportunity in front of them. KGHQ exists to close that gap.</p><p className="mx-auto mt-6 max-w-3xl font-display text-2xl font-bold">Small businesses deserve the strategy, technology, expertise, and execution capabilities of a much larger company — without the overhead of one.</p></div></Section>;
}

function FinalCTA() {
  return <Section dark><div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]"><div><Kicker dark>Something has been sitting on your list long enough</Kicker><h2 className="mt-6 max-w-4xl font-display text-5xl font-extrabold tracking-normal md:text-7xl">Let's get it <span className="text-kh-lime">moving.</span></h2><p className="mt-6 max-w-2xl text-lg text-kh-dark-muted">Tell us what you're trying to accomplish. We'll help you figure out the next move — and turn it into action.</p></div><div className="flex flex-col gap-3"><PrimaryCTA light /><Link to="/new-client" className="inline-flex min-h-12 items-center justify-center border border-kh-dark-line px-6 py-3 font-display text-sm font-bold text-kh-white">Book a Growth Planning Session</Link></div></div><div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-kh-dark-line pt-6 text-sm text-kh-dark-muted">{["No giant team required.", "No endless strategy deck.", "No need to figure everything out first."].map(x => <span key={x} className="flex items-center gap-2"><Check className="size-4 text-kh-lime" />{x}</span>)}</div></Section>;
}

function Footer() {
  const groups = [{ title: "Services", items: ["Websites", "SEO", "Lead Generation", "Sales Development", "Automation", "Marketing"] }, { title: "Programs", items: ["Growth Planning", "Workshops", "Growth Evaluation", "AI Programs"] }, { title: "Tools", items: ["Execution Engine", "BizPhone", "BizSite", "Growth Assessment"] }, { title: "Company", items: ["About", "Resources", "Podcast", "Contact", "Careers"] }];
  return <footer className="border-t border-kh-dark-line bg-kh-ink px-5 py-16 text-kh-white md:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]"><div><Logo light /><p className="mt-5 max-w-xs text-sm leading-relaxed text-kh-dark-muted">The Execution Engine for Small Businesses &amp; Entrepreneurs.</p><div className="mt-8 flex gap-3"><Link to="/bizphone" className="border border-kh-dark-line px-4 py-2 text-sm font-bold">BizPhone</Link><Link to="/bizsite" className="border border-kh-dark-line px-4 py-2 text-sm font-bold">BizSite</Link></div></div><div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{groups.map(group => <div key={group.title}><h3 className="font-display text-sm font-bold text-kh-lime">{group.title}</h3><ul className="mt-4 space-y-2.5 text-sm text-kh-dark-muted">{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div></div><div className="mt-14 flex flex-col justify-between gap-4 border-t border-kh-dark-line pt-7 text-sm text-kh-dark-muted sm:flex-row"><span className="font-display font-bold text-kh-white">Know what to do next. Then get it done.</span><span>© {new Date().getFullYear()} KGHQ. AI-assisted. Human-executed.</span></div></div></footer>;
}

function Home() {
  return <main className="bg-kh-paper font-body text-kh-ink antialiased"><Nav /><Hero /><Problem /><Engine /><Capacity /><Pillars /><HumanAI /><UseCases /><Skyscraper /><HowItWorks /><Difference /><OnDemand /><Dashboard /><Outcomes /><Founder /><FinalCTA /><Footer /></main>;
}