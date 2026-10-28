import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Check, Globe, PenLine, MousePointerClick, Inbox,
  Search, ShieldCheck, LifeBuoy, Wrench, HardHat, UtensilsCrossed, Scale,
  CalendarCheck, Rocket, MonitorSmartphone, FileText, TrendingUp,
  Building2, MessageSquare, Phone, Layout, Compass } from
"lucide-react";
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
      "BizSite gives your small business a modern, professional website designed to turn visitors into customers. Strategy, writing, design, lead capture, hosting, and support — all handled for you."
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:title", content: "BizSite by KGHQ — A Better Website, Built to Bring You Business" },
    {
      property: "og:description",
      content:
      "Modern small business websites with copy, design, lead capture, SEO, hosting, and ongoing support — without the months-long website process."
    }]


  })
});

/* ---------- primitives ---------- */

function Section({
  id,
  children,
  className = ""




}: {id?: string;children: React.ReactNode;className?: string;}) {
  return (
    <section id={id} className={`layout-px-6 layout-py-24 layout- ${className}layout- `}>
      <div className="layout-mx-auto layout-max-w-6xl">{children}</div>
    </section>);

}

function Eyebrow({ children, dark = false }: {children: React.ReactNode;dark?: boolean;}) {
  return (
    <span
      className={`layout-inline-flex layout-items-center layout-gap-2-5 layout-text-xs layout-font-bold layout-uppercase layout- ${
      dark ? "layout-text-bs-teal-bright" : "layout-text-bs-teal"}layout- `
      }>
      
      <span className={`layout-h-px layout-w-8 layout- ${dark ? "layout-bg-bs-teal-bright" : "layout-bg-bs-teal"}layout- `} />
      {children}
    </span>);

}

function CTAButtons({ light = false }: {light?: boolean;}) {
  return (
    <div className="layout-flex layout-flex-wrap layout-items-center layout-gap-3">
      <a
        href="#pricing"
        className={`layout-inline-flex layout-items-center layout-gap-2 layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout- ${
        light ?
        "layout-bg-bs-teal-bright layout-text-bs-navy-deep layout-shadow-bs-glow" :
        "layout-bg-bs-gradient layout-text-bs-on-dark layout-shadow-bs-glow"}layout- `
        }>
        
        Get Your BizSite <ArrowRight className="layout-size-4" />
      </a>
      <a
        href="#examples"
        className={`layout-inline-flex layout-items-center layout-gap-2 layout-border layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout- ${
        light ?
        "layout-border-bs-dark-line layout-text-bs-on-dark" :
        "layout-border-bs-line layout-text-bs-ink"}layout- `
        }>
        
        <Layout className="layout-size-4" /> See Examples
      </a>
    </div>);

}

/* ---------- sections ---------- */



