import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Menu, Play, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";
import imgAi from "@/assets/training-ai-advantage.jpg";
import imgVa from "@/assets/training-va-leverage.jpg";
import imgMistakes from "@/assets/training-7-mistakes.jpg";

export const Route = createFileRoute("/training")({
  component: TrainingPage,
  head: () => ({
    meta: [
      { title: "Free Training Sessions for Small Business Owners — KGHQ" },
      { name: "description", content: "Free, practical training sessions from KGHQ: leverage AI with ChatGPT, get more from virtual assistants, and avoid the seven mistakes that kill small businesses." },
      { property: "og:title", content: "Free Training Sessions — KGHQ" },
      { property: "og:description", content: "Watch free, practical training sessions on AI, virtual assistants, and avoiding the mistakes that sink growing businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    
  }),
});

const sessions = [
  {
    id: "ai-advantage",
    label: "Session 1",
    title: "The AI Advantage: How to Grow Your Business by Leveraging AI",
    body: "In this session, you'll learn how ChatGPT can become your productivity time machine — boosting efficiency and streamlining day-to-day operations. Whether you're a seasoned entrepreneur or just getting started, this training shows practical ways to put AI to work in your business.",
    takeaways: [
      "Real prompts that save hours each week",
      "How to brief AI like a teammate, not a search bar",
      "Where AI quietly wastes time — and what to use instead",
    ],
    minutes: "45 min",
    image: imgAi,
    alt: "An entrepreneur putting AI to work on a laptop in a purple-lit studio",
  },
  {
    id: "va-leverage",
    label: "Session 2",
    title: "Quick & Easy Ways to Leverage VAs",
    body: "Discover how virtual assistants can revolutionize your business and your life. If you're a small business owner, you won't want to miss these tips, tricks, and strategies for boosting productivity, reclaiming your time, and stepping into a new realm of business success.",
    takeaways: [
      "What to delegate first (and what to keep yourself)",
      "How to onboard a VA in under a week",
      "Simple workflows that scale without micromanaging",
    ],
    minutes: "40 min",
    image: imgVa,
    alt: "A virtual assistant with a headset working alongside a small business owner",
  },
  {
    id: "seven-mistakes",
    label: "Session 3",
    title: "The 7 Mistakes That Killed My Business",
    body: "Discover the hard-hitting truths every entrepreneur needs to know to avoid business failure. A.J. shares the candid story of building a multimillion-dollar company from scratch — and the seven critical mistakes that led to a $1.5M bankruptcy. Walk away with actionable insights to steer clear of the same pitfalls.",
    takeaways: [
      "The early warning signs founders miss",
      "Cash flow traps that quietly compound",
      "How to rebuild discipline after a setback",
    ],
    minutes: "50 min",
    image: imgMistakes,
    alt: "A founder reflecting at his desk over notes and financial charts at dusk",
  },
];



function Hero() {
  return <section className="bg-kh-ink px-5 pb-20 pt-24 text-kh-white md:px-8 md:pb-28 md:pt-32"><div className="mx-auto max-w-7xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">KGHQ Training — Free sessions</p><h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl md:text-7xl">Training that pays for itself <span className="text-kh-lime">in an afternoon.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-kh-dark-muted md:text-xl">Short, practical sessions from the KGHQ team — free to watch, built for entrepreneurs who want results, not theory. Watch one, apply it the same day, and keep the momentum going.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#sessions" className="inline-flex min-h-12 items-center gap-2 bg-kh-lime px-6 font-display text-sm font-bold text-kh-ink"><Play className="size-4" />Watch the Sessions</a><Link to="/new-client" className="inline-flex min-h-12 items-center gap-2 border border-kh-dark-line px-6 font-display text-sm font-bold text-kh-white hover:bg-kh-white/10">Get Something Done <ArrowRight className="size-4" /></Link></div><div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-kh-dark-line pt-6 text-sm font-semibold text-kh-dark-muted"><span className="flex items-center gap-2"><Check className="size-4 text-kh-lime" />Free to watch</span><span className="flex items-center gap-2"><Check className="size-4 text-kh-lime" />No fluff</span><span className="flex items-center gap-2"><Check className="size-4 text-kh-lime" />New sessions added regularly</span></div></div></section>;
}

function SessionCard({ session }: { session: (typeof sessions)[number] }) {

  return <article className="grid overflow-hidden border border-kh-line bg-kh-white shadow-kh lg:grid-cols-[0.9fr_1.1fr]">
    <div className="relative min-h-64 overflow-hidden bg-kh-mist lg:min-h-full">
      <img src={session.image} alt={session.alt} loading="lazy" width={1024} height={1024} className="absolute inset-0 size-full object-cover" />
      <span className="absolute left-0 top-6 bg-kh-green px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-kh-white">{session.label}</span>
    </div>
    <div className="flex flex-col p-7 md:p-10">
      <h2 className="font-display text-2xl font-extrabold leading-snug md:text-3xl">{session.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-kh-muted md:text-base">{session.body}</p>
      <ul className="mt-6 space-y-3">
        {session.takeaways.map(item => <li key={item} className="flex gap-2.5 text-sm font-semibold"><Check className="mt-0.5 size-4 shrink-0 text-kh-green" />{item}</li>)}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-kh-line pt-6">
        <a href="/new-client/" className="wp-button">Ask About This Session</a>
        <span className="flex items-center gap-2 text-sm font-bold text-kh-muted"><Clock className="size-4" />{session.minutes} · Free</span>
      </div>
      
    </div>
  </article>;
}

function Sessions() {
  return <section id="sessions" className="bg-kh-paper px-5 py-20 text-kh-ink md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">Pick a session</p><h2 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">Start with the one that<br /><span className="text-kh-green-deep">fits what you're facing.</span></h2><p className="mt-5 text-lg text-kh-muted">Each session stands on its own — watch in any order, whenever it's convenient.</p></div><div className="mt-12 space-y-8">{sessions.map(session => <SessionCard key={session.id} session={session} />)}</div></div></section>;
}

function MoreComing() {
  return <section className="bg-kh-ink px-5 py-20 text-kh-white md:px-8 md:py-24"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center"><div><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-lime">More on the way</p><h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl">New sessions are already in the works.</h2><p className="mt-4 max-w-2xl text-kh-dark-muted">We add free training sessions regularly — on marketing, sales, systems, AI, and everything in between. Watch this space, or tell us what you'd like us to cover next.</p></div><div className="border border-kh-dark-line bg-kh-white/5 p-7"><Sparkles className="size-8 text-kh-lime" /><h3 className="mt-4 font-display text-xl font-extrabold">Have a topic in mind?</h3><p className="mt-2 text-sm text-kh-dark-muted">Tell us the problem keeping you up at night and we'll consider it for an upcoming session.</p><Link to="/new-client" className="mt-6 inline-flex min-h-11 items-center gap-2 bg-kh-lime px-5 font-display text-sm font-bold text-kh-ink">Request a Topic <ArrowRight className="size-4" /></Link></div></div></div></section>;
}

function FinalCTA() {
  return <section className="bg-kh-paper px-5 py-20 text-kh-ink md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="border-t-8 border-kh-green bg-kh-white p-8 shadow-kh md:p-14"><p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-kh-green-deep">From learning to doing</p><h2 className="mt-4 max-w-3xl font-display text-3xl font-extrabold md:text-5xl">When you're ready to turn what you learned into real progress, we're here.</h2><p className="mt-4 max-w-2xl text-kh-muted">KGHQ pairs the strategy from these sessions with the people, AI, and systems to actually execute it — one priority at a time.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/new-client" className="inline-flex min-h-12 items-center gap-2 bg-kh-ink px-6 font-display text-sm font-bold text-kh-white">Start With Your Biggest Priority <ArrowRight className="size-4" /></Link><Link to="/deliverables" className="inline-flex min-h-12 items-center gap-2 border border-kh-line px-6 font-display text-sm font-bold text-kh-green-deep">Browse the Deliverables Library</Link></div></div></div></section>;
}



function TrainingPage() {
  return <main className="bg-kh-paper font-body text-kh-ink antialiased"><Hero /><Sessions /><MoreComing /><FinalCTA /></main>;
}
