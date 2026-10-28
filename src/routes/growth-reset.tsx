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

function Workshop() { return <section id="workshop" className="bg-kh-paper px-5 py-20 text-kh-ink"><div className="mx-auto max-w-7xl"><h2>WATCH THE WORKSHOP</h2><p>Twenty focused minutes. One clearer view of what deserves your attention now.</p><div className="grid gap-8 lg:grid-cols-2"><div><h3>Why more tactics won’t fix a fuzzy strategy</h3><p>A.J. MacQuarrie · Founder, KGHQ · 20 minutes</p><p>Separate activity from progress, identify your growth bottleneck, and choose your next 90-day priority.</p></div><aside className="workshop-chapters"><h3>Workshop map</h3><ol>{chapters.map(([time, title, note]) => <li key={time}><span>{time}</span><h4>{title}</h4><p>{note}</p></li>)}</ol><p>Write down the one problem you keep trying to solve with more effort.</p></aside></div></div></section>; }

function GrowthCheck() { return <section id="growth-check" className="bg-kh-ink px-5 py-20 text-kh-white"><div className="mx-auto max-w-7xl"><h2>Which floor needs work before you build higher?</h2><p>Rate six parts of your business. Focus on the lowest-rated floor before adding more tactics.</p><div className="grid gap-6 lg:grid-cols-2">{questions.map((question, index) => <fieldset className="growth-question" key={question.floor}><legend>{question.floor}</legend><h3>{question.question}</h3>{question.answers.map(([label, note], score) => <label className="growth-answer" key={label}><input type="radio" name={`growth-floor-${index}`} value={score + 1} /><span><strong>{label}</strong><span>{note}</span></span></label>)}</fieldset>)}</div><h3>Your starting point</h3><p>Strengthen your lowest-rated floor first. If several floors have the same rating, start with the earliest floor. Investigate this constraint and use it as the focus for your next 90 days.</p><a href="#planning-session" className="wp-button">Build the plan</a></div></section>; }

function PlanningSession() { return <section id="planning-session" className="bg-kh-mist px-5 py-20 text-kh-ink"><div className="mx-auto max-w-7xl"><h2>Bring the bottleneck. Leave with a growth plan.</h2><p>A Growth Planning Session is a focused working conversation—not a pressure-filled pitch. We’ll unpack what the diagnostic surfaced, choose the right 90-day priority, and decide whether KGHQ should help execute it.</p><ul><li>Get an outside perspective. Pressure-test what is actually slowing growth.</li><li>Choose one priority. Trade the sprawling wish list for a focused move.</li><li>Define the next steps. Know what to do, who owns it, and what success means.</li></ul><a href="/new-client/" className="wp-button">Request a Growth Planning Session</a><p>30 minutes · No prep deck required · Leave with a clear next step</p></div></section>; }



function GrowthResetPage() {
  return <main className="bg-kh-paper font-body text-kh-ink antialiased"><Hero /><Workshop /><GrowthCheck /><PlanningSession /></main>;
}