function Hero() {
  return (
    <section className="layout-page-section layout-overflow-hidden layout-bg-bs-navy-deep layout-hero">
      <div className="">
        <img
          src={heroImg}
          alt="Small business owner smiling while viewing her new professional website on a laptop"
          width={1536}
          height={1024}
          className="layout-size-full layout-object-cover content-image" />
        
        
      </div>

      <div className="layout-mx-auto layout-grid layout-max-w-6xl layout-items-center layout-gap-12 layout-px-6 layout-pb-24 layout-pt-20 layout-desktop-grid-cols-1-15fr-0-85fr layout-desktop-pb-28 layout-desktop-pt-24">
        <div className="layout-text-bs-on-dark">
          <Eyebrow dark>Websites for Small Business by KGHQ</Eyebrow>
          <h1 className="layout-mt-6 layout-font-display layout-text-5xl layout-font-extrabold layout-leading-1-04 layout-tablet-text-6xl layout-desktop-text-7xl">
            A Better Website.<br />
            Built to <span className="layout-text-bs-gradient">Bring You Business.</span>
          </h1>
          <p className="layout-mt-7 layout-max-w-xl layout-text-xl layout-font-semibold layout-text-bs-on-dark">
            BizSite gives your small business a modern, professional website designed to turn visitors into customers.
          </p>
          <p className="layout-mt-4 layout-max-w-xl layout-text-lg layout-leading-relaxed layout-text-bs-on-dark-muted">
            We handle the strategy, writing, design, lead capture, hosting, and ongoing support — without the traditional months-long website process.
          </p>
          <p className="layout-mt-4 layout-max-w-xl layout-border-l-2 layout-border-bs-teal layout-pl-4 layout-text-base layout-font-medium layout-text-bs-on-dark-muted">
            You tell us about your business. We build the site.
          </p>
          <div className="layout-mt-10">
            <CTAButtons light />
          </div>
          <div className="layout-mt-10 layout-flex layout-flex-wrap layout-gap-x-8 layout-gap-y-3 layout-text-sm layout-text-bs-on-dark-muted">
            {["Copy & design included", "Hosting & security handled", "Ongoing support built in"].map((t) =>
            <span key={t} className="layout-inline-flex layout-items-center layout-gap-2">
                <Check className="layout-size-4 layout-text-bs-teal-bright" /> {t}
              </span>
            )}
          </div>
        </div>

        <div className="layout-mx-auto layout-w-full layout-max-w-sm">
          
          <img
            src={examplesImg}
            alt="Examples of modern BizSite small business websites shown on a laptop, tablet, and phone"
            width={1024}
            height={1024}
            className="layout-w-full layout-rounded-2xl layout-border layout-border-bs-dark-line layout-shadow-bs-glow content-image" />
          
        </div>
      </div>
    </section>);

}

const outcomes = [
{ icon: Search, label: "Find your business" },
{ icon: Globe, label: "Understand what you do" },
{ icon: ShieldCheck, label: "Trust you" },
{ icon: Inbox, label: "Contact you" },
{ icon: FileText, label: "Request a quote" },
{ icon: CalendarCheck, label: "Book or inquire" },
{ icon: TrendingUp, label: "Become a customer" }];


function Problem() {
  return (
    <Section id="problem" className="layout-bg-bs-paper">
      <div className="layout-grid layout-items-start layout-gap-14 layout-desktop-grid-cols-2">
        <div className="">
          <Eyebrow>The reality</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
            Your Website Should Do More Than Look Good
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-leading-relaxed layout-text-bs-muted">
            A lot of small business websites are little more than online brochures.
          </p>
          <p className="layout-mt-4 layout-border-l-2 layout-border-bs-teal layout-pl-5 layout-text-lg layout-font-semibold layout-text-bs-ink">
            BizSite is built to help people find you, trust you, and take the next step.
          </p>
          <p className="layout-mt-8 layout-font-display layout-text-2xl layout-font-bold layout-text-bs-gradient">
            Your website should work for your business — even when you're not working.
          </p>
        </div>

        <ol className="layout-divide-y layout-divide-bs-line layout-border-y layout-border-bs-line">
          {outcomes.map(({ icon: Icon, label }, i) =>
          <li key={label} className="layout-group layout-flex layout-items-center layout-gap-5 layout-py-5">
              <span className="layout-font-display layout-text-sm layout-font-bold layout-text-bs-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="layout-flex layout-size-10 layout-shrink-0 layout-items-center layout-justify-center layout-border layout-border-bs-line layout-bg-bs-paper layout-text-bs-teal">
                <Icon className="layout-size-4-5" />
              </span>
              <span className="layout-text-base layout-font-semibold layout-text-bs-ink">{label}</span>
              <ArrowRight className="layout-ml-auto layout-size-4 layout-text-bs-teal" />
            </li>
          )}
        </ol>
      </div>
    </Section>);

}

