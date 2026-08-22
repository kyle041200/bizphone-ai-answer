import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Check, Globe, PenLine, MousePointerClick, Inbox,
  Search, ShieldCheck, LifeBuoy, Wrench, HardHat, UtensilsCrossed, Scale,
  CalendarCheck, Rocket, MonitorSmartphone, FileText, TrendingUp, RefreshCw,
  Building2, Workflow, MessageSquare, Phone, Layout,
} from "lucide-react";
import heroImg from "@/assets/hero-bizsite.jpg";
import mockupImg from "@/assets/website-mockup.png";
import examplesImg from "@/assets/website-examples.png";
import wavesImg from "@/assets/texture-waves.jpg";

export const Route = createFileRoute("/bizsite")({
  component: BizSite,
  head: () => ({
    meta: [
      { title: "BizSite by KGHQ — A Better Website, Built to Bring You Business" },
      {
        name: "description",
        content:
          "BizSite gives your small business a modern, professional website designed to turn visitors into customers. Strategy, writing, design, lead capture, hosting, and support — all handled for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "BizSite by KGHQ — A Better Website, Built to Bring You Business" },
      {
        property: "og:description",
        content:
          "Modern small business websites with copy, design, lead capture, SEO, hosting, and ongoing support — without the months-long website process.",
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
        Get Your BizSite <ArrowRight className="size-4" />
      </a>
      <a
        href="#examples"
        className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors ${
          light
            ? "border-white/40 text-white hover:bg-white/10"
            : "border-border text-foreground hover:bg-secondary"
        }`}
      >
        <Layout className="size-4" /> See Examples
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
            BizSite
            <span className="ml-1.5 text-xs font-medium text-muted-foreground">by KGHQ</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <a href="#how" className="transition-colors hover:text-primary">How It Works</a>
          <a href="#features" className="transition-colors hover:text-primary">Features</a>
          <a href="#pricing" className="transition-colors hover:text-primary">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-primary">FAQ</a>
        </nav>
        <a
          href="#pricing"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Get Your BizSite
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Small business owner smiling while viewing her new professional website on a laptop" width={1536} height={1024} className="size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.06_285)] via-[oklch(0.18_0.08_285/0.92)] to-[oklch(0.2_0.12_290/0.55)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-24">
        <div className="text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur">
            <Sparkles className="size-3.5" /> Websites for Small Business by KGHQ
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            A Better Website.<br />
            <span className="bg-gradient-to-r from-white to-[oklch(0.8_0.16_300)] bg-clip-text text-transparent">
              Built to Bring You
            </span>{" "}
            Business.
          </h1>
          <p className="mt-6 max-w-xl text-xl font-semibold text-white/95">
            BizSite gives your small business a modern, professional website designed to turn visitors into customers.
          </p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/75">
            We handle the strategy, writing, design, lead capture, hosting, and ongoing support — without the traditional months-long website process.
          </p>
          <p className="mt-3 max-w-xl text-base text-white/60">
            You tell us about your business. We build the site.
          </p>
          <div className="mt-10">
            <CTAButtons light />
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
            {["Copy & design included", "Hosting & security handled", "Ongoing support built in"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check className="size-4 text-[oklch(0.8_0.16_300)]" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-[100px]" />
          <img
            src={examplesImg}
            alt="Examples of modern BizSite small business websites shown on laptops and a phone"
            width={1024}
            height={1024}
            className="w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

const outcomes = [
  { icon: Search, label: "Find your business" },
  { icon: Globe, label: "Understand what you do" },
  { icon: ShieldCheck, label: "Trust you" },
  { icon: Inbox, label: "Contact you" },
  { icon: FileText, label: "Request a quote" },
  { icon: CalendarCheck, label: "Book or inquire" },
  { icon: TrendingUp, label: "Become a customer" },
];

function Problem() {
  return (
    <Section id="problem">
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>The reality</Eyebrow>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Your Website Should Do More Than Look Good
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A lot of small business websites are little more than online brochures.
          </p>
          <p className="mt-4 border-l-2 border-primary pl-5 text-lg font-semibold text-foreground">
            BizSite is built to help people find you, trust you, and take the next step.
          </p>
          <p className="mt-6 text-2xl font-black text-gradient-primary">
            Your website should work for your business — even when you're not working.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {outcomes.map(({ icon: Icon, label }) => (
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

const steps = [
  {
    n: "01",
    title: "Tell Us About Your Business",
    body: "Complete a simple questionnaire or talk with us. We learn what you do, who you serve, and what makes your business different.",
  },
  {
    n: "02",
    title: "We Build Your BizSite",
    body: "We create the messaging, pages, design, calls to action, and lead capture around your business.",
  },
  {
    n: "03",
    title: "You Review It",
    body: "Give us your feedback and choose the look, imagery, and direction you like.",
  },
  {
    n: "04",
    title: "We Launch It",
    body: "We get your website live, hosted, secured, and ready to generate business.",
  },
  {
    n: "05",
    title: "We Keep Supporting It",
    body: "Need something changed next month? We're still here. Your BizSite includes ongoing support and updates.",
  },
];

function HowItWorks() {
  return (
    <Section id="how">
      <div className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Tell Us About Your Business. We'll Take It From There.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          You don't need to write website copy, figure out page layouts, learn SEO, or become a web designer.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
            <span className="text-4xl font-black text-primary/20">{s.n}</span>
            <h3 className="mt-3 text-base font-bold">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div id="examples" className="mt-16 overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-5 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-chart-4/70" />
          <span className="size-2.5 rounded-full bg-chart-2/70" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            BizSite example — services, quote form &amp; lead capture built in
          </span>
        </div>
        <img
          src={mockupImg}
          alt="Example BizSite website for a landscaping company with a hero section, service cards, and a quote request form"
          loading="lazy"
          width={1536}
          height={1024}
          className="w-full"
        />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Every BizSite is designed around your business, your services, and your customers.
      </p>
    </Section>
  );
}

const features = [
  {
    icon: MonitorSmartphone,
    title: "Professional Design",
    body: "A clean, modern, mobile-friendly website that makes your business look credible.",
  },
  {
    icon: PenLine,
    title: "Website Copy Included",
    body: "Tell us about your business and we'll help turn it into clear, professional website content.",
  },
  {
    icon: MousePointerClick,
    title: "Lead Capture",
    body: "Capture quote requests, inquiries, consultations, appointments, and contact information.",
  },
  {
    icon: Inbox,
    title: "Leads Sent to You",
    body: "New inquiries can go directly to your email or connect with your existing workflow.",
  },
  {
    icon: Search,
    title: "SEO",
    body: "Help customers discover your business when they're searching online.",
  },
  {
    icon: ShieldCheck,
    title: "Hosting & Security",
    body: "We handle the technical side so you don't have to.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    body: "Your website doesn't become another thing you have to manage yourself.",
  },
];

function Features() {
  return (
    <Section id="features" className="bg-secondary/60">
      <div className="text-center">
        <Eyebrow>What's included</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Everything Your Small Business Website Needs
        </h2>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const industries = [
  {
    icon: Wrench,
    title: "Contractors & Home Services",
    body: "Roofers • HVAC • Plumbers • Electricians • Landscapers • Handymen • Cleaning Companies",
  },
  {
    icon: HardHat,
    title: "Construction & Excavation",
    body: "General Contractors • Excavation • Site Prep • Land Clearing • Septic • Paving • Concrete • Demolition",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants & Hospitality",
    body: "Restaurants • Cafés • Catering • Event Venues • Hospitality Businesses",
  },
  {
    icon: Scale,
    title: "Professional Services",
    body: "Law Firms • Accountants • Consultants • Insurance Agencies • Real Estate • Property Management",
  },
  {
    icon: CalendarCheck,
    title: "Appointments & Local Services",
    body: "Med Spas • Salons • Barbers • Dental Offices • Auto Shops • Pet Services",
  },
  {
    icon: Rocket,
    title: "Entrepreneurs & New Businesses",
    body: "Startups • Solopreneurs • Coaches • Consultants • New Local Businesses",
  },
];

function Industries() {
  return (
    <div className="relative overflow-hidden bg-foreground text-white">
      <img src={wavesImg} alt="" loading="lazy" width={1536} height={768} className="absolute inset-0 size-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.16_0.06_285/0.9)] to-[oklch(0.14_0.05_285)]" />
      <Section className="relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
            Who it's for
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Built for Small Businesses That Need to Get Found
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/12 bg-white/[0.06] p-7 backdrop-blur transition-colors hover:border-white/30"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xl font-bold">
          If people search for your business online before deciding whether to call, visit, or buy —{" "}
          <span className="text-[oklch(0.82_0.14_300)]">your website matters.</span>
        </p>
      </Section>
    </div>
  );
}

const scenarios = [
  {
    title: "I Don't Have a Website",
    body: "We'll help you establish a professional online presence without having to figure everything out yourself.",
  },
  {
    title: "My Website Is Outdated",
    body: "We'll replace your old site with something modern, mobile-friendly, and easier for customers to use.",
  },
  {
    title: "My Website Doesn't Generate Leads",
    body: "We'll build stronger calls to action, lead forms, and conversion paths into your site.",
  },
  {
    title: "I'm Starting a New Business",
    body: "Give your new business a professional online home from day one.",
  },
  {
    title: "I Want More Google Traffic",
    body: "Add ongoing SEO, service pages, location pages, and content to help grow your visibility.",
  },
];

function Scenarios() {
  return (
    <Section>
      <div className="text-center">
        <Eyebrow>Where you're at</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
          Starting From Scratch or Starting Over?
        </h2>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s, i) => (
          <div
            key={s.title}
            className={`rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 ${
              i === 3 ? "lg:col-start-1" : ""
            }`}
          >
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const plans = [
  {
    name: "BizSite Starter",
    price: "$79",
    setup: "$759 setup",
    blurb: "Everything you need for a simple, professional small business website.",
    cta: "Start My Website",
    features: [
      "Up to 3 pages",
      "Website copy",
      "Professional design",
      "Mobile-friendly",
      "Lead capture",
      "Hosting",
      "Security monitoring",
      "Speed checks",
      "Automatic updates",
      "1 hour of updates each month",
    ],
  },
  {
    name: "BizSite Growth",
    price: "$159",
    setup: "$1,759 setup",
    blurb: "For businesses that want their website working harder to generate opportunities.",
    cta: "Choose Growth",
    featured: true,
    intro: "Everything in Starter, plus:",
    features: [
      "Up to 5 pages",
      "Website chatbot",
      "Visitor tracking",
      "Lead alerts",
      "Basic SEO",
      "Enhanced service pages",
      "Stronger lead generation",
      "Ongoing website support",
    ],
  },
  {
    name: "BizSite Scale",
    price: "$259",
    setup: "$2,159 setup",
    blurb: "For businesses that want to actively grow their online visibility.",
    cta: "Choose Scale",
    intro: "Everything in Growth, plus:",
    features: [
      "Advanced SEO",
      "Ongoing SEO optimization",
      "4 articles per month",
      "Blog management",
      "Keyword optimization",
      "Lead generation optimization",
      "Performance monitoring",
      "2 hours of updates each month",
    ],
  },
];

function Pricing() {
  return (
    <Section id="pricing" className="bg-secondary/60">
      <div className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Simple Website Packages</h2>
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
        <h3 className="text-xl font-black">Make Your BizSite Even Smarter</h3>
        <p className="mt-2 text-sm text-muted-foreground">Add what your business needs:</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "Additional Pages", "CRM Integration", "Email Follow-Up", "SMS Lead Alerts",
            "Advanced Chatbot", "Landing Pages", "Lead Magnets", "Advanced SEO",
            "Review Requests", "Analytics",
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

function MoreThan() {
  const flow = ["Get Found", "Build Trust", "Capture Interest", "Generate Leads", "Help You Grow"];
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            More Than Just a Website
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            A traditional website project often ends when the site launches.
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            That's when BizSite starts working.
          </p>
          <p className="mt-6 text-muted-foreground">
            And KGHQ stays behind it with hosting, updates, support, SEO options, content, and growth tools.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <Building2 className="size-5 text-primary" /> Fully managed by KGHQ
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Your website can
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

const faqs = [
  {
    q: "Do I have to write the website myself?",
    a: "No. Tell us about your business and we'll help create the messaging and website content.",
  },
  {
    q: "I already have a website. Can you replace it?",
    a: "Yes. BizSite can replace an outdated or underperforming website with a new one.",
  },
  {
    q: "Does hosting come with it?",
    a: "Yes. Hosting is included with every BizSite plan.",
  },
  {
    q: "Can customers contact me through the website?",
    a: "Yes. We can build forms for inquiries, quote requests, consultations, appointments, and other actions.",
  },
  {
    q: "Can leads go into my CRM?",
    a: "Yes. CRM integrations and other automated workflows can be added.",
  },
  {
    q: "Can you help me show up on Google?",
    a: "Yes. Growth includes foundational SEO support, while Scale is designed for businesses that want ongoing SEO and content.",
  },
  {
    q: "Can I add pages later?",
    a: "Absolutely. Your BizSite can grow as your business grows.",
  },
  {
    q: "What happens when I need something changed?",
    a: "Your monthly plan includes ongoing support. Additional design, development, content, or marketing work can also be added as needed.",
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
          Your Business Deserves a Better Website.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
          Look professional. Get found. Capture leads. Grow your business.
        </p>
        <p className="mt-4 text-xl font-bold">You run your business. We'll handle the website.</p>
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
          <span className="font-bold text-foreground">BizSite</span>
          <span>by KGHQ</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4" /> Websites that bring you business, managed for you.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <Phone className="size-4" /> BizPhone
          </Link>
          <span>© {new Date().getFullYear()} KGHQ. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function BizSite() {
  return (
    <main className="bg-background">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Industries />
      <Scenarios />
      <Pricing />
      <MoreThan />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
