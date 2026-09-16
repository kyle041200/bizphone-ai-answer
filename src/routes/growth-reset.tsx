import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, Menu,
  Play, RotateCcw, X,
} from "lucide-react";
import { useState } from "react";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";
import scaleScraperAsset from "@/assets/scale-scraper.png.asset.json";

export const Route = createFileRoute("/growth-reset")({
  component: GrowthResetPage,
  head: () => ({
    meta: [
      { title: "Growth Reset Workshop — KGHQ" },
      { name: "description", content: "A free 20-minute KGHQ workshop to identify the constraint slowing your business and choose one focused next move." },
      { property: "og:title", content: "Stop Adding Tactics — KGHQ Growth Reset" },
      { property: "og:description", content: "Find the floor your growth needs next with a practical, no-fluff workshop for business owners." },
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

const questions = [
  {
    floor: "Foundation · Clarity",
    question: "How clearly can a prospect understand who you help, what you solve, and why you’re different?",
    answers: [
      ["Not clear yet", "We describe it differently depending on the day."],
      ["Somewhat clear", "Customers get it after some explanation."],
      ["Mostly clear", "Our message usually lands with the right buyer."],
      ["Very clear", "It is specific, proven, and easy to repeat."],
    ],
  },
  {
    floor: "Ground · Validation",
    question: "How confident are you that your offer solves a problem people will pay to fix?",
    answers: [
      ["Still guessing", "We have not found consistent demand yet."],
      ["Some signals", "A few customers have validated the idea."],
      ["Proven offer", "Customers reliably buy and get value."],
      ["Strong demand", "The market is pulling the offer from us."],
    ],
  },
  {
    floor: "Lobby · Traction",
    question: "How reliably does your business create new conversations with the right buyers?",
    answers: [
      ["Unpredictable", "Most opportunities arrive by chance."],
      ["Occasional", "One or two channels work inconsistently."],
      ["Repeatable", "We know where qualified leads come from."],
      ["Reliable", "Our pipeline stays healthy and measurable."],
    ],
  },
  {
    floor: "Mezzanine · Repeatability",
    question: "How consistently can your team turn demand into a great customer experience?",
    answers: [
      ["Founder-led", "Most delivery still depends on one person."],
      ["Documenting", "The process exists mostly in our heads."],
      ["Consistent", "Core delivery follows a repeatable process."],
      ["Systematic", "Quality holds as volume and people change."],
    ],
  },
  {
    floor: "Upper Levels · Systems",
    question: "How well do your systems, data, and workflows support the way the business operates?",
    answers: [
      ["Scattered", "Tools and information live everywhere."],
      ["Connected partly", "Some workflows work, others are manual."],
      ["Working well", "The team has reliable operating systems."],
      ["Built to scale", "Automation and data guide daily work."],
    ],
  },
  {
    floor: "Penthouse · Expansion",
    question: "How ready is the business to grow without adding more pressure to the owner?",
    answers: [
      ["Not ready", "Growth would create more strain right now."],
      ["Getting ready", "We are removing a few key bottlenecks."],
      ["Ready", "People and systems can support more demand."],
      ["Scaling", "Leadership and leverage drive expansion."],
    ],
  },
];

const chapters = [
  ["00:00", "The growth fog", "Separate activity from progress."],
  ["04:15", "Meet the ScaleScraper", "See the six floors of durable growth."],
  ["09:30", "Choose the bottleneck", "Diagnose before you prescribe."],
  ["15:10", "Your next 90 days", "Make the plan small enough to execute."],
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-kh-dark-line bg-kh-ink">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="KGHQ home"><img src={logoLightAsset.url} alt="KGHQ" width={249} height={66} className="h-8 w-auto md:h-9" /></Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Growth Reset navigation">
          <a href="#workshop" className="font-display text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Workshop</a>
          <a href="#growth-check" className="font-display text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Growth Check</a>
          <a href="#planning-session" className="font-display text-sm font-semibold text-kh-dark-muted hover:text-kh-lime">Planning Session</a>
        </nav>
        <a href="#workshop" className="hidden min-h-11 items-center gap-2 bg-kh-lime px-5 font-display text-sm font-bold text-kh-ink md:inline-flex">Watch the Workshop <Play className="size-4 fill-current" /></a>
        <button type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(value => !value)} className="grid size-11 place-items-center text-kh-white lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="border-t border-kh-dark-line bg-kh-ink px-5 py-5 lg:hidden">{[["Workshop", "#workshop"], ["Growth Check", "#growth-check"], ["Planning Session", "#planning-session"]].map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="block border-b border-kh-dark-line py-3 font-display font-semibold text-kh-white">{label}</a>)}</nav>}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-kh-ink px-5 pb-16 pt-16 text-kh-white md:px-8 md:pb-24 md:pt-20">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--kh-dark-line)_1px,transparent_1px),linear-gradient(90deg,var(--kh-dark-line)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-dark-muted"><span className="size-2 rounded-full bg-kh-lime shadow-[0_0_16px_var(--kh-green)]" />Free 20-minute workshop for business owners</div>
          <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">Stop adding tactics.<br /><span className="text-kh-lime">Find the floor</span> your growth needs next.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-kh-dark-muted">The KGHQ Growth Reset is a practical, no-fluff workshop for identifying the constraint slowing your business down—and choosing one focused move to make next.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5"><a href="#workshop" className="inline-flex min-h-12 items-center gap-3 bg-kh-lime px-6 font-display text-sm font-bold text-kh-ink">Start the workshop <Play className="size-4 fill-current" /></a><a href="#growth-check" className="inline-flex items-center gap-1 border-b border-kh-dark-muted py-1 font-display text-sm font-bold text-kh-white">Or take the 2-minute growth check <ArrowDown className="size-4" /></a></div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-full border border-kh-green/40" />
          <img src={scaleScraperAsset.url} alt="The KGHQ ScaleScraper showing six floors of business growth" width={768} height={1152} className="relative mx-auto max-h-[650px] w-auto object-contain shadow-kh" />
        </div>
      </div>
    </section>
  );
}

function Workshop() {
  const [started, setStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  return (
    <section id="workshop" className="bg-kh-paper px-5 py-20 text-kh-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center"><p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-kh-green-deep">The KGHQ Growth Reset</p><h2 className="mt-4 font-display text-4xl font-extrabold tracking-normal md:text-6xl">WATCH THE WORKSHOP</h2><p className="mx-auto mt-4 max-w-2xl text-kh-muted">Twenty focused minutes. One clearer view of what deserves your attention now.</p></div>
        <div className="mt-12 overflow-hidden border border-kh-line bg-kh-white shadow-kh lg:grid lg:grid-cols-[1fr_340px]">
          <div className="bg-kh-ink p-4 text-kh-white md:p-6">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden border border-kh-dark-line bg-kh-ink-soft">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--kh-dark-line)_1px,transparent_1px),linear-gradient(90deg,var(--kh-dark-line)_1px,transparent_1px)] [background-size:44px_44px]" />
              {started ? <div className="relative max-w-xl px-8 text-center"><p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-kh-lime">Workshop preview</p><h3 className="mt-4 font-display text-3xl font-extrabold">Chapter {activeChapter + 1}: {chapters[activeChapter][1]}</h3><p className="mt-4 text-kh-dark-muted">{chapters[activeChapter][2]} The full workshop video will play here when the final recording is connected.</p></div> : <button type="button" onClick={() => setStarted(true)} aria-label="Start workshop preview" className="relative grid size-20 place-items-center rounded-full bg-kh-lime text-kh-ink shadow-[0_0_0_10px_color-mix(in_oklab,var(--kh-green)_22%,transparent)]"><Play className="ml-1 size-8 fill-current" /></button>}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between"><div><p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-kh-dark-muted">KGHQ Workshop · 20 min</p><p className="mt-1 font-display text-lg font-bold">Why more tactics won’t fix a fuzzy strategy</p></div><span className="hidden text-xs text-kh-dark-muted sm:block">A.J. MacQuarrie · Founder, KGHQ</span></div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-kh-dark-muted"><span>00:00</span><div className="h-1 flex-1 bg-kh-white/15"><div className="h-full w-[7%] bg-kh-lime" /></div><span>20:00</span></div>
          </div>
          <aside className="flex flex-col p-5 md:p-7"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-muted">Workshop map</p><div className="mt-3 flex-1">{chapters.map(([time, title, note], index) => <button key={time} type="button" onClick={() => { setActiveChapter(index); setStarted(true); }} className={`grid w-full grid-cols-[48px_1fr] gap-3 border-b border-kh-line px-2 py-4 text-left ${activeChapter === index ? "bg-kh-mist" : "bg-kh-white"}`}><span className="text-xs font-bold text-kh-green-deep">{time}</span><span><strong className="block font-display text-sm">{title}</strong><span className="mt-1 block text-xs text-kh-muted">{note}</span></span></button>)}</div><div className="mt-7 bg-kh-ink p-5 text-kh-white"><p className="text-xs leading-relaxed"><strong>Keep this beside you:</strong> write down the one problem you keep trying to solve with more effort.</p></div></aside>
        </div>
      </div>
    </section>
  );
}

function GrowthCheck() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const complete = step === questions.length;
  const choose = (score: number) => { setScores(current => [...current, score]); setStep(current => current + 1); };
  const restart = () => { setStep(0); setScores([]); };
  const lowest = scores.length ? Math.min(...scores) : 0;
  const floorIndex = scores.indexOf(lowest);
  return (
    <section id="growth-check" className="relative overflow-hidden bg-kh-ink px-5 py-20 text-kh-white md:px-8 md:py-28">
      <div className="absolute -left-40 -top-56 size-[520px] rounded-full border-[70px] border-kh-green/10" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center"><p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-kh-lime">Your 2-minute growth check</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-normal md:text-6xl">Which floor needs work before you build higher?</h2><p className="mt-5 text-kh-dark-muted">Rate six parts of your business. You’ll get a focused starting point—not a generic score.</p></div>
        <div className="mx-auto mt-12 max-w-4xl border border-kh-dark-line bg-kh-ink-soft p-6 shadow-kh md:p-10">
          {!complete ? <><div className="flex items-center gap-5"><span className="shrink-0 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-kh-dark-muted">Question {step + 1} of {questions.length}</span><div className="h-0.5 flex-1 bg-kh-white/15"><div className="h-full bg-kh-lime transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div></div><p className="mt-12 font-display text-xs font-bold uppercase tracking-[0.15em] text-kh-lime">{questions[step].floor}</p><h3 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-4xl">{questions[step].question}</h3><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{questions[step].answers.map(([label, note], index) => <button key={label} type="button" onClick={() => choose(index + 1)} className="min-h-36 border border-kh-dark-line bg-kh-white/5 p-4 text-left transition-colors hover:border-kh-green hover:bg-kh-white/10"><span className="grid size-6 place-items-center rounded-full border border-kh-dark-line text-xs text-kh-lime">{index + 1}</span><strong className="mt-8 block font-display text-sm">{label}</strong><span className="mt-1 block text-xs leading-relaxed text-kh-dark-muted">{note}</span></button>)}</div></> : <div className="py-6 text-center"><CheckCircle2 className="mx-auto size-12 text-kh-lime" /><p className="mt-5 font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">Your starting point</p><h3 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-extrabold">Strengthen the {questions[floorIndex]?.floor.split(" · ")[0] ?? "Foundation"} floor first.</h3><p className="mx-auto mt-5 max-w-xl text-kh-dark-muted">Your answers suggest this is the clearest constraint to investigate before adding more tactics. Use it as the focus for your next 90 days.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href="#planning-session" className="inline-flex min-h-12 items-center gap-2 bg-kh-lime px-6 font-display text-sm font-bold text-kh-ink">Build the plan <ArrowRight className="size-4" /></a><button type="button" onClick={restart} className="inline-flex min-h-12 items-center gap-2 border border-kh-dark-line px-6 font-display text-sm font-bold text-kh-white"><RotateCcw className="size-4" />Retake</button></div></div>}
        </div>
      </div>
    </section>
  );
}

function PlanningSession() {
  return (
    <section id="planning-session" className="bg-kh-mist px-5 py-20 text-kh-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">Make the next move real</p><h2 className="mt-5 font-display text-5xl font-extrabold leading-[1.06] tracking-normal md:text-6xl">Bring the bottleneck.<br />Leave with a growth plan.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-kh-muted">A Growth Planning Session is a focused working conversation—not a pressure-filled pitch. We’ll unpack what the diagnostic surfaced, choose the right 90-day priority, and decide whether KGHQ should help execute it.</p><div className="mt-8 space-y-5">{[["Get an outside perspective", "Pressure-test what is actually slowing growth."], ["Choose one priority", "Trade the sprawling wish list for a focused move."], ["Define the next steps", "Know what to do, who owns it, and what success means."]].map(([title, note]) => <div key={title} className="flex gap-4"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-kh-green text-kh-white"><Check className="size-4" /></span><div><h3 className="font-display font-bold">{title}</h3><p className="mt-1 text-sm text-kh-muted">{note}</p></div></div>)}</div><Link to="/new-client" className="mt-9 inline-flex min-h-12 items-center gap-2 bg-kh-ink px-6 font-display text-sm font-bold text-kh-white">Book a Growth Planning Session <ArrowRight className="size-4" /></Link><p className="mt-3 text-xs text-kh-muted">30 minutes · No prep deck required · Leave with a clear next step</p></div>
        <div className="bg-kh-white p-6 shadow-kh md:p-8"><div className="flex items-center gap-3 border-b border-kh-line pb-5"><span className="grid size-10 place-items-center rounded-lg bg-kh-ink text-kh-lime"><ArrowRight className="size-5 -rotate-45" /></span><div><p className="text-xs text-kh-muted">Growth Planning Session</p><h3 className="font-display font-bold">Choose a time that works</h3></div></div><div className="mt-6 flex items-center justify-between"><button type="button" aria-label="Previous dates" className="grid size-8 place-items-center rounded-full border border-kh-line"><ArrowLeft className="size-4" /></button><span className="font-display text-xs font-bold">Session calendar</span><button type="button" aria-label="Next dates" className="grid size-8 place-items-center rounded-full border border-kh-line"><ArrowRight className="size-4" /></button></div><div className="mt-5 grid grid-cols-3 gap-2">{[["Tue", "10:00", "AM ET"], ["Wed", "2:30", "PM ET"], ["Thu", "11:30", "AM ET"]].map(([day, time, zone]) => <div key={day} className="border border-kh-line px-2 py-5 text-center"><p className="text-[10px] font-bold uppercase text-kh-muted">{day}</p><p className="mt-2 font-display text-lg font-bold">{time}</p><p className="mt-1 text-[10px] text-kh-muted">{zone}</p></div>)}</div><div className="mt-3 bg-kh-mist p-3 text-[10px] leading-relaxed text-kh-muted"><strong className="text-kh-ink">Prototype calendar</strong> · Connect your live scheduling link here before launch. No appointment is created in this preview.</div><Link to="/new-client" className="mt-4 flex min-h-12 items-center justify-center bg-kh-green px-5 font-display text-sm font-bold text-kh-white">Choose a preview time</Link></div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="border-t border-kh-dark-line bg-kh-ink px-5 py-10 text-kh-white md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center"><Link to="/" aria-label="KGHQ home"><img src={logoLightAsset.url} alt="KGHQ" width={249} height={66} className="h-8 w-auto" /></Link><p className="text-sm text-kh-dark-muted">© {new Date().getFullYear()} KGHQ · Know what to do next. Then get it done.</p></div></footer>;
}

function GrowthResetPage() {
  return <main className="bg-kh-paper font-body text-kh-ink antialiased"><Header /><Hero /><Workshop /><GrowthCheck /><PlanningSession /><Footer /></main>;
}