const steps = [
{
  n: "01",
  title: "Tell Us About Your Business",
  body: "Complete a simple questionnaire or talk with us. We learn what you do, who you serve, and what makes your business different."
},
{
  n: "02",
  title: "We Build Your BizSite",
  body: "We create the messaging, pages, design, calls to action, and lead capture around your business."
},
{
  n: "03",
  title: "You Review It",
  body: "Give us your feedback and choose the look, imagery, and direction you like."
},
{
  n: "04",
  title: "We Launch It",
  body: "We get your website live, hosted, secured, and ready to generate business."
},
{
  n: "05",
  title: "We Keep Supporting It",
  body: "Need something changed next month? We're still here. Your BizSite includes ongoing support and updates."
}];


function HowItWorks() {
  return (
    <Section id="how" className="layout-bg-bs-sand">
      <div className="layout-max-w-3xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
          Tell Us About Your Business. We'll Take It From There.
        </h2>
        <p className="layout-mt-5 layout-max-w-2xl layout-text-lg layout-text-bs-muted">
          You don't need to write website copy, figure out page layouts, learn SEO, or become a web designer.
        </p>
      </div>

      <div className="layout-mt-14">
        
        <div className="layout-space-y-10">
          {steps.map((s, i) =>
          <div
            key={s.n}
            className={`layout-grid layout-gap-6 layout-desktop-grid-cols-2 layout-desktop-gap-16 layout- ${i % 2 === 1 ? "layout-desktop-text-right" : "layout-"}layout- `}>
            
              <div className={i % 2 === 1 ? "layout-desktop-order-2" : "layout-"}>
                <div className={`layout-flex layout-items-center layout-gap-4 layout- ${i % 2 === 1 ? "layout-desktop-flex-row-reverse" : "layout-"}layout- `}>
                  <span className="layout-flex layout-size-12 layout-shrink-0 layout-items-center layout-justify-center layout-bg-bs-navy layout-font-display layout-text-sm layout-font-bold layout-text-bs-teal-bright">
                    {s.n}
                  </span>
                  <h3 className="layout-font-display layout-text-xl layout-font-bold layout-text-bs-ink">{s.title}</h3>
                </div>
                <p className={`layout-mt-4 layout-max-w-md layout-leading-relaxed layout-text-bs-muted layout- ${i % 2 === 1 ? "layout-desktop-ml-auto" : "layout-"}layout- `}>
                  {s.body}
                </p>
              </div>
              <div className="layout-desktop-block" />
            </div>
          )}
        </div>
      </div>

      <div id="examples" className="layout-mt-20 layout-overflow-hidden layout-border layout-border-bs-line layout-bg-bs-paper layout-shadow-bs-glow">
        <div className="layout-flex layout-items-center layout-gap-2 layout-border-b layout-border-bs-line layout-bg-bs-sand layout-px-5 layout-py-3">
          <span className="layout-size-2-5 layout-rounded-full layout-bg-destructive-60" />
          <span className="layout-size-2-5 layout-rounded-full layout-bg-chart-4-70" />
          <span className="layout-size-2-5 layout-rounded-full layout-bg-bs-teal-70" />
          <span className="layout-ml-3 layout-text-xs layout-font-medium layout-text-bs-muted">
            BizSite example — services, quote form &amp; lead capture built in
          </span>
        </div>
        <img
          src={mockupImg}
          alt="Example BizSite website for a landscaping company with a hero section, service cards, and a quote request form"
          loading="lazy"
          width={1536}
          height={1024}
          className="layout-w-full content-image" />
        
      </div>
      <p className="layout-mt-6 layout-text-center layout-text-sm layout-text-bs-muted">
        Every BizSite is designed around your business, your services, and your customers.
      </p>
    </Section>);

}

const features = [
{
  icon: MonitorSmartphone,
  title: "Professional Design",
  body: "A clean, modern, mobile-friendly website that makes your business look credible.",
  large: true
},
{
  icon: PenLine,
  title: "Website Copy Included",
  body: "Tell us about your business and we'll help turn it into clear, professional website content."
},
{
  icon: MousePointerClick,
  title: "Lead Capture",
  body: "Capture quote requests, inquiries, consultations, appointments, and contact information."
},
{
  icon: Inbox,
  title: "Leads Sent to You",
  body: "New inquiries can go directly to your email or connect with your existing workflow."
},
{
  icon: Search,
  title: "SEO",
  body: "Help customers discover your business when they're searching online."
},
{
  icon: ShieldCheck,
  title: "Hosting & Security",
  body: "We handle the technical side so you don't have to."
},
{
  icon: LifeBuoy,
  title: "Ongoing Support",
  body: "Your website doesn't become another thing you have to manage yourself.",
  large: true
}];


