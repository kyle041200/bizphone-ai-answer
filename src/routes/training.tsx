import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Menu, Play, Sparkles, X } from "lucide-react";

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
    { name: "twitter:card", content: "summary_large_image" }]


  })
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
  "Where AI quietly wastes time — and what to use instead"],

  minutes: "45 min",
  image: imgAi,
  alt: "An entrepreneur putting AI to work on a laptop in a purple-lit studio"
},
{
  id: "va-leverage",
  label: "Session 2",
  title: "Quick & Easy Ways to Leverage VAs",
  body: "Discover how virtual assistants can revolutionize your business and your life. If you're a small business owner, you won't want to miss these tips, tricks, and strategies for boosting productivity, reclaiming your time, and stepping into a new realm of business success.",
  takeaways: [
  "What to delegate first (and what to keep yourself)",
  "How to onboard a VA in under a week",
  "Simple workflows that scale without micromanaging"],

  minutes: "40 min",
  image: imgVa,
  alt: "A virtual assistant with a headset working alongside a small business owner"
},
{
  id: "seven-mistakes",
  label: "Session 3",
  title: "The 7 Mistakes That Killed My Business",
  body: "Discover the hard-hitting truths every entrepreneur needs to know to avoid business failure. A.J. shares the candid story of building a multimillion-dollar company from scratch — and the seven critical mistakes that led to a $1.5M bankruptcy. Walk away with actionable insights to steer clear of the same pitfalls.",
  takeaways: [
  "The early warning signs founders miss",
  "Cash flow traps that quietly compound",
  "How to rebuild discipline after a setback"],

  minutes: "50 min",
  image: imgMistakes,
  alt: "A founder reflecting at his desk over notes and financial charts at dusk"
}];




function Hero() {
  return <section className="layout-page-section layout-bg-kh-ink layout-px-5 layout-pb-20 layout-pt-24 layout-text-kh-white layout-tablet-px-8 layout-tablet-pb-28 layout-tablet-pt-32 layout-hero"><div className="layout-mx-auto layout-max-w-7xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-lime">KGHQ Training — Free sessions</p><h1 className="layout-mt-6 layout-max-w-4xl layout-font-display layout-text-5xl layout-font-extrabold layout-leading-1-02 layout-tablet-text-6xl layout-tablet-text-7xl">Training that pays for itself <span className="layout-text-kh-lime">in an afternoon.</span></h1><p className="layout-mt-6 layout-max-w-2xl layout-text-lg layout-leading-relaxed layout-text-kh-dark-muted layout-tablet-text-xl">Short, practical sessions from the KGHQ team — free to watch, built for entrepreneurs who want results, not theory. Watch one, apply it the same day, and keep the momentum going.</p><div className="layout-mt-9 layout-flex layout-flex-wrap layout-gap-3"><a href="#sessions" className="layout-inline-flex layout-min-h-12 layout-items-center layout-gap-2 layout-bg-kh-lime layout-px-6 layout-font-display layout-text-sm layout-font-bold layout-text-kh-ink page-link"><Play className="layout-size-4" />Watch the Sessions</a><a href="/new-client/" className="layout-inline-flex layout-min-h-12 layout-items-center layout-gap-2 layout-border layout-border-kh-dark-line layout-px-6 layout-font-display layout-text-sm layout-font-bold layout-text-kh-white page-link">Get Something Done <ArrowRight className="layout-size-4" /></a></div><div className="layout-mt-12 layout-flex layout-flex-wrap layout-items-center layout-gap-x-7 layout-gap-y-3 layout-border-t layout-border-kh-dark-line layout-pt-6 layout-text-sm layout-font-semibold layout-text-kh-dark-muted"><span className="layout-flex layout-items-center layout-gap-2"><Check className="layout-size-4 layout-text-kh-lime" />Free to watch</span><span className="layout-flex layout-items-center layout-gap-2"><Check className="layout-size-4 layout-text-kh-lime" />No fluff</span><span className="layout-flex layout-items-center layout-gap-2"><Check className="layout-size-4 layout-text-kh-lime" />New sessions added regularly</span></div></div></section>;
}

