import { createFileRoute } from "@tanstack/react-router";
import {
  PhoneCall, Clock, UserPlus, CalendarCheck, FileText, ArrowRight, Sparkles,
  MessageSquare, ShieldCheck, Check, Phone, Moon, Layers, PhoneForwarded,
  Wrench, Scale, Stethoscope, Workflow, Mail, ListChecks, HelpCircle } from
"lucide-react";
import heroImg from "@/assets/hero-owner.jpg";
import phoneImg from "@/assets/app-call-summary.png";
import dashboardImg from "@/assets/dashboard.png";
import wavesImg from "@/assets/texture-waves.jpg";

export const Route = createFileRoute("/bizphone")({
  component: Index,
  head: () => ({
    meta: [
    { title: "BizPhone by KGHQ — AI Receptionist That Answers Every Call" },
    {
      name: "description",
      content:
      "BizPhone is your AI-powered front desk. It answers calls 24/7, captures leads, books appointments, routes urgent calls, and sends you a clean summary."
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:title", content: "BizPhone by KGHQ — Never Miss a Customer Call Again" },
    {
      property: "og:description",
      content:
      "AI call answering, lead capture, appointment booking, smart routing, and call summaries — set up and managed by KGHQ."
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
    <section id={id} className={`layout-py-24 layout-px-6 layout- ${className}layout- `}>
      <div className="layout-mx-auto layout-max-w-6xl">{children}</div>
    </section>);

}

function Eyebrow({ children }: {children: React.ReactNode;}) {
  return (
    <span className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-border-primary-20 layout-bg-accent layout-px-4 layout-py-1-5 layout-text-xs layout-font-semibold layout-uppercase layout-text-accent-foreground">
      <Sparkles className="layout-size-3-5" /> {children}
    </span>);

}

function CTAButtons({ light = false }: {light?: boolean;}) {
  return (
    <div className="layout-flex layout-flex-wrap layout-items-center layout-gap-3">
      <a
        href="#pricing"
        className={`layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout- ${
        light ?
        "layout-bg-white layout-text-primary layout-shadow-glow" :
        "layout-text-primary-foreground layout-shadow-glow"}layout- `
        }>
        
        Get BizPhone <ArrowRight className="layout-size-4" />
      </a>
      <a
        href="#contact"
        className={`layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout- ${
        light ?
        "layout-border-white-40 layout-text-white" :
        "layout-border-border layout-text-foreground"}layout- `
        }>
        
        <PhoneCall className="layout-size-4" /> Hear a Demo
      </a>
    </div>);

}

/* ---------- sections ---------- */



function Hero() {
  return (
    <section className="layout-page-section layout-overflow-hidden layout-bg-foreground layout-hero">
      <div className="">
        <img src={heroImg} alt="Small business owner taking a call from his work van" width={1536} height={1024} className="layout-size-full layout-object-cover content-image" />
        
      </div>

      <div className="layout-mx-auto layout-grid layout-max-w-6xl layout-items-center layout-gap-12 layout-px-6 layout-pb-24 layout-pt-20 layout-desktop-grid-cols-1-15fr-0-85fr layout-desktop-pb-28 layout-desktop-pt-24">
        <div className="layout-text-white">
          <span className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-border-white-20 layout-bg-white-10 layout-px-4 layout-py-1-5 layout-text-xs layout-font-semibold layout-uppercase">
            <Sparkles className="layout-size-3-5" /> AI Reception Phone by KGHQ
          </span>
          <h1 className="layout-mt-6 layout-text-5xl layout-font-black layout-leading-1-02 layout-tablet-text-6xl layout-desktop-text-7xl">
            Never Miss a<br />
            <span className="">
              Customer Call
            </span>{" "}
            Again
          </h1>
          <p className="layout-mt-6 layout-max-w-xl layout-text-xl layout-font-semibold layout-text-white-95">
            BizPhone is your AI-powered front desk.
          </p>
          <p className="layout-mt-3 layout-max-w-xl layout-text-lg layout-leading-relaxed layout-text-white-75">
            It answers calls, helps customers, captures leads, books appointments, and sends you a
            summary — 24/7.
          </p>
          <p className="layout-mt-3 layout-max-w-xl layout-text-base layout-text-white-60">
            Use it for every call, after hours, or simply when you can't answer.
          </p>
          <div className="layout-mt-10">
            <CTAButtons light />
          </div>
          <div className="layout-mt-10 layout-flex layout-flex-wrap layout-gap-x-8 layout-gap-y-3 layout-text-sm layout-text-white-70">
            {["Answers 24/7", "Works with your current number", "Set up & managed by KGHQ"].map((t) =>
            <span key={t} className="layout-inline-flex layout-items-center layout-gap-2">
                <Check className="layout-size-4 layout-text-oklch-0-8-0-16-300" /> {t}
              </span>
            )}
          </div>
        </div>

        <div className="layout-mx-auto layout-w-full layout-max-w-sm">
          
          <img
            src={phoneImg}
            alt="BizPhone app showing an incoming call and an AI-generated call summary"
            width={1024}
            height={1024}
            className="layout-w-full content-image" />
          
        </div>
      </div>
    </section>);

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
{ icon: Mail, label: "Trigger text or email follow-up" }];


function Problem() {
  return (
    <Section id="problem">
      <div className="layout-grid layout-items-start layout-gap-14 layout-desktop-grid-cols-2">
        <div className="">
          <Eyebrow>The reality</Eyebrow>
          <h2 className="layout-mt-5 layout-text-4xl layout-font-black layout-tablet-text-5xl">
            You're Busy. Your Customers Are Still Calling.
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-leading-relaxed layout-text-muted-foreground">
            You're working. Driving. With another customer. On a job site. Or just trying to run
            your business.
          </p>
          <p className="layout-mt-4 layout-border-l-2 layout-border-primary layout-pl-5 layout-text-lg layout-font-semibold layout-text-foreground">
            When you don't answer, your next customer may simply call someone else.
          </p>
          <p className="layout-mt-6 layout-text-2xl layout-font-black layout-text-gradient-primary">BizPhone answers for you.</p>
        </div>

        <div className="layout-grid layout-gap-3 layout-tablet-grid-cols-2">
          {capabilities.map(({ icon: Icon, label }) =>
          <div
            key={label}
            className="layout-group layout-flex layout-items-center layout-gap-3 layout-rounded-2xl layout-border layout-border-border layout-bg-card layout-p-4 layout-shadow-card">
            
              <span className="layout-flex layout-size-9 layout-shrink-0 layout-items-center layout-justify-center layout-rounded-xl layout-bg-accent layout-text-accent-foreground">
                <Icon className="layout-size-4-5" />
              </span>
              <span className="layout-text-sm layout-font-semibold">{label}</span>
            </div>
          )}
        </div>
      </div>
    </Section>);

}

const modes = [
{
  icon: PhoneCall,
  title: "Every Call",
  body: "Let BizPhone act as your primary front desk and handle incoming calls automatically."
},
{
  icon: PhoneForwarded,
  title: "When You Can't Answer",
  body: "Keep answering your own phone. If you don't pick up, BizPhone steps in so the customer never hits voicemail.",
  note: "Great for owner-operated businesses and small teams."
},
{
  icon: Moon,
  title: "After Hours",
  body: "You handle calls during the day. BizPhone handles nights, weekends, holidays, and other times you're closed."
},
{
  icon: Layers,
  title: "Overflow",
  body: "When your team is busy or already on the phone, BizPhone picks up the extra calls."
}];


function Modes() {
  return (
    <div className="layout-overflow-hidden layout-bg-foreground layout-text-white">
      
      
      <Section id="modes" className="">
        <div className="layout-max-w-2xl">
          <span className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-border-white-20 layout-bg-white-10 layout-px-4 layout-py-1-5 layout-text-xs layout-font-semibold layout-uppercase">
            Flexible by design
          </span>
          <h2 className="layout-mt-5 layout-text-4xl layout-font-black layout-tablet-text-5xl">
            Choose How BizPhone Answers
          </h2>
        </div>
        <div className="layout-mt-12 layout-grid layout-gap-4 layout-tablet-grid-cols-2">
          {modes.map(({ icon: Icon, title, body, note }) =>
          <div
            key={title}
            className="layout-rounded-3xl layout-border layout-border-white-12 layout-bg-white-0-06 layout-p-7">
            
              <span className="layout-flex layout-size-11 layout-items-center layout-justify-center layout-rounded-2xl layout-bg-white-10">
                <Icon className="layout-size-5" />
              </span>
              <h3 className="layout-mt-5 layout-text-xl layout-font-bold">{title}</h3>
              <p className="layout-mt-3 layout-text-white-70">{body}</p>
              {note && <p className="layout-mt-3 layout-text-sm layout-font-medium layout-text-oklch-0-82-0-14-300">{note}</p>}
            </div>
          )}
        </div>
        <p className="layout-mt-10 layout-text-xl layout-font-bold">
          You stay in control. <span className="layout-text-white-60">BizPhone fills the gaps.</span>
        </p>
      </Section>
    </div>);

}

const steps = [
{
  n: "01",
  title: "We Learn Your Business",
  body: "Tell us about your services, hours, FAQs, pricing, scheduling, and how you want different calls handled."
},
{
  n: "02",
  title: "We Build Your BizPhone",
  body: "KGHQ creates your AI receptionist, call flow, questions, routing, and follow-up process."
},
{
  n: "03",
  title: "BizPhone Answers",
  body: "Customers call your existing number or a dedicated BizPhone number. Your AI assistant answers and handles the conversation."
},
{
  n: "04",
  title: "You Get the Details",
  body: "Receive a simple summary including who called, what they need, urgency, contact information, and what should happen next."
}];


function HowItWorks() {
  return (
    <Section id="how">
      <div className="layout-text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="layout-mx-auto layout-mt-5 layout-max-w-2xl layout-text-4xl layout-font-black layout-tablet-text-5xl">
          Live in Days, Not Months
        </h2>
      </div>
      <div className="layout-mt-14 layout-grid layout-gap-4 layout-tablet-grid-cols-2 layout-desktop-grid-cols-4">
        {steps.map((s) =>
        <div key={s.n} className="layout-rounded-3xl layout-border layout-border-border layout-bg-card layout-p-7 layout-shadow-card">
            <span className="layout-text-4xl layout-font-black layout-text-primary-20">{s.n}</span>
            <h3 className="layout-mt-3 layout-text-lg layout-font-bold">{s.title}</h3>
            <p className="layout-mt-3 layout-text-sm layout-leading-relaxed layout-text-muted-foreground">{s.body}</p>
          </div>
        )}
      </div>

      <div className="layout-mt-16 layout-overflow-hidden layout-rounded-2rem layout-border layout-border-border layout-bg-card layout-shadow-glow">
        <div className="layout-flex layout-items-center layout-gap-2 layout-border-b layout-border-border layout-bg-secondary layout-px-5 layout-py-3">
          <span className="layout-size-2-5 layout-rounded-full layout-bg-destructive-60" />
          <span className="layout-size-2-5 layout-rounded-full layout-bg-chart-4-70" />
          <span className="layout-size-2-5 layout-rounded-full layout-bg-chart-2-70" />
          <span className="layout-ml-3 layout-text-xs layout-font-medium layout-text-muted-foreground">
            BizPhone — call log, leads &amp; AI transcript
          </span>
        </div>
        <img
          src={dashboardImg}
          alt="BizPhone dashboard showing call logs, captured leads, call volume, and an AI transcript"
          loading="lazy"
          width={1536}
          height={1024}
          className="layout-w-full content-image" />
        
      </div>
      <p className="layout-mt-6 layout-text-center layout-text-sm layout-text-muted-foreground">
        Get it by email, text, CRM, ClickUp, Google Sheets, or another workflow.
      </p>
    </Section>);

}

const industries = [
{
  icon: Wrench,
  title: "Contractors & Home Services",
  body: "Roofers • HVAC • Plumbers • Electricians • Landscapers • Handymen"
},
{
  icon: Scale,
  title: "Professional Services",
  body: "Law Firms • Consultants • Accountants • Real Estate"
},
{
  icon: Stethoscope,
  title: "Appointments & Local Businesses",
  body: "Med Spas • Salons • Clinics • Dentists • Local Franchises"
}];


function Industries() {
  return (
    <Section className="layout-bg-secondary-60">
      <div className="layout-text-center">
        <Eyebrow>Who it's for</Eyebrow>
        <h2 className="layout-mx-auto layout-mt-5 layout-max-w-3xl layout-text-4xl layout-font-black layout-tablet-text-5xl">
          Built for Small Businesses That Run on the Phone
        </h2>
      </div>
      <div className="layout-mt-12 layout-grid layout-gap-4 layout-tablet-grid-cols-3">
        {industries.map(({ icon: Icon, title, body }) =>
        <div key={title} className="layout-rounded-3xl layout-border layout-border-border layout-bg-card layout-p-8 layout-shadow-card">
            <span className="layout-flex layout-size-12 layout-items-center layout-justify-center layout-rounded-2xl layout-text-primary-foreground">
              <Icon className="layout-size-5" />
            </span>
            <h3 className="layout-mt-5 layout-text-lg layout-font-bold">{title}</h3>
            <p className="layout-mt-2 layout-text-sm layout-leading-relaxed layout-text-muted-foreground">{body}</p>
          </div>
        )}
      </div>
      <p className="layout-mt-10 layout-text-center layout-text-xl layout-font-bold">
        If a phone call can turn into revenue, <span className="layout-text-gradient-primary">BizPhone can help.</span>
      </p>
    </Section>);

}

function MoreThan() {
  const flow = ["Answer", "Qualify", "Book", "Route", "Follow Up", "Update CRM"];
  return (
    <Section>
      <div className="layout-grid layout-items-center layout-gap-12 layout-desktop-grid-cols-2">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <h2 className="layout-mt-5 layout-text-4xl layout-font-black layout-tablet-text-5xl">
            More Than an Answering Service
          </h2>
          <p className="layout-mt-5 layout-text-lg layout-text-muted-foreground">
            Traditional answering services take messages.
          </p>
          <p className="layout-mt-2 layout-text-lg layout-font-semibold layout-text-foreground">
            BizPhone can actually do something with the call.
          </p>
          <p className="layout-mt-6 layout-text-muted-foreground">
            And because KGHQ sets up and manages the system, you don't have to figure out the AI,
            phone system, integrations, or automations yourself.
          </p>
          <div className="layout-mt-8 layout-flex layout-items-center layout-gap-3 layout-text-sm layout-font-semibold layout-text-muted-foreground">
            <ShieldCheck className="layout-size-5 layout-text-primary" /> Fully managed by KGHQ
          </div>
        </div>

        <div className="layout-rounded-2rem layout-border layout-border-border layout-bg-card layout-p-8 layout-shadow-glow">
          <p className="layout-text-xs layout-font-semibold layout-uppercase layout-text-muted-foreground">
            Depending on your setup
          </p>
          <div className="layout-mt-6 layout-space-y-3">
            {flow.map((f, i) =>
            <div key={f} className="layout-flex layout-items-center layout-gap-4">
                <span className="layout-flex layout-size-8 layout-shrink-0 layout-items-center layout-justify-center layout-rounded-full layout-text-xs layout-font-bold layout-text-primary-foreground">
                  {i + 1}
                </span>
                <div className="layout-flex-1 layout-rounded-xl layout-bg-secondary layout-px-4 layout-py-3 layout-text-sm layout-font-bold">{f}</div>
                {i < flow.length - 1 && <Workflow className="layout-size-4 layout-text-primary-40" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>);

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
  "Monthly review"]

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
  "Monthly optimization"]

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
  "Ongoing optimization"]

}];


function Pricing() {
  return (
    <Section id="pricing" className="layout-bg-secondary-60">
      <div className="layout-text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="layout-mt-5 layout-text-4xl layout-font-black layout-tablet-text-5xl">Simple Pricing</h2>
      </div>

      <div className="layout-mt-14 layout-grid layout-items-start layout-gap-5 layout-desktop-grid-cols-3">
        {plans.map((p) =>
        <div
          key={p.name}
          className={`layout-rounded-2rem layout-border layout-p-8 layout- ${
          p.featured ?
          "layout-border-primary-30 layout-bg-foreground layout-text-white layout-shadow-glow layout-desktop-pb-12" :
          "layout-border-border layout-bg-card layout-shadow-card"}layout- `
          }>
          
            {p.featured &&
          <span className="layout-rounded-full layout-px-3 layout-py-1 layout-text-11px layout-font-bold layout-uppercase layout-text-primary-foreground">
                Most popular
              </span>
          }
            <h3 className="layout-text-lg layout-font-bold">{p.name}</h3>
            <div className="layout-mt-4 layout-flex layout-items-end layout-gap-1">
              <span className="layout-text-4xl layout-font-black">{p.price}</span>
              <span className={p.featured ? "layout-mb-1 layout-text-sm layout-text-white-60" : "layout-mb-1 layout-text-sm layout-text-muted-foreground"}>
                /month
              </span>
            </div>
            <p className={`layout-mt-1 layout-text-sm layout-font-medium layout- ${p.featured ? "layout-text-white-60" : "layout-text-muted-foreground"}layout- `}>
              {p.setup}
            </p>
            <p className={`layout-mt-4 layout-text-sm layout- ${p.featured ? "layout-text-white-75" : "layout-text-muted-foreground"}layout- `}>
              {p.blurb}
            </p>
            <a
            href="#contact"
            className={`layout-mt-6 layout-flex layout-w-full layout-items-center layout-justify-center layout-gap-2 layout-rounded-full layout-px-6 layout-py-3 layout-text-sm layout-font-bold layout- ${
            p.featured ?
            "layout-bg-white layout-text-primary" :
            "layout-text-primary-foreground"}layout- `
            }>
            
              {p.cta} <ArrowRight className="layout-size-4" />
            </a>
            {p.intro && <p className="layout-mt-7 layout-text-sm layout-font-semibold layout-text-white-80">{p.intro}</p>}
            <ul className={`layout-mt-6 layout-space-y-3 layout-text-sm layout- ${p.featured ? "layout-text-white-85" : "layout-text-foreground-80"}layout- `}>
              {p.features.map((f) =>
            <li key={f} className="layout-flex layout-items-start layout-gap-2-5">
                  <Check className={`layout-mt-0-5 layout-size-4 layout-shrink-0 layout- ${p.featured ? "layout-text-oklch-0-82-0-14-300" : "layout-text-primary"}layout- `} />
                  {f}
                </li>
            )}
            </ul>
          </div>
        )}
      </div>

      <div className="layout-mt-14 layout-rounded-2rem layout-border layout-border-border layout-bg-card layout-p-8 layout-text-center layout-shadow-card">
        <h3 className="layout-text-xl layout-font-black">Add What You Need</h3>
        <p className="layout-mt-2 layout-text-sm layout-text-muted-foreground">Customize BizPhone with:</p>
        <div className="layout-mt-6 layout-flex layout-flex-wrap layout-justify-center layout-gap-2">
          {[
          "Calendar Booking", "CRM Integration", "SMS Follow-Up", "Bilingual Answering",
          "Lead Nurturing", "Review Requests", "Outbound Reminders", "Custom Automations"].
          map((a) =>
          <span key={a} className="layout-rounded-full layout-border layout-border-primary-20 layout-bg-accent layout-px-4 layout-py-2 layout-text-sm layout-font-semibold layout-text-accent-foreground">
              {a}
            </span>
          )}
        </div>
      </div>
    </Section>);

}

function Value() {
  return (
    <Section>
      <div className="layout-overflow-hidden layout-rounded-2-5rem layout-px-8 layout-py-16 layout-text-center layout-text-primary-foreground layout-shadow-glow">
        <h2 className="layout-mx-auto layout-max-w-2xl layout-text-4xl layout-font-black layout-tablet-text-5xl">
          What Is a Missed Call Worth?
        </h2>
        <p className="layout-mx-auto layout-mt-6 layout-max-w-2xl layout-text-lg layout-text-primary-foreground-85">
          If one new customer is worth $500, $1,000, $5,000 or more, one answered call could pay for
          BizPhone.
        </p>
        <div className="layout-mt-10 layout-flex layout-flex-wrap layout-justify-center layout-gap-4">
          {["$500", "$1,000", "$5,000+"].map((v) =>
          <span key={v} className="layout-rounded-2xl layout-bg-white-15 layout-px-8 layout-py-5 layout-text-3xl layout-font-black">
              {v}
            </span>
          )}
        </div>
        <p className="layout-mx-auto layout-mt-10 layout-max-w-xl layout-text-primary-foreground-85">
          You don't need another employee sitting by the phone.
        </p>
        <p className="layout-mt-2 layout-text-xl layout-font-bold">You need to make sure someone answers.</p>
      </div>
    </Section>);

}

const faqs = [
{
  q: "Do I need a new phone number?",
  a: "Not necessarily. In many cases, we can connect BizPhone to your existing number through call forwarding or routing."
},
{ q: "Can I still answer my own calls?", a: "Absolutely. BizPhone can answer every call or only step in when you don't answer." },
{
  q: "Can it answer after hours?",
  a: "Yes. You can have BizPhone answer only during evenings, weekends, holidays, or whenever your business is closed."
},
{
  q: "Can BizPhone book appointments?",
  a: "Yes. Depending on your setup, BizPhone can collect appointment requests or connect directly with your scheduling workflow."
},
{
  q: "Can it answer questions about my business?",
  a: "Yes. We customize BizPhone around your services, hours, locations, FAQs, policies, and preferred responses."
},
{ q: "What if someone needs a real person?", a: "We can create rules to transfer or escalate certain calls to you or your team." },
{
  q: "Will people know it's AI?",
  a: "BizPhone is designed to sound natural and professional. We can also identify it as a virtual assistant depending on your preference and requirements."
}];


function FAQ() {
  return (
    <Section id="faq" className="layout-bg-secondary-60">
      <div className="layout-text-center">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="layout-mt-5 layout-text-4xl layout-font-black layout-tablet-text-5xl">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="layout-mx-auto layout-mt-12 layout-max-w-3xl layout-space-y-3">
        {faqs.map((f) =>
        <details key={f.q} className="layout-group layout-rounded-2xl layout-border layout-border-border layout-bg-card layout-p-6 layout-shadow-card layout-faq-item" open>
            <summary className="layout-flex layout-cursor-pointer layout-list-none layout-items-center layout-justify-between layout-gap-4 layout-font-bold">
              {f.q}
              <span className="layout-text-primary">+</span>
            </summary>
            <p className="layout-mt-4 layout-leading-relaxed layout-text-muted-foreground">{f.a}</p>
          </details>
        )}
      </div>
    </Section>);

}

function FinalCTA() {
  return (
    <div id="contact" className="layout-overflow-hidden layout-bg-foreground layout-text-white">
      
      
      <Section className="layout-text-center">
        <h2 className="layout-mx-auto layout-max-w-3xl layout-text-4xl layout-font-black layout-tablet-text-6xl">
          Stop Sending Customers to Voicemail.
        </h2>
        <p className="layout-mx-auto layout-mt-6 layout-max-w-2xl layout-text-lg layout-text-white-75">
          You're too busy to answer every call. You shouldn't be too busy to capture the business.
        </p>
        <p className="layout-mt-4 layout-text-xl layout-font-bold">Let BizPhone answer when you can't.</p>
        <div className="layout-mt-10 layout-flex layout-justify-center">
          <CTAButtons light />
        </div>
      </Section>
    </div>);

}



function Index() {
  return (
    <main className="layout-bg-background">
      
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
      
    </main>);

}