function Features() {
  return (
    <Section id="features" className="layout-bg-bs-paper">
      <div className="layout-flex layout-flex-wrap layout-items-end layout-justify-between layout-gap-6">
        <div className="layout-max-w-2xl">
          <Eyebrow>What's included</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
            Everything Your Small Business Website Needs
          </h2>
        </div>
        <p className="layout-max-w-xs layout-text-sm layout-leading-relaxed layout-text-bs-muted">
          One plan covers the whole job — strategy, content, design, and the technical plumbing behind it.
        </p>
      </div>

      <div className="layout-mt-12 layout-grid layout-gap-4 layout-tablet-grid-cols-2 layout-desktop-grid-cols-4">
        {features.map(({ icon: Icon, title, body, large }) =>
        <div
          key={title}
          className={`layout-group layout-border layout-border-bs-line layout-bg-bs-paper layout-p-7 layout-shadow-bs-card layout- ${
          large ? "layout-tablet-col-span-2" : "layout-"}layout- `
          }>
          
            <span className="layout-flex layout-size-11 layout-items-center layout-justify-center layout-bg-bs-navy layout-text-bs-teal-bright">
              <Icon className="layout-size-5" />
            </span>
            <h3 className="layout-mt-5 layout-font-display layout-text-lg layout-font-bold layout-text-bs-ink">{title}</h3>
            <p className="layout-mt-2 layout-text-sm layout-leading-relaxed layout-text-bs-muted">{body}</p>
          </div>
        )}
      </div>
    </Section>);

}

const industries = [
{
  icon: Wrench,
  title: "Contractors & Home Services",
  body: "Roofers • HVAC • Plumbers • Electricians • Landscapers • Handymen • Cleaning Companies"
},
{
  icon: HardHat,
  title: "Construction & Excavation",
  body: "General Contractors • Excavation • Site Prep • Land Clearing • Septic • Paving • Concrete • Demolition"
},
{
  icon: UtensilsCrossed,
  title: "Restaurants & Hospitality",
  body: "Restaurants • Cafés • Catering • Event Venues • Hospitality Businesses"
},
{
  icon: Scale,
  title: "Professional Services",
  body: "Law Firms • Accountants • Consultants • Insurance Agencies • Real Estate • Property Management"
},
{
  icon: CalendarCheck,
  title: "Appointments & Local Services",
  body: "Med Spas • Salons • Barbers • Dental Offices • Auto Shops • Pet Services"
},
{
  icon: Rocket,
  title: "Entrepreneurs & New Businesses",
  body: "Startups • Solopreneurs • Coaches • Consultants • New Local Businesses"
}];


function Industries() {
  return (
    <div className="layout-overflow-hidden layout-bg-bs-navy-deep layout-text-bs-on-dark">
      






      
      
      <Section className="">
        <div className="layout-max-w-2xl">
          <Eyebrow dark>Who it's for</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-5xl">
            Built for Small Businesses That Need to Get Found
          </h2>
        </div>

        <div className="layout-mt-12 layout-divide-y layout-divide-bs-dark-line layout-border-y layout-border-bs-dark-line">
          {industries.map(({ icon: Icon, title, body }) =>
          <div
            key={title}
            className="layout-group layout-grid layout-items-center layout-gap-3 layout-py-6 layout-tablet-grid-cols-auto-1fr-2fr layout-tablet-gap-8 layout-tablet-px-4">
            
              <span className="layout-flex layout-size-11 layout-items-center layout-justify-center layout-border layout-border-bs-dark-line layout-text-bs-teal-bright">
                <Icon className="layout-size-5" />
              </span>
              <h3 className="layout-font-display layout-text-lg layout-font-bold">{title}</h3>
              <p className="layout-text-sm layout-leading-relaxed layout-text-bs-on-dark-muted">{body}</p>
            </div>
          )}
        </div>

        <p className="layout-mt-10 layout-max-w-3xl layout-font-display layout-text-xl layout-font-bold layout-leading-relaxed layout-tablet-text-2xl">
          If people search for your business online before deciding whether to call, visit, or buy —{" "}
          <span className="layout-text-bs-teal-bright">your website matters.</span>
        </p>
      </Section>
    </div>);

}

