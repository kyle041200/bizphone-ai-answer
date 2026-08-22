import { createFileRoute } from "@tanstack/react-router";
import {
  PhoneCall, Clock, UserPlus, CalendarCheck, FileText, ArrowRight, Sparkles,
  MessageSquare, ShieldCheck, Check, Phone, Moon, Layers, PhoneForwarded,
  Wrench, Scale, Stethoscope, Workflow, Mail, ListChecks, HelpCircle,
} from "lucide-react";
import heroImg from "@/assets/hero-owner.jpg";
import phoneImg from "@/assets/app-call-summary.png";
import dashboardImg from "@/assets/dashboard.png";
import wavesImg from "@/assets/texture-waves.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BizPhone by KGHQ — AI Receptionist That Answers Every Call" },
      {
        name: "description",
        content:
          "BizPhone is your AI-powered front desk. It answers calls 24/7, captures leads, books appointments, routes urgent calls, and sends you a clean summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "BizPhone by KGHQ — Never Miss a Customer Call Again" },
      {
        property: "og:description",
        content:
          "AI call answering, lead capture, appointment booking, smart routing, and call summaries — set up and managed by KGHQ.",
      },
    ],
  }),
});

/* ---------- primitives ---------- */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-24 px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
      <Sparkles className="size-3.5" /> {children}
    </span>
  );
}

function CTAButtons({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#pricing"
        className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${
          light
            ? "bg-white text-primary shadow-glow hover:bg-white/90"
            : "bg-gradient-primary text-primary-foreground shadow-glow"
        }`}
      >
        Get BizPhone <ArrowRight className="size-4" />
      </a>
      <a
        href="#contact"
        className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors ${
          light
            ? "border-white/40 text-white hover:bg-white/10"
            : "border-border text-foreground hover:bg-secondary"
        }`}
      >
        <PhoneCall className="size-4" /> Hear a Demo
      </a>
    </div>
  );
}

