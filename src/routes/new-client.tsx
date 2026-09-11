import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Sparkles, Check, CalendarCheck, ClipboardList, Building2,
  Users, Palette, Target, Send,
} from "lucide-react";

export const Route = createFileRoute("/new-client")({
  component: NewClient,
  head: () => ({
    meta: [
      { title: "New Client Onboarding — KGHQ" },
      {
        name: "description",
        content:
          "Tell us about your business. This onboarding form helps KGHQ build an accurate marketing brief so everyone on your project is on the same page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "New Client Onboarding — KGHQ" },
      {
        property: "og:description",
        content:
          "Answer these questions as thoroughly as possible so we can put together an accurate marketing brief for your business.",
      },
    ],
  }),
});

/* ---------- primitives ---------- */

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25";

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function FormSection({
  number,
  icon: Icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
      <div className="mb-6 flex items-start gap-4 border-b border-border/70 pb-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Section {number}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/* ---------- page ---------- */

function NewClient() {
  const [submitted, setSubmitted] = useState(false);
  const [traits, setTraits] = useState<string[]>([]);

  const toggleTrait = (t: string) =>
    setTraits((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("New client onboarding submission:", { ...data, traits });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {submitted ? <SuccessScreen /> : <IntroAndForm traits={traits} toggleTrait={toggleTrait} onSubmit={handleSubmit} />}

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        <p>
          Questions? Reach us any time — we're happy to walk through it with you.
        </p>
        <p className="mt-2">
          <Link to="/" className="font-semibold text-primary hover:underline">BizPhone</Link>
          {" · "}
          <Link to="/bizsite" className="font-semibold text-primary hover:underline">BizSite</Link>
          {" · KGHQ"}
        </p>
      </footer>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-primary">»»</span>
          <span className="text-lg font-black tracking-tight text-foreground">
            KGHQ
            <span className="ml-1.5 text-xs font-medium text-muted-foreground">New Client</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <Link to="/" className="transition-colors hover:text-primary">BizPhone</Link>
          <Link to="/bizsite" className="transition-colors hover:text-primary">BizSite</Link>
          <a href="#form" className="transition-colors hover:text-primary">The Form</a>
        </nav>
        <a
          href="#form"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Start Now
        </a>
      </div>
    </header>
  );
}

function IntroAndForm({
  traits,
  toggleTrait,
  onSubmit,
}: {
  traits: string[];
  toggleTrait: (t: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      {/* intro hero */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-white md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
            <Sparkles className="size-3.5" /> Welcome to KGHQ
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight md:text-6xl">
            Let's Get to Know Your Business
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            We ask these questions to put together an accurate marketing brief — the single
            source of truth for your company and brand. Please answer as thoroughly as
            possible, even if we already talked about it on our call. Everything you share
            here makes sure everyone at KGHQ is on the same page, no matter what they're
            working on for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-glow transition-all hover:-translate-y-0.5 hover:bg-white/90"
            >
              <CalendarCheck className="size-4" /> Schedule Kick-Off Call
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <ClipboardList className="size-4" /> Start the Form
            </a>
          </div>
          <p className="mt-4 text-xs text-white/60">
            Takes most people 10–15 minutes. You can't do this wrong — more detail is always better.
          </p>
        </div>
      </section>

      {/* form */}
      <section id="form" className="px-6 py-16 md:py-20">
        <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-8">
          <FormSection
            number="1"
            icon={Users}
            title="About You"
            description="Who we'll be working with day to day."
          >
            <Field label="Your name" required>
              <input name="contactName" required className={inputCls} placeholder="Jane Smith" />
            </Field>
            <Field label="Your role / title">
              <input name="contactRole" className={inputCls} placeholder="Owner" />
            </Field>
            <Field label="Email" required>
              <input name="email" type="email" required className={inputCls} placeholder="jane@yourbusiness.com" />
            </Field>
            <Field label="Phone">
              <input name="phone" type="tel" className={inputCls} placeholder="(555) 123-4567" />
            </Field>
            <Field label="Business name" required>
              <input name="businessName" required className={inputCls} placeholder="Smith Landscaping LLC" />
            </Field>
            <Field label="Current website (if any)">
              <input name="website" type="url" className={inputCls} placeholder="https://..." />
            </Field>
          </FormSection>

          <FormSection
            number="2"
            icon={Building2}
            title="Your Business"
            description="What you do, what you sell, and where you do it."
          >
            <div className="md:col-span-2">
              <Field
                label="What does your business do?"
                required
                hint="Describe your products or services in your own words — imagine explaining it to a new customer."
              >
                <textarea name="whatYouDo" required rows={4} className={inputCls} placeholder="We provide weekly lawn care, seasonal cleanups, and full landscape design for homeowners in..." />
              </Field>
            </div>
            <Field label="How long have you been in business?">
              <select name="yearsInBusiness" className={inputCls} defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Just getting started</option>
                <option>Under 2 years</option>
                <option>2–5 years</option>
                <option>5–10 years</option>
                <option>10+ years</option>
              </select>
            </Field>
            <Field label="Service area / locations">
              <input name="serviceArea" className={inputCls} placeholder="Greater Austin area + surrounding suburbs" />
            </Field>
            <div className="md:col-span-2">
              <Field
                label="List your main products or services (with pricing if you'd like)"
                hint="Roughly in order of what matters most to your revenue."
              >
                <textarea name="productsServices" rows={4} className={inputCls} placeholder="1. Weekly mowing — $45/visit&#10;2. Landscape design — from $2,500&#10;3. ..." />
              </Field>
            </div>
            <Field label="Business hours">
              <input name="hours" className={inputCls} placeholder="Mon–Fri 8am–6pm, Sat by appointment" />
            </Field>
            <Field label="Who are your main competitors?">
              <input name="competitors" className={inputCls} placeholder="Company A, Company B..." />
            </Field>
          </FormSection>

          <FormSection
            number="3"
            icon={Target}
            title="Your Customers"
            description="Who you're trying to reach and what matters to them."
          >
            <div className="md:col-span-2">
              <Field label="Who is your ideal customer?" hint="Neighborhood, income level, homeowners vs. businesses, DIY-ers vs. hire-it-out — anything that paints the picture.">
                <textarea name="idealCustomer" rows={3} className={inputCls} placeholder="Homeowners aged 35–65 in established neighborhoods who value their weekends..." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="How do customers currently find you?">
                <textarea name="howCustomersFindYou" rows={3} className={inputCls} placeholder="Word of mouth, Facebook groups, yard signs, Google..." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="What questions do customers ask most often?">
                <textarea name="commonQuestions" rows={3} className={inputCls} placeholder='"Do you offer one-time mows?" "Are you insured?" ...' />
              </Field>
            </div>
          </FormSection>

          <FormSection
            number="4"
            icon={Palette}
            title="Brand & Voice"
            description="How your business should look, sound, and feel."
          >
            <div className="md:col-span-2">
              <Field label="Which words describe your brand personality?" hint="Pick all that apply — or tell us your own in the field below.">
                <div className="flex flex-wrap gap-2">
                  {["Friendly", "Professional", "Bold", "Luxury", "Playful", "Trustworthy", "Local & Hometown", "High-Tech", "Family-Run", "No-Nonsense"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTrait(t)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                        traits.includes(t)
                          ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                          : "border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {traits.includes(t) && <Check className="mr-1.5 inline size-3.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Anything else about your brand voice?" hint="Words or phrases to always use (or avoid), tone, how you greet customers, etc.">
                <textarea name="brandVoiceExtra" rows={2} className={inputCls} placeholder='We always say "team members," never "staff." Never use exclamation points.' />
              </Field>
            </div>
            <Field label="Do you have a logo & brand assets?">
              <select name="brandAssets" className={inputCls} defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Yes — final files, ready to use</option>
                <option>Yes — but they could use a refresh</option>
                <option>No — I'd like KGHQ to create them</option>
              </select>
            </Field>
            <Field label="Link to logo / brand files">
              <input name="brandFilesLink" type="url" className={inputCls} placeholder="Google Drive, Dropbox link..." />
            </Field>
            <div className="md:col-span-2">
              <Field label="Colors and designs you love (or hate)">
                <textarea name="designPreferences" rows={2} className={inputCls} placeholder="We love deep green and cream. Please no bright orange. Our trucks are navy, so matching that would be great." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Websites or brands you admire" hint="Even outside your industry — this helps us understand your taste.">
                <textarea name="inspiration" rows={2} className={inputCls} placeholder="I like how clean the Home Depot site is, and I love the vibe of Yeti's branding..." />
              </Field>
            </div>
          </FormSection>

          <FormSection
            number="5"
            icon={Send}
            title="Goals & Anything Else"
            description="What success looks like for you."
          >
            <div className="md:col-span-2">
              <Field label="What's the #1 goal for working with KGHQ?" required hint="More calls? A professional image? Fewer missed leads? Be honest — this shapes everything we build.">
                <textarea name="topGoal" required rows={3} className={inputCls} placeholder="I miss too many calls during the workday and I know I'm losing jobs because of it..." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Anything else we should know?" hint="Upcoming changes, seasonal patterns, pet peeves, big dreams — nothing is off-topic.">
                <textarea name="anythingElse" rows={3} className={inputCls} placeholder="We're opening a second location next spring..." />
              </Field>
            </div>
          </FormSection>

          <div className="flex flex-col items-center gap-3 pb-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-9 py-4 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
            >
              Submit Onboarding Form <ArrowRight className="size-4" />
            </button>
            <p className="text-xs text-muted-foreground">
              The more detail you give, the better your marketing brief will be.
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

function SuccessScreen() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-card">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <Check className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground">
          Thank You — We've Got It
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          Your answers are in. Our team will review everything and put together your
          marketing brief, then we'll see you on the kick-off call. If anything comes to
          mind later, just send it over — more detail is always welcome.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
          >
            <CalendarCheck className="size-4" /> Schedule Kick-Off Call
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