const scenarios = [
{
  title: "I Don't Have a Website",
  body: "We'll help you establish a professional online presence without having to figure everything out yourself."
},
{
  title: "My Website Is Outdated",
  body: "We'll replace your old site with something modern, mobile-friendly, and easier for customers to use."
},
{
  title: "My Website Doesn't Generate Leads",
  body: "We'll build stronger calls to action, lead forms, and conversion paths into your site."
},
{
  title: "I'm Starting a New Business",
  body: "Give your new business a professional online home from day one."
},
{
  title: "I Want More Google Traffic",
  body: "Add ongoing SEO, service pages, location pages, and content to help grow your visibility."
}];


function Scenarios() {
  return (
    <Section className="layout-bg-bs-sand">
      <div className="layout-grid layout-items-start layout-gap-12 layout-desktop-grid-cols-0-9fr-1-1fr">
        <div className="">
          <Eyebrow>Where you're at</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
            Starting From Scratch or Starting Over?
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-leading-relaxed layout-text-bs-muted">
            Wherever your website is today, there's a BizSite path forward.
          </p>
          <div className="layout-mt-8">
            <CTAButtons />
          </div>
        </div>
        <div className="layout-space-y-4">
          {scenarios.map((s) =>
          <div
            key={s.title}
            className="layout-border-l-4 layout-border-bs-teal layout-bg-bs-paper layout-p-6 layout-shadow-bs-card">
            
              <h3 className="layout-font-display layout-text-lg layout-font-bold layout-text-bs-ink">{s.title}</h3>
              <p className="layout-mt-2 layout-text-sm layout-leading-relaxed layout-text-bs-muted">{s.body}</p>
            </div>
          )}
        </div>
      </div>
    </Section>);

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
  "1 hour of updates each month"]

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
  "Ongoing website support"]

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
  "2 hours of updates each month"]

}];