function SessionCard({ session }: {session: (typeof sessions)[number];}) {

  return <article className="layout-grid layout-overflow-hidden layout-border layout-border-kh-line layout-bg-kh-white layout-shadow-kh layout-desktop-grid-cols-0-9fr-1-1fr service-card">
    <div className="layout-min-h-64 layout-overflow-hidden layout-bg-kh-mist layout-desktop-min-h-full">
      <img src={session.image} alt={session.alt} loading="lazy" width={1024} height={1024} className="layout-size-full layout-object-cover content-image" />
      <span className="layout-bg-kh-green layout-px-4 layout-py-2 layout-font-display layout-text-xs layout-font-extrabold layout-uppercase layout-text-kh-white">{session.label}</span>
    </div>
    <div className="layout-flex layout-flex-col layout-p-7 layout-tablet-p-10">
      <h2 className="layout-font-display layout-text-2xl layout-font-extrabold layout-leading-snug layout-tablet-text-3xl">{session.title}</h2>
      <p className="layout-mt-4 layout-text-sm layout-leading-relaxed layout-text-kh-muted layout-tablet-text-base">{session.body}</p>
      <ul className="layout-mt-6 layout-space-y-3">
        {session.takeaways.map((item) => <li key={item} className="layout-flex layout-gap-2-5 layout-text-sm layout-font-semibold"><Check className="layout-mt-0-5 layout-size-4 layout-shrink-0 layout-text-kh-green" />{item}</li>)}
      </ul>
      <div className="layout-mt-8 layout-flex layout-flex-wrap layout-items-center layout-gap-4 layout-border-t layout-border-kh-line layout-pt-6">
        <a href="/new-client/" className="layout-wp-button page-link">Ask About This Session</a>
        <span className="layout-flex layout-items-center layout-gap-2 layout-text-sm layout-font-bold layout-text-kh-muted"><Clock className="layout-size-4" />{session.minutes} · Free</span>
      </div>
      
    </div>
  </article>;
}

function Sessions() {
  return <section id="sessions" className="layout-page-section layout-bg-kh-paper layout-px-5 layout-py-20 layout-text-kh-ink layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-max-w-3xl"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">Pick a session</p><h2 className="layout-mt-4 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">Start with the one that<br /><span className="layout-text-kh-green-deep">fits what you're facing.</span></h2><p className="layout-mt-5 layout-text-lg layout-text-kh-muted">Each session stands on its own — watch in any order, whenever it's convenient.</p></div><div className="layout-mt-12 layout-space-y-8">{sessions.map((session) => <SessionCard key={session.id} session={session} />)}</div></div></section>;
}

function MoreComing() {
  return <section className="layout-page-section layout-bg-kh-ink layout-px-5 layout-py-20 layout-text-kh-white layout-tablet-px-8 layout-tablet-py-24"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-grid layout-gap-8 layout-desktop-grid-cols-1-2fr-1fr layout-desktop-items-center"><div><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-lime">More on the way</p><h2 className="layout-mt-4 layout-font-display layout-text-3xl layout-font-extrabold layout-tablet-text-5xl">New sessions are already in the works.</h2><p className="layout-mt-4 layout-max-w-2xl layout-text-kh-dark-muted">We add free training sessions regularly — on marketing, sales, systems, AI, and everything in between. Watch this space, or tell us what you'd like us to cover next.</p></div><div className="layout-border layout-border-kh-dark-line layout-bg-kh-white-5 layout-p-7"><Sparkles className="layout-size-8 layout-text-kh-lime" /><h3 className="layout-mt-4 layout-font-display layout-text-xl layout-font-extrabold">Have a topic in mind?</h3><p className="layout-mt-2 layout-text-sm layout-text-kh-dark-muted">Tell us the problem keeping you up at night and we'll consider it for an upcoming session.</p><a href="/new-client/" className="layout-mt-6 layout-inline-flex layout-min-h-11 layout-items-center layout-gap-2 layout-bg-kh-lime layout-px-5 layout-font-display layout-text-sm layout-font-bold layout-text-kh-ink page-link">Request a Topic <ArrowRight className="layout-size-4" /></a></div></div></div></section>;
}

function FinalCTA() {
  return <section className="layout-page-section layout-bg-kh-paper layout-px-5 layout-py-20 layout-text-kh-ink layout-tablet-px-8 layout-tablet-py-28"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-border-t-8 layout-border-kh-green layout-bg-kh-white layout-p-8 layout-shadow-kh layout-tablet-p-14"><p className="layout-font-display layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">From learning to doing</p><h2 className="layout-mt-4 layout-max-w-3xl layout-font-display layout-text-3xl layout-font-extrabold layout-tablet-text-5xl">When you're ready to turn what you learned into real progress, we're here.</h2><p className="layout-mt-4 layout-max-w-2xl layout-text-kh-muted">KGHQ pairs the strategy from these sessions with the people, AI, and systems to actually execute it — one priority at a time.</p><div className="layout-mt-8 layout-flex layout-flex-wrap layout-gap-3"><a href="/new-client/" className="layout-inline-flex layout-min-h-12 layout-items-center layout-gap-2 layout-bg-kh-ink layout-px-6 layout-font-display layout-text-sm layout-font-bold layout-text-kh-white page-link">Start With Your Biggest Priority <ArrowRight className="layout-size-4" /></a><a href="/deliverables/" className="layout-inline-flex layout-min-h-12 layout-items-center layout-gap-2 layout-border layout-border-kh-line layout-px-6 layout-font-display layout-text-sm layout-font-bold layout-text-kh-green-deep page-link">Browse the Deliverables Library</a></div></div></div></section>;
}



function TrainingPage() {
  return <main className="layout-bg-kh-paper layout-font-body layout-text-kh-ink layout-antialiased"><Hero /><Sessions /><MoreComing /><FinalCTA /></main>;
}