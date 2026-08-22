import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Check, Globe, PenLine, MousePointerClick, Inbox,
  Search, ShieldCheck, LifeBuoy, Wrench, HardHat, UtensilsCrossed, Scale,
  CalendarCheck, Rocket, MonitorSmartphone, FileText, TrendingUp,
  Building2, MessageSquare, Phone, Layout, Compass,
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
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap",
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
    <section id={id} className={`px-6 py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] ${
        dark ? "text-bs-teal-bright" : "text-bs-teal"
      }`}
    >
      <span className={`h-px w-8 ${dark ? "bg-bs-teal-bright" : "bg-bs-teal"}`} />
      {children}
    </span>
  );
}

function CTAButtons({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#pricing"
        className={`inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${
          light
            ? "bg-bs-teal-bright text-bs-navy-deep shadow-bs-glow hover:bg-bs-teal"
            : "bg-bs-gradient text-bs-on-dark shadow-bs-glow"
        }`}
      >
        Get Your BizSite <ArrowRight className="size-4" />
      </a>
      <a
        href="#examples"
        className={`inline-flex items-center gap-2 border px-7 py-3.5 text-sm font-bold transition-colors ${
          light
            ? "border-bs-dark-line text-bs-on-dark hover:bg-bs-dark-card"
            : "border-bs-line text-bs-ink hover:bg-bs-sand"
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
    <header className="sticky top-0 z-50 border-b border-bs-dark-line bg-bs-navy-deep/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center bg-bs-gradient font-display text-sm font-extrabold text-bs-on-dark">
            B
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-bs-on-dark">
            BizSite
            <span className="ml-1.5 font-body text-xs font-medium text-bs-on-dark-muted">by KGHQ</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-bs-on-dark-muted md:flex">
          <a href="#how" className="transition-colors hover:text-bs-teal-bright">How It Works</a>
          <a href="#features" className="transition-colors hover:text-bs-teal-bright">Features</a>
          <a href="#pricing" className="transition-colors hover:text-bs-teal-bright">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-bs-teal-bright">FAQ</a>
        </nav>
        <a
          href="#pricing"
          className="inline-flex items-center gap-1.5 bg-bs-teal-bright px-5 py-2.5 text-sm font-bold text-bs-navy-deep transition-transform hover:-translate-y-0.5"
        >
          Get Your BizSite
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-bs-navy-deep">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Small business owner smiling while viewing her new professional website on a laptop"
          width={1536}
          height={1024}
          className="size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bs-navy-deep via-bs-navy-deep/90 to-bs-navy/50" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-24">
        <div className="text-bs-on-dark">
          <Eyebrow dark>Websites for Small Business by KGHQ</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
            A Better Website.<br />
            Built to <span className="text-bs-gradient">Bring You Business.</span>
          </h1>
          <p className="mt-7 max-w-xl text-xl font-semibold text-bs-on-dark">
            BizSite gives your small business a modern, professional website designed to turn visitors into customers.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-bs-on-dark-muted">
            We handle the strategy, writing, design, lead capture, hosting, and ongoing support — without the traditional months-long website process.
          </p>
          <p className="mt-4 max-w-xl border-l-2 border-bs-teal pl-4 text-base font-medium text-bs-on-dark-muted">
            You tell us about your business. We build the site.
          </p>
          <div className="mt-10">
            <CTAButtons light />
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-bs-on-dark-muted">
            {["Copy & design included", "Hosting & security handled", "Ongoing support built in"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check className="size-4 text-bs-teal-bright" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-full bg-bs-teal/40 blur-[100px]" />
          <img
            src={examplesImg}
            alt="Examples of modern BizSite small business websites shown on a laptop, tablet, and phone"
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
    <Section id="problem" className="bg-bs-paper">
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>The reality</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
            Your Website Should Do More Than Look Good
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bs-muted">
            A lot of small business websites are little more than online brochures.
          </p>
          <p className="mt-4 border-l-2 border-bs-teal pl-5 text-lg font-semibold text-bs-ink">
            BizSite is built to help people find you, trust you, and take the next step.
          </p>
          <p className="mt-8 font-display text-2xl font-bold text-bs-gradient">
            Your website should work for your business — even when you're not working.
          </p>
        </div>

        <ol className="divide-y divide-bs-line border-y border-bs-line">
          {outcomes.map(({ icon: Icon, label }, i) => (
            <li key={label} className="group flex items-center gap-5 py-5 transition-colors hover:bg-bs-sand/60">
              <span className="font-display text-sm font-bold text-bs-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center border border-bs-line bg-bs-paper text-bs-teal transition-colors group-hover:border-bs-teal">
                <Icon className="size-4.5" />
              </span>
              <span className="text-base font-semibold text-bs-ink">{label}</span>
              <ArrowRight className="ml-auto size-4 text-bs-teal opacity-0 transition-opacity group-hover:opacity-100" />
            </li>
          ))}
        </ol>
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
    <Section id="how" className="bg-bs-sand">
      <div className="max-w-3xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
          Tell Us About Your Business. We'll Take It From There.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-bs-muted">
          You don't need to write website copy, figure out page layouts, learn SEO, or become a web designer.
        </p>
      </div>

      <div className="relative mt-14">
        <div className="absolute left-6 top-0 hidden h-full w-px bg-bs-line lg:left-1/2 lg:block" />
        <div className="space-y-10">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`relative grid gap-6 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "lg:text-right" : ""}`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className={`flex items-center gap-4 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <span className="flex size-12 shrink-0 items-center justify-center bg-bs-navy font-display text-sm font-bold text-bs-teal-bright">
                    {s.n}
                  </span>
                  <h3 className="font-display text-xl font-bold text-bs-ink">{s.title}</h3>
                </div>
                <p className={`mt-4 max-w-md leading-relaxed text-bs-muted ${i % 2 === 1 ? "lg:ml-auto" : ""}`}>
                  {s.body}
                </p>
              </div>
              <div className="hidden lg:block" />
            </div>
          ))}
        </div>
      </div>

      <div id="examples" className="mt-20 overflow-hidden border border-bs-line bg-bs-paper shadow-bs-glow">
        <div className="flex items-center gap-2 border-b border-bs-line bg-bs-sand px-5 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-chart-4/70" />
          <span className="size-2.5 rounded-full bg-bs-teal/70" />
          <span className="ml-3 text-xs font-medium text-bs-muted">
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
      <p className="mt-6 text-center text-sm text-bs-muted">
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
    large: true,
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
    large: true,
  },
];