function Pricing() {
  return (
    <Section id="pricing" className="layout-bg-bs-paper">
      <div className="layout-text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
          Simple Website Packages
        </h2>
      </div>

      <div className="layout-mt-14 layout-grid layout-items-start layout-gap-5 layout-desktop-grid-cols-3">
        {plans.map((p) =>
        <div
          key={p.name}
          className={`layout-border layout-p-8 layout- ${
          p.featured ?
          "layout-border-bs-teal layout-bg-bs-navy-deep layout-text-bs-on-dark layout-shadow-bs-glow layout-desktop-pb-12" :
          "layout-border-bs-line layout-bg-bs-paper layout-shadow-bs-card"}layout- `
          }>
          
            {p.featured &&
          <span className="layout-bg-bs-teal-bright layout-px-3 layout-py-1 layout-text-11px layout-font-bold layout-uppercase layout-text-bs-navy-deep">
                Most popular
              </span>
          }
            <h3 className="layout-font-display layout-text-lg layout-font-bold">{p.name}</h3>
            <div className="layout-mt-4 layout-flex layout-items-end layout-gap-1">
              <span className="layout-font-display layout-text-5xl layout-font-extrabold">{p.price}</span>
              <span className={p.featured ? "layout-mb-1 layout-text-sm layout-text-bs-on-dark-muted" : "layout-mb-1 layout-text-sm layout-text-bs-muted"}>
                /month
              </span>
            </div>
            <p className={`layout-mt-1 layout-text-sm layout-font-medium layout- ${p.featured ? "layout-text-bs-on-dark-muted" : "layout-text-bs-muted"}layout- `}>
              {p.setup}
            </p>
            <p className={`layout-mt-4 layout-text-sm layout- ${p.featured ? "layout-text-bs-on-dark-muted" : "layout-text-bs-muted"}layout- `}>
              {p.blurb}
            </p>
            <a
            href="#contact"
            className={`layout-mt-6 layout-flex layout-w-full layout-items-center layout-justify-center layout-gap-2 layout-px-6 layout-py-3 layout-text-sm layout-font-bold layout- ${
            p.featured ?
            "layout-bg-bs-teal-bright layout-text-bs-navy-deep" :
            "layout-bg-bs-navy layout-text-bs-on-dark"}layout- `
            }>
            
              {p.cta} <ArrowRight className="layout-size-4" />
            </a>
            {p.intro && <p className="layout-mt-7 layout-text-sm layout-font-semibold layout-text-bs-teal-bright">{p.intro}</p>}
            <ul className={`layout-mt-6 layout-space-y-3 layout-text-sm layout- ${p.featured ? "layout-text-bs-on-dark" : "layout-text-bs-ink"}layout- `}>
              {p.features.map((f) =>
            <li key={f} className="layout-flex layout-items-start layout-gap-2-5">
                  <Check className={`layout-mt-0-5 layout-size-4 layout-shrink-0 layout- ${p.featured ? "layout-text-bs-teal-bright" : "layout-text-bs-teal"}layout- `} />
                  {f}
                </li>
            )}
            </ul>
          </div>
        )}
      </div>

      <div className="layout-mt-14 layout-border layout-border-bs-line layout-bg-bs-sand layout-p-8 layout-text-center layout-shadow-bs-card">
        <h3 className="layout-font-display layout-text-xl layout-font-bold layout-text-bs-ink">Make Your BizSite Even Smarter</h3>
        <p className="layout-mt-2 layout-text-sm layout-text-bs-muted">Add what your business needs:</p>
        <div className="layout-mt-6 layout-flex layout-flex-wrap layout-justify-center layout-gap-2">
          {[
          "Additional Pages", "CRM Integration", "Email Follow-Up", "SMS Lead Alerts",
          "Advanced Chatbot", "Landing Pages", "Lead Magnets", "Advanced SEO",
          "Review Requests", "Analytics"].
          map((a) =>
          <span
            key={a}
            className="layout-border layout-border-bs-line layout-bg-bs-paper layout-px-4 layout-py-2 layout-text-sm layout-font-semibold layout-text-bs-ink">
            
              {a}
            </span>
          )}
        </div>
      </div>
    </Section>);

}

