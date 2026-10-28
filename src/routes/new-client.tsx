import { createFileRoute } from "@tanstack/react-router";

import {
  ArrowRight, Sparkles, Check, CalendarCheck, ClipboardList, Building2,
  Users, Palette, Target, Send } from
"lucide-react";

export const Route = createFileRoute("/new-client")({
  component: NewClient,
  head: () => ({
    meta: [
    { title: "New Client Onboarding — KGHQ" },
    {
      name: "description",
      content:
      "Tell us about your business. This onboarding form helps KGHQ build an accurate marketing brief so everyone on your project is on the same page."
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:title", content: "New Client Onboarding — KGHQ" },
    {
      property: "og:description",
      content:
      "Answer these questions as thoroughly as possible so we can put together an accurate marketing brief for your business."
    }]

  })
});

/* ---------- primitives ---------- */

const inputCls =
"w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25";

function Field({
  label,
  required = false,
  hint,
  children





}: {label: string;required?: boolean;hint?: string;children: React.ReactNode;}) {
  return (
    <label className="layout-form-field">
      <span className="layout-mb-1-5 layout-block layout-text-sm layout-font-semibold layout-text-foreground">
        {label}
        {required && <span className="layout-ml-1 layout-text-primary">*</span>}
      </span>
      {hint && <p className="layout-mb-2 layout-text-xs layout-text-muted-foreground">{hint}</p>}
      {children}
    </label>);

}

function FormSection({
  number,
  icon: Icon,
  title,
  description,
  children






}: {number: string;icon: React.ComponentType<{className?: string;}>;title: string;description: string;children: React.ReactNode;}) {
  return (
    <fieldset className="layout-rounded-2xl layout-border layout-border-border layout-bg-card layout-p-6 layout-shadow-card layout-tablet-p-8">
      <div className="layout-mb-6 layout-flex layout-items-start layout-gap-4 layout-border-b layout-border-border-70 layout-pb-5">
        <span className="layout-flex layout-size-11 layout-shrink-0 layout-items-center layout-justify-center layout-rounded-xl layout-bg-accent layout-text-accent-foreground">
          <Icon className="layout-size-5" />
        </span>
        <div>
          <p className="layout-text-xs layout-font-bold layout-uppercase layout-text-primary">
            Section {number}
          </p>
          <h2 className="layout-mt-1 layout-text-xl layout-font-black layout-text-foreground">{title}</h2>
          <p className="layout-mt-1 layout-text-sm layout-text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="layout-grid layout-gap-5 layout-tablet-grid-cols-2">{children}</div>
    </fieldset>);

}

/* ---------- page ---------- */

function NewClient() {return <main className="layout-bg-background"><IntroAndForm /></main>;}



function IntroAndForm() {
  return (
    <>
      {/* intro hero */}
      <section className="layout-page-section layout-overflow-hidden layout-bg-foreground">
        
        
        <div className="layout-mx-auto layout-max-w-4xl layout-px-6 layout-py-20 layout-text-white layout-tablet-py-24">
          <span className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-border-white-20 layout-bg-white-10 layout-px-4 layout-py-1-5 layout-text-xs layout-font-semibold layout-uppercase">
            <Sparkles className="layout-size-3-5" /> Welcome to KGHQ
          </span>
          <h1 className="layout-mt-6 layout-text-4xl layout-font-black layout-leading-1-08 layout-tablet-text-6xl">
            Let's Get to Know Your Business
          </h1>
          <p className="layout-mt-6 layout-max-w-2xl layout-text-base layout-leading-relaxed layout-text-white-85 layout-tablet-text-lg">
            We ask these questions to put together an accurate marketing brief — the single
            source of truth for your company and brand. Please answer as thoroughly as
            possible, even if we already talked about it on our call. Everything you share
            here makes sure everyone at KGHQ is on the same page, no matter what they're
            working on for you.
          </p>
          <div className="layout-mt-8 layout-flex layout-flex-wrap layout-items-center layout-gap-3">
            <a
              href="#form"
              className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-bg-white layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout-text-primary layout-shadow-glow page-link">
              
              <CalendarCheck className="layout-size-4" /> Schedule Kick-Off Call
            </a>
            <a
              href="#form"
              className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-border layout-border-white-40 layout-px-7 layout-py-3-5 layout-text-sm layout-font-bold layout-text-white page-link">
              
              <ClipboardList className="layout-size-4" /> Start the Form
            </a>
          </div>
          <p className="layout-mt-4 layout-text-xs layout-text-white-60">
            Takes most people 10–15 minutes. You can't do this wrong — more detail is always better.
          </p>
        </div>
      </section>

      {/* form */}
      <section id="form" className="layout-page-section layout-px-6 layout-py-16 layout-tablet-py-20">
        <form className="layout-mx-auto layout-grid layout-max-w-4xl layout-gap-8 layout-wp-form-placeholder" method="post" data-wordpress-form="replace-with-form-plugin">
          <FormSection
            number="1"
            icon={Users}
            title="About You"
            description="Who we'll be working with day to day.">
            
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
            description="What you do, what you sell, and where you do it.">
            
            <div className="layout-tablet-col-span-2">
              <Field
                label="What does your business do?"
                required
                hint="Describe your products or services in your own words — imagine explaining it to a new customer.">
                
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
            <div className="layout-tablet-col-span-2">
              <Field
                label="List your main products or services (with pricing if you'd like)"
                hint="Roughly in order of what matters most to your revenue.">
                
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
            description="Who you're trying to reach and what matters to them.">
            
            <div className="layout-tablet-col-span-2">
              <Field label="Who is your ideal customer?" hint="Neighborhood, income level, homeowners vs. businesses, DIY-ers vs. hire-it-out — anything that paints the picture.">
                <textarea name="idealCustomer" rows={3} className={inputCls} placeholder="Homeowners aged 35–65 in established neighborhoods who value their weekends..." />
              </Field>
            </div>
            <div className="layout-tablet-col-span-2">
              <Field label="How do customers currently find you?">
                <textarea name="howCustomersFindYou" rows={3} className={inputCls} placeholder="Word of mouth, Facebook groups, yard signs, Google..." />
              </Field>
            </div>
            <div className="layout-tablet-col-span-2">
              <Field label="What questions do customers ask most often?">
                <textarea name="commonQuestions" rows={3} className={inputCls} placeholder='"Do you offer one-time mows?" "Are you insured?" ...' />
              </Field>
            </div>
          </FormSection>

          <FormSection
            number="4"
            icon={Palette}
            title="Brand & Voice"
            description="How your business should look, sound, and feel.">
            
            <div className="layout-tablet-col-span-2">
              <Field label="Which words describe your brand personality?" hint="Pick all that apply — or tell us your own in the field below.">
                <div className="layout-flex layout-flex-wrap layout-gap-2">
                  {["Friendly", "Professional", "Bold", "Luxury", "Playful", "Trustworthy", "Local & Hometown", "High-Tech", "Family-Run", "No-Nonsense"].map((t) =>
                  <label className="layout-trait-option"><input type="checkbox" name="traits" value={t} />{t}</label>
                  )}
                </div>
              </Field>
            </div>
            <div className="layout-tablet-col-span-2">
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
            <div className="layout-tablet-col-span-2">
              <Field label="Colors and designs you love (or hate)">
                <textarea name="designPreferences" rows={2} className={inputCls} placeholder="We love deep green and cream. Please no bright orange. Our trucks are navy, so matching that would be great." />
              </Field>
            </div>
            <div className="layout-tablet-col-span-2">
              <Field label="Websites or brands you admire" hint="Even outside your industry — this helps us understand your taste.">
                <textarea name="inspiration" rows={2} className={inputCls} placeholder="I like how clean the Home Depot site is, and I love the vibe of Yeti's branding..." />
              </Field>
            </div>
          </FormSection>

          <FormSection
            number="5"
            icon={Send}
            title="Goals & Anything Else"
            description="What success looks like for you.">
            
            <div className="layout-tablet-col-span-2">
              <Field label="What's the #1 goal for working with KGHQ?" required hint="More calls? A professional image? Fewer missed leads? Be honest — this shapes everything we build.">
                <textarea name="topGoal" required rows={3} className={inputCls} placeholder="I miss too many calls during the workday and I know I'm losing jobs because of it..." />
              </Field>
            </div>
            <div className="layout-tablet-col-span-2">
              <Field label="Anything else we should know?" hint="Upcoming changes, seasonal patterns, pet peeves, big dreams — nothing is off-topic.">
                <textarea name="anythingElse" rows={3} className={inputCls} placeholder="We're opening a second location next spring..." />
              </Field>
            </div>
          </FormSection>

          <div className="layout-flex layout-flex-col layout-items-center layout-gap-3 layout-pb-4">
            <button
              type="submit"
              className="layout-inline-flex layout-items-center layout-gap-2 layout-rounded-full layout-px-9 layout-py-4 layout-text-sm layout-font-bold layout-text-primary-foreground layout-shadow-glow">
              
              Submit Onboarding Form <ArrowRight className="layout-size-4" />
            </button>
            <p className="layout-text-xs layout-text-muted-foreground">
              The more detail you give, the better your marketing brief will be.
            </p>
          </div>
        </form>
      </section>
    </>);

}