/* ---------- sections ---------- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-primary">»»</span>
          <span className="text-lg font-black tracking-tight text-foreground">
            BizPhone
            <span className="ml-1.5 text-xs font-medium text-muted-foreground">by KGHQ</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <a href="#modes" className="transition-colors hover:text-primary">Modes</a>
          <a href="#how" className="transition-colors hover:text-primary">How It Works</a>
          <a href="#pricing" className="transition-colors hover:text-primary">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-primary">FAQ</a>
        </nav>
        <a
          href="#pricing"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Get BizPhone
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Small business owner taking a call from his work van" width={1536} height={1024} className="size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.06_285)] via-[oklch(0.18_0.08_285/0.92)] to-[oklch(0.2_0.12_290/0.55)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-24">
        <div className="text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur">
            <Sparkles className="size-3.5" /> AI Reception Phone by KGHQ
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Never Miss a<br />
            <span className="bg-gradient-to-r from-white to-[oklch(0.8_0.16_300)] bg-clip-text text-transparent">
              Customer Call
            </span>{" "}
            Again
          </h1>
          <p className="mt-6 max-w-xl text-xl font-semibold text-white/95">
            BizPhone is your AI-powered front desk.
          </p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/75">
            It answers calls, helps customers, captures leads, books appointments, and sends you a
            summary — 24/7.
          </p>
          <p className="mt-3 max-w-xl text-base text-white/60">
            Use it for every call, after hours, or simply when you can't answer.
          </p>
          <div className="mt-10">
            <CTAButtons light />
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
            {["Answers 24/7", "Works with your current number", "Set up & managed by KGHQ"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check className="size-4 text-[oklch(0.8_0.16_300)]" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-[100px]" />
          <img
            src={phoneImg}
            alt="BizPhone app showing an incoming call and an AI-generated call summary"
            width={1024}
            height={1024}
            className="w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

const capabilities = [
  { icon: Clock, label: "Answer calls 24/7" },
  { icon: UserPlus, label: "Capture new leads" },
  { icon: HelpCircle, label: "Answer common questions" },
  { icon: MessageSquare, label: "Take messages" },
  { icon: ListChecks, label: "Qualify callers" },
  { icon: CalendarCheck, label: "Book or request appointments" },
  { icon: PhoneForwarded, label: "Route urgent calls" },
  { icon: FileText, label: "Send you call summaries" },
  { icon: Layers, label: "Add leads to your CRM" },
  { icon: Mail, label: "Trigger text or email follow-up" },
];

function Problem() {
  return (
    <Section id="problem">
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>The reality</Eyebrow>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            You're Busy. Your Customers Are Still Calling.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            You're working. Driving. With another customer. On a job site. Or just trying to run
            your business.
          </p>
          <p className="mt-4 border-l-2 border-primary pl-5 text-lg font-semibold text-foreground">
            When you don't answer, your next customer may simply call someone else.
          </p>
          <p className="mt-6 text-2xl font-black text-gradient-primary">BizPhone answers for you.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {capabilities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const modes = [
  {
    icon: PhoneCall,
    title: "Every Call",
    body: "Let BizPhone act as your primary front desk and handle incoming calls automatically.",
  },
  {
    icon: PhoneForwarded,
    title: "When You Can't Answer",
    body: "Keep answering your own phone. If you don't pick up, BizPhone steps in so the customer never hits voicemail.",
    note: "Great for owner-operated businesses and small teams.",
  },
  {
    icon: Moon,
    title: "After Hours",
    body: "You handle calls during the day. BizPhone handles nights, weekends, holidays, and other times you're closed.",
  },
  {
    icon: Layers,
    title: "Overflow",
    body: "When your team is busy or already on the phone, BizPhone picks up the extra calls.",
  },
];

function Modes() {
  return (
    <div className="relative overflow-hidden bg-foreground text-white">
      <img src={wavesImg} alt="" loading="lazy" width={1536} height={768} className="absolute inset-0 size-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.06_285/0.9)] to-[oklch(0.14_0.05_285)]" />
      <Section id="modes" className="relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
            Flexible by design
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Choose How BizPhone Answers
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {modes.map(({ icon: Icon, title, body, note }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/12 bg-white/[0.06] p-7 backdrop-blur transition-colors hover:border-white/30"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-white/70">{body}</p>
              {note && <p className="mt-3 text-sm font-medium text-[oklch(0.82_0.14_300)]">{note}</p>}
            </div>
          ))}
        </div>
        <p className="mt-10 text-xl font-bold">
          You stay in control. <span className="text-white/60">BizPhone fills the gaps.</span>
        </p>
      </Section>
    </div>
  );
}

const steps = [
  {
    n: "01",
    title: "We Learn Your Business",
    body: "Tell us about your services, hours, FAQs, pricing, scheduling, and how you want different calls handled.",
  },
  {
    n: "02",
    title: "We Build Your BizPhone",
    body: "KGHQ creates your AI receptionist, call flow, questions, routing, and follow-up process.",
  },
  {
    n: "03",
    title: "BizPhone Answers",
    body: "Customers call your existing number or a dedicated BizPhone number. Your AI assistant answers and handles the conversation.",
  },
  {
    n: "04",
    title: "You Get the Details",
    body: "Receive a simple summary including who called, what they need, urgency, contact information, and what should happen next.",
  },
];

function HowItWorks() {
  return (
    <Section id="how">
      <div className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
          Live in Days, Not Months
        </h2>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-3xl border border-border bg-card p-7 shadow-card">
            <span className="text-4xl font-black text-primary/20">{s.n}</span>
            <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-5 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-chart-4/70" />
          <span className="size-2.5 rounded-full bg-chart-2/70" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            BizPhone — call log, leads &amp; AI transcript
          </span>
        </div>
        <img
          src={dashboardImg}
          alt="BizPhone dashboard showing call logs, captured leads, call volume, and an AI transcript"
          loading="lazy"
          width={1536}
          height={1024}
          className="w-full"
        />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Get it by email, text, CRM, ClickUp, Google Sheets, or another workflow.
      </p>
    </Section>
  );
}

const industries = [
  {
    icon: Wrench,
    title: "Contractors & Home Services",
    body: "Roofers • HVAC • Plumbers • Electricians • Landscapers • Handymen",
  },
  {
    icon: Scale,
    title: "Professional Services",
    body: "Law Firms • Consultants • Accountants • Real Estate",
  },
  {
    icon: Stethoscope,
    title: "Appointments & Local Businesses",
    body: "Med Spas • Salons • Clinics • Dentists • Local Franchises",
  },
];

function Industries() {
  return (
    <Section className="bg-secondary/60">
      <div className="text-center">
        <Eyebrow>Who it's for</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Built for Small Businesses That Run on the Phone
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {industries.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-xl font-bold">
        If a phone call can turn into revenue, <span className="text-gradient-primary">BizPhone can help.</span>
      </p>
    </Section>
  );
}

function MoreThan() {
  const flow = ["Answer", "Qualify", "Book", "Route", "Follow Up", "Update CRM"];
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            More Than an Answering Service
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Traditional answering services take messages.
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            BizPhone can actually do something with the call.
          </p>
          <p className="mt-6 text-muted-foreground">
            And because KGHQ sets up and manages the system, you don't have to figure out the AI,
            phone system, integrations, or automations yourself.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <ShieldCheck className="size-5 text-primary" /> Fully managed by KGHQ
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Depending on your setup
          </p>
          <div className="mt-6 space-y-3">
            {flow.map((f, i) => (
              <div key={f} className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-xl bg-secondary px-4 py-3 text-sm font-bold">{f}</div>
                {i < flow.length - 1 && <Workflow className="size-4 text-primary/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const plans = [
  {
    name: "BizPhone Starter",
    price: "$249",
    setup: "$750 setup",
    blurb: "For businesses that want to stop missing calls.",
    cta: "Get Started",
    features: [
      "AI call answering",
      "Custom greeting",
      "Business FAQs",
      "Lead capture",
      "Message taking",
      "Call summaries",
      "Email notifications",
      "Basic custom call flow",
      "Monthly review",
    ],
  },
  {
    name: "BizPhone Growth",
    price: "$499",
    setup: "$1,500 setup",
    blurb: "For businesses that want BizPhone connected to their sales and customer workflow.",
    cta: "Choose Growth",
    featured: true,
    intro: "Everything in Starter, plus:",
    features: [
      "Lead qualification",
      "Appointment requests",
      "Smart call routing",
      "SMS/email follow-up",
      "CRM or Google Sheets integration",
      "Enhanced call summaries",
      "Monthly optimization",
    ],
  },
  {
    name: "BizPhone Scale",
    price: "Starting at $999",
    setup: "Custom setup",
    blurb: "For higher-volume businesses, franchises, multi-location companies, and more complex workflows.",
    cta: "Talk to Us",
    features: [
      "Multiple locations or departments",
      "Advanced call flows",
      "Complex routing",
      "Higher call volume",
      "Advanced integrations",
      "Custom reporting",
      "Ongoing optimization",
    ],
  },
];

function Pricing() {
  return (
    <Section id="pricing" className="bg-secondary/60">
      <div className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Simple Pricing</h2>
      </div>

      <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-[2rem] border p-8 ${
              p.featured
                ? "border-primary/30 bg-foreground text-white shadow-glow lg:-mt-4 lg:pb-12"
                : "border-border bg-card shadow-card"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-black tracking-tight">{p.price}</span>
              <span className={p.featured ? "mb-1 text-sm text-white/60" : "mb-1 text-sm text-muted-foreground"}>
                /month
              </span>
            </div>
            <p className={`mt-1 text-sm font-medium ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>
              {p.setup}
            </p>
            <p className={`mt-4 text-sm ${p.featured ? "text-white/75" : "text-muted-foreground"}`}>
              {p.blurb}
            </p>
            <a
              href="#contact"
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
                p.featured
                  ? "bg-white text-primary"
                  : "bg-gradient-primary text-primary-foreground"
              }`}
            >
              {p.cta} <ArrowRight className="size-4" />
            </a>
            {p.intro && <p className="mt-7 text-sm font-semibold text-white/80">{p.intro}</p>}
            <ul className={`mt-6 space-y-3 text-sm ${p.featured ? "text-white/85" : "text-foreground/80"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-[oklch(0.82_0.14_300)]" : "text-primary"}`} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-[2rem] border border-border bg-card p-8 text-center shadow-card">
        <h3 className="text-xl font-black">Add What You Need</h3>
        <p className="mt-2 text-sm text-muted-foreground">Customize BizPhone with:</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "Calendar Booking", "CRM Integration", "SMS Follow-Up", "Bilingual Answering",
            "Lead Nurturing", "Review Requests", "Outbound Reminders", "Custom Automations",
          ].map((a) => (
            <span key={a} className="rounded-full border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
              {a}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Value() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary px-8 py-16 text-center text-primary-foreground shadow-glow">
        <h2 className="mx-auto max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
          What Is a Missed Call Worth?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/85">
          If one new customer is worth $500, $1,000, $5,000 or more, one answered call could pay for
          BizPhone.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {["$500", "$1,000", "$5,000+"].map((v) => (
            <span key={v} className="rounded-2xl bg-white/15 px-8 py-5 text-3xl font-black backdrop-blur">
              {v}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-xl text-primary-foreground/85">
          You don't need another employee sitting by the phone.
        </p>
        <p className="mt-2 text-xl font-bold">You need to make sure someone answers.</p>
      </div>
    </Section>
  );
}

const faqs = [
  {
    q: "Do I need a new phone number?",
    a: "Not necessarily. In many cases, we can connect BizPhone to your existing number through call forwarding or routing.",
  },
  { q: "Can I still answer my own calls?", a: "Absolutely. BizPhone can answer every call or only step in when you don't answer." },
  {
    q: "Can it answer after hours?",
    a: "Yes. You can have BizPhone answer only during evenings, weekends, holidays, or whenever your business is closed.",
  },
  {
    q: "Can BizPhone book appointments?",
    a: "Yes. Depending on your setup, BizPhone can collect appointment requests or connect directly with your scheduling workflow.",
  },
  {
    q: "Can it answer questions about my business?",
    a: "Yes. We customize BizPhone around your services, hours, locations, FAQs, policies, and preferred responses.",
  },
  { q: "What if someone needs a real person?", a: "We can create rules to transfer or escalate certain calls to you or your team." },
  {
    q: "Will people know it's AI?",
    a: "BizPhone is designed to sound natural and professional. We can also identify it as a virtual assistant depending on your preference and requirements.",
  },
];

function FAQ() {
  return (
    <Section id="faq" className="bg-secondary/60">
      <div className="text-center">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-6 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
              {f.q}
              <span className="text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <div id="contact" className="relative overflow-hidden bg-foreground text-white">
      <img src={wavesImg} alt="" loading="lazy" width={1536} height={768} className="absolute inset-0 size-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-[oklch(0.15_0.06_285/0.8)]" />
      <Section className="relative text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Stop Sending Customers to Voicemail.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
          You're too busy to answer every call. You shouldn't be too busy to capture the business.
        </p>
        <p className="mt-4 text-xl font-bold">Let BizPhone answer when you can't.</p>
        <div className="mt-10 flex justify-center">
          <CTAButtons light />
        </div>
      </Section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter text-primary">»»</span>
          <span className="font-bold text-foreground">BizPhone</span>
          <span>by KGHQ</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-4" /> AI reception, set up and managed for you.
        </div>
        <span>© {new Date().getFullYear()} KGHQ. All rights reserved.</span>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="bg-background">
      <Nav />
      <Hero />
      <Problem />
      <Modes />
      <HowItWorks />
      <Industries />
      <MoreThan />
      <Pricing />
      <Value />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