function MoreThan() {
  const flow = ["Get Found", "Build Trust", "Capture Interest", "Generate Leads", "Help You Grow"];
  return (
    <Section className="layout-bg-bs-sand">
      <div className="layout-grid layout-items-center layout-gap-12 layout-desktop-grid-cols-2">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
            More Than Just a Website
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-text-bs-muted">
            A traditional website project often ends when the site launches.
          </p>
          <p className="layout-mt-2 layout-text-lg layout-font-semibold layout-text-bs-ink">
            That's when BizSite starts working.
          </p>
          <p className="layout-mt-6 layout-text-bs-muted">
            And KGHQ stays behind it with hosting, updates, support, SEO options, content, and growth tools.
          </p>
          <div className="layout-mt-8 layout-flex layout-items-center layout-gap-3 layout-text-sm layout-font-semibold layout-text-bs-muted">
            <Building2 className="layout-size-5 layout-text-bs-teal" /> Fully managed by KGHQ
          </div>
        </div>

        <div className="layout-border layout-border-bs-line layout-bg-bs-paper layout-p-8 layout-shadow-bs-glow">
          <p className="layout-text-xs layout-font-bold layout-uppercase layout-text-bs-muted">
            Your website can
          </p>
          <div className="layout-mt-6 layout-space-y-0">
            {flow.map((f, i) =>
            <div key={f} className="layout-flex layout-items-center layout-gap-4 layout-pb-6 layout-last-pb-0">
                {i < flow.length - 1

              }
                <span className="layout-flex layout-size-8 layout-shrink-0 layout-items-center layout-justify-center layout-bg-bs-navy layout-font-display layout-text-xs layout-font-bold layout-text-bs-teal-bright">
                  {i + 1}
                </span>
                <div className="layout-flex-1 layout-border layout-border-bs-line layout-bg-bs-sand layout-px-4 layout-py-3 layout-text-sm layout-font-bold layout-text-bs-ink">
                  {f}
                </div>
                <Compass className="layout-size-4 layout-text-bs-teal" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>);

}

const faqs = [
{
  q: "Do I have to write the website myself?",
  a: "No. Tell us about your business and we'll help create the messaging and website content."
},
{
  q: "I already have a website. Can you replace it?",
  a: "Yes. BizSite can replace an outdated or underperforming website with a new one."
},
{
  q: "Does hosting come with it?",
  a: "Yes. Hosting is included with every BizSite plan."
},
{
  q: "Can customers contact me through the website?",
  a: "Yes. We can build forms for inquiries, quote requests, consultations, appointments, and other actions."
},
{
  q: "Can leads go into my CRM?",
  a: "Yes. CRM integrations and other automated workflows can be added."
},
{
  q: "Can you help me show up on Google?",
  a: "Yes. Growth includes foundational SEO support, while Scale is designed for businesses that want ongoing SEO and content."
},
{
  q: "Can I add pages later?",
  a: "Absolutely. Your BizSite can grow as your business grows."
},
{
  q: "What happens when I need something changed?",
  a: "Your monthly plan includes ongoing support. Additional design, development, content, or marketing work can also be added as needed."
}];


function FAQ() {
  return (
    <Section id="faq" className="layout-bg-bs-paper">
      <div className="layout-grid layout-items-start layout-gap-12 layout-desktop-grid-cols-0-8fr-1-2fr">
        <div className="">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="layout-mt-5 layout-font-display layout-text-4xl layout-font-extrabold layout-text-bs-ink layout-tablet-text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-text-bs-muted">
            Everything small business owners usually ask us before getting started.
          </p>
        </div>
        <div className="layout-space-y-3">
          {faqs.map((f) =>
          <details key={f.q} className="layout-group layout-border layout-border-bs-line layout-bg-bs-paper layout-p-6 layout-shadow-bs-card layout-faq-item" open>
              <summary className="layout-flex layout-cursor-pointer layout-list-none layout-items-center layout-justify-between layout-gap-4 layout-font-display layout-font-bold layout-text-bs-ink">
                {f.q}
                <span className="layout-text-bs-teal">+</span>
              </summary>
              <p className="layout-mt-4 layout-leading-relaxed layout-text-bs-muted">{f.a}</p>
            </details>
          )}
        </div>
      </div>
    </Section>);

}

function FinalCTA() {
  return (
    <div id="contact" className="layout-overflow-hidden layout-bg-bs-navy-deep layout-text-bs-on-dark">
      






      
      
      <Section className="layout-text-center">
        <h2 className="layout-mx-auto layout-max-w-3xl layout-font-display layout-text-4xl layout-font-extrabold layout-tablet-text-6xl">
          Your Business Deserves a <span className="layout-text-bs-gradient">Better Website.</span>
        </h2>
        <p className="layout-mx-auto layout-mt-6 layout-max-w-2xl layout-text-lg layout-text-bs-on-dark-muted">
          Look professional. Get found. Capture leads. Grow your business.
        </p>
        <p className="layout-mt-4 layout-font-display layout-text-xl layout-font-bold">You run your business. We'll handle the website.</p>
        <div className="layout-mt-10 layout-flex layout-justify-center">
          <CTAButtons light />
        </div>
      </Section>
    </div>);

}



function BizSite() {
  return (
    <main className="layout-bg-bs-paper layout-font-body layout-text-bs-ink layout-antialiased">
      
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
      
    </main>);

}