function Features() {
  return (
    <Section id="features" className="bg-bs-paper">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>What's included</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
            Everything Your Small Business Website Needs
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-bs-muted">
          One plan covers the whole job — strategy, content, design, and the technical plumbing behind it.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body, large }) => (
          <div
            key={title}
            className={`group border border-bs-line bg-bs-paper p-7 shadow-bs-card transition-all hover:-translate-y-1 hover:border-bs-teal ${
              large ? "sm:col-span-2" : ""
            }`}
          >
            <span className="flex size-11 items-center justify-center bg-bs-navy text-bs-teal-bright transition-colors group-hover:bg-bs-teal group-hover:text-bs-navy-deep">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-bs-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-bs-muted">{body}</p>
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
    <div className="relative overflow-hidden bg-bs-navy-deep text-bs-on-dark">
      <img
        src={wavesImg}
        alt=""
        loading="lazy"
        width={1536}
        height={768}
        className="absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bs-navy-deep/85 to-bs-navy-deep" />
      <Section className="relative">
        <div className="max-w-2xl">
          <Eyebrow dark>Who it's for</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Built for Small Businesses That Need to Get Found
          </h2>
        </div>

        <div className="mt-12 divide-y divide-bs-dark-line border-y border-bs-dark-line">
          {industries.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group grid items-center gap-3 py-6 transition-colors hover:bg-bs-dark-card md:grid-cols-[auto_1fr_2fr] md:gap-8 md:px-4"
            >
              <span className="flex size-11 items-center justify-center border border-bs-dark-line text-bs-teal-bright transition-colors group-hover:border-bs-teal">
                <Icon className="size-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-bs-on-dark-muted">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl font-display text-xl font-bold leading-relaxed md:text-2xl">
          If people search for your business online before deciding whether to call, visit, or buy —{" "}
          <span className="text-bs-teal-bright">your website matters.</span>
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
    <Section className="bg-bs-sand">
      <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>Where you're at</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
            Starting From Scratch or Starting Over?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bs-muted">
            Wherever your website is today, there's a BizSite path forward.
          </p>
          <div className="mt-8">
            <CTAButtons />
          </div>
        </div>
        <div className="space-y-4">
          {scenarios.map((s) => (
            <div
              key={s.title}
              className="border-l-4 border-bs-teal bg-bs-paper p-6 shadow-bs-card transition-transform hover:-translate-y-0.5"
            >
              <h3 className="font-display text-lg font-bold text-bs-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bs-muted">{s.body}</p>
            </div>
          ))}
        </div>
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
    <Section id="pricing" className="bg-bs-paper">
      <div className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
          Simple Website Packages
        </h2>
      </div>

      <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative border p-8 ${
              p.featured
                ? "border-bs-teal bg-bs-navy-deep text-bs-on-dark shadow-bs-glow lg:-mt-4 lg:pb-12"
                : "border-bs-line bg-bs-paper shadow-bs-card"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 bg-bs-teal-bright px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-bs-navy-deep">
                Most popular
              </span>
            )}
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-5xl font-extrabold tracking-tight">{p.price}</span>
              <span className={p.featured ? "mb-1 text-sm text-bs-on-dark-muted" : "mb-1 text-sm text-bs-muted"}>
                /month
              </span>
            </div>
            <p className={`mt-1 text-sm font-medium ${p.featured ? "text-bs-on-dark-muted" : "text-bs-muted"}`}>
              {p.setup}
            </p>
            <p className={`mt-4 text-sm ${p.featured ? "text-bs-on-dark-muted" : "text-bs-muted"}`}>
              {p.blurb}
            </p>
            <a
              href="#contact"
              className={`mt-6 flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
                p.featured
                  ? "bg-bs-teal-bright text-bs-navy-deep"
                  : "bg-bs-navy text-bs-on-dark"
              }`}
            >
              {p.cta} <ArrowRight className="size-4" />
            </a>
            {p.intro && <p className="mt-7 text-sm font-semibold text-bs-teal-bright">{p.intro}</p>}
            <ul className={`mt-6 space-y-3 text-sm ${p.featured ? "text-bs-on-dark" : "text-bs-ink"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-bs-teal-bright" : "text-bs-teal"}`} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 border border-bs-line bg-bs-sand p-8 text-center shadow-bs-card">
        <h3 className="font-display text-xl font-bold text-bs-ink">Make Your BizSite Even Smarter</h3>
        <p className="mt-2 text-sm text-bs-muted">Add what your business needs:</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "Additional Pages", "CRM Integration", "Email Follow-Up", "SMS Lead Alerts",
            "Advanced Chatbot", "Landing Pages", "Lead Magnets", "Advanced SEO",
            "Review Requests", "Analytics",
          ].map((a) => (
            <span
              key={a}
              className="border border-bs-line bg-bs-paper px-4 py-2 text-sm font-semibold text-bs-ink transition-colors hover:border-bs-teal hover:text-bs-teal"
            >
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
    <Section className="bg-bs-sand">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
            More Than Just a Website
          </h2>
          <p className="mt-5 text-lg text-bs-muted">
            A traditional website project often ends when the site launches.
          </p>
          <p className="mt-2 text-lg font-semibold text-bs-ink">
            That's when BizSite starts working.
          </p>
          <p className="mt-6 text-bs-muted">
            And KGHQ stays behind it with hosting, updates, support, SEO options, content, and growth tools.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-bs-muted">
            <Building2 className="size-5 text-bs-teal" /> Fully managed by KGHQ
          </div>
        </div>

        <div className="border border-bs-line bg-bs-paper p-8 shadow-bs-glow">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-bs-muted">
            Your website can
          </p>
          <div className="mt-6 space-y-0">
            {flow.map((f, i) => (
              <div key={f} className="relative flex items-center gap-4 pb-6 last:pb-0">
                {i < flow.length - 1 && (
                  <span className="absolute left-4 top-9 h-[calc(100%-2rem)] w-px bg-bs-line" />
                )}
                <span className="flex size-8 shrink-0 items-center justify-center bg-bs-navy font-display text-xs font-bold text-bs-teal-bright">
                  {i + 1}
                </span>
                <div className="flex-1 border border-bs-line bg-bs-sand px-4 py-3 text-sm font-bold text-bs-ink">
                  {f}
                </div>
                <Compass className="size-4 text-bs-teal" />
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
    <Section id="faq" className="bg-bs-paper">
      <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-bs-ink md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-5 text-lg text-bs-muted">
            Everything small business owners usually ask us before getting started.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-bs-line bg-bs-paper p-6 shadow-bs-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-bs-ink">
                {f.q}
                <span className="text-bs-teal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-relaxed text-bs-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <div id="contact" className="relative overflow-hidden bg-bs-navy-deep text-bs-on-dark">
      <img
        src={wavesImg}
        alt=""
        loading="lazy"
        width={1536}
        height={768}
        className="absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-bs-navy-deep/70" />
      <Section className="relative text-center">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          Your Business Deserves a <span className="text-bs-gradient">Better Website.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-bs-on-dark-muted">
          Look professional. Get found. Capture leads. Grow your business.
        </p>
        <p className="mt-4 font-display text-xl font-bold">You run your business. We'll handle the website.</p>
        <div className="mt-10 flex justify-center">
          <CTAButtons light />
        </div>
      </Section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-bs-dark-line bg-bs-navy-deep px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-bs-on-dark-muted md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center bg-bs-gradient font-display text-xs font-extrabold text-bs-on-dark">
            B
          </span>
          <span className="font-display font-bold text-bs-on-dark">BizSite</span>
          <span>by KGHQ</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4" /> Websites that bring you business, managed for you.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-bs-teal-bright">
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
    <main className="bg-bs-paper font-body text-bs-ink antialiased">
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
