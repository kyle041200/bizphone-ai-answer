import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CheckCheck, FileText, Library, Menu, MessageSquareText, Mic, Search, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notinaOffering } from "@/lib/notina-offering";
import notinaImage from "@/assets/notina-meeting-background.jpg";
import logo from "@/assets/kghq-logo.png.asset.json";
import lightLogo from "@/assets/kghq-logo-light.png.asset.json";
import pageCss from "@/styles/notina.css?url";

export const Route = createFileRoute("/notina")({
  component: NotinaPage,
  head: () => ({
    meta: [
      { title: "Notina by KGHQ — Your AI Notetaker. Your Business Memory." },
      { name: "description", content: "Focus on the conversation. Notina captures meeting notes, summaries, and action items for $10/month plus $50 one-time setup." },
      { property: "og:title", content: "Notina by KGHQ — Your Business Memory" },
      { property: "og:description", content: "Better meetings, clearer next steps, and a searchable memory for your business. Meet your AI notetaker." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: pageCss }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" }],
  }),
});

function GetNotina({ children = "Get Notina" }: { children?: React.ReactNode }) {
  return <Button asChild className="nt-cta"><Link to="/new-client">{children}<ArrowRight /></Link></Button>;
}

function NotinaHeader() {
  const [open, setOpen] = useState(false);
  return <header className="nt-header"><div className="nt-container nt-nav"><Link to="/" aria-label="KGHQ home"><img src={lightLogo.url} alt="KGHQ" width={249} height={66} /></Link><nav aria-label="Notina navigation" className="nt-desktop-nav"><Link to="/">Home</Link><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#pricing">Pricing</a><Link to="/notina" aria-current="page">Notina</Link></nav><div className="nt-nav-actions"><GetNotina /><Button variant="ghost" size="icon" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="nt-menu">{open ? <X /> : <Menu />}</Button></div></div>{open && <nav className="nt-mobile-nav" aria-label="Mobile Notina navigation"><Link to="/" onClick={() => setOpen(false)}>Home</Link><a href="#features" onClick={() => setOpen(false)}>Features</a><a href="#how-it-works" onClick={() => setOpen(false)}>How It Works</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a><Link to="/notina" onClick={() => setOpen(false)}>Notina</Link></nav>}</header>;
}

const features = [
  { icon: Mic, title: "Meeting Capture", text: "Let Notina attend supported Zoom meetings and capture the conversation while you stay focused on the people in front of you." },
  { icon: Sparkles, title: "AI Meeting Summaries", text: "Turn long conversations into clear, easy-to-read summaries highlighting the most important information." },
  { icon: CheckCheck, title: "Action Items & Next Steps", text: "Know what was agreed to, who’s responsible, and what needs to happen next." },
  { icon: Search, title: "Search Your Meeting History", text: "Find important conversations by client, topic, keyword, or date." },
  { icon: MessageSquareText, title: "Chat With Your Meetings", text: "Ask Notina questions about previous conversations and get answers based on your meeting history." },
  { icon: Library, title: "Your Business Meeting Library", text: "Keep meeting summaries, transcripts, important decisions, and action items organized inside one dashboard." },
];
const questions = ["What did we discuss with Sarah last Thursday?", "What action items came out of our sales meeting?", "Find every conversation where we talked about pricing.", "What did I promise to send that client?", "Summarize my meetings from the past week."];
const steps = [
  ["Connect your calendar", "Set up Notina with your supported meeting calendar and choose which meetings to capture."],
  ["Have your conversation", "Focus on your meeting while Notina captures the details."],
  ["Get your notes", "Review the summary, transcript, key decisions, and action items in your Notina dashboard."],
  ["Ask away", "Need to remember something? Chat with Notina and search your meeting history."],
];

function BrandedPreview() {
  const input = useRef<HTMLInputElement>(null);
  const [customLogo, setCustomLogo] = useState<string>();
  const [error, setError] = useState("");
  useEffect(() => () => { if (customLogo) URL.revokeObjectURL(customLogo); }, [customLogo]);
  return <section className="nt-section nt-white"><div className="nt-container"><div className="nt-section-heading"><span className="nt-eyebrow">At home in your meetings</span><h2>Your brand.<br />Her brilliant memory.</h2><p>A white-label meeting companion, with space for your company’s logo.</p></div><div className="nt-meeting"><div className="nt-meeting-bar"><span><Mic size={16} />Notina · AI Notetaker</span><span>Meeting preview</span></div><div className="nt-meeting-screen"><img src={notinaImage} alt="Notina’s white-label meeting background with her illustrated portrait" className="nt-meeting-image" /><div className="nt-meeting-copy"><strong>Notina</strong><span>AI Notetaker</span><div className="nt-client-logo">{customLogo ? <img src={customLogo} alt="Your company logo preview" /> : <span>Your logo</span>}</div></div></div></div><div className="nt-preview-actions"><input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden aria-label="Company logo" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setError("Choose a PNG, JPG, or WebP under 5 MB."); return; } setError(""); setCustomLogo(URL.createObjectURL(file)); }} /><Button variant="outline" type="button" onClick={() => input.current?.click()}><Upload />Preview Your Logo</Button>{customLogo && <Button variant="ghost" type="button" onClick={() => setCustomLogo(undefined)}><X />Remove logo</Button>}{error && <p role="alert">{error}</p>}</div></div></section>;
}

function NotinaPage() {
  return <main className="notina-page"><NotinaHeader />
    <section className="nt-hero"><img src={notinaImage} alt="Meet Notina, KGHQ’s illustrated AI meeting companion with auburn hair, glasses, and a purple blazer" width={1280} height={720} className="nt-hero-image" /><div className="nt-container nt-hero-content"><div><span className="nt-eyebrow">Notina by KGHQ</span><h1>Meet Notina.</h1><h2>Your AI Notetaker.<br />Your Business Memory.</h2><p className="nt-hero-lead">You focus on the conversation.<br />Notina remembers the rest.</p><p>Running a business means having a lot of conversations—and even more things to remember.</p><p>Meet Notina, your AI-powered meeting assistant who captures conversations, organizes notes, identifies action items, and helps you remember the important details.</p><div className="nt-hero-price"><strong>${notinaOffering.monthlyPrice}/month</strong><span>+ ${notinaOffering.setupFee} one-time setup</span></div><div className="nt-actions"><GetNotina /><Button asChild variant="outline"><a href="#how-it-works">See How It Works<ArrowRight /></a></Button></div></div></div></section>
    <div className="nt-trust"><div className="nt-container"><span><Check />No scrambling to take notes.</span><span><Check />No forgotten commitments.</span><span><Check />No wondering what someone said three meetings ago.</span></div></div>
    <section id="features" className="nt-section"><div className="nt-container"><div className="nt-section-heading"><span className="nt-eyebrow">Better meetings. Clearer next steps.</span><h2>You’re running a business.<br />Not a note-taking business.</h2><p>Between client meetings, sales calls, team check-ins, and brainstorming sessions, keeping track of everything can feel like another full-time job.</p><p><strong>Notina takes that off your plate.</strong></p></div><h3 className="nt-feature-title">Everything important, all in one place.</h3><div className="nt-features">{features.map(({ icon: Icon, title, text }) => <article key={title}><Icon className="nt-feature-icon" /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="nt-section nt-dark"><div className="nt-container nt-two-col"><div><span className="nt-eyebrow">Your business, remembered</span><h2>Wait. What did we decide on that call?</h2><p>With Notina, you don’t have to remember everything.</p><p>Simply ask:</p><p className="nt-statement">Your meetings become a searchable memory for your business.</p></div><ul className="nt-questions">{questions.map(question => <li key={question}><MessageSquareText /><span>“{question}”</span><ArrowRight /></li>)}</ul></div></section>
    <BrandedPreview />
    <section className="nt-section nt-mist"><div className="nt-container nt-two-col"><div><span className="nt-eyebrow">Remember it. Then do it.</span><h2>From meeting notes to getting things done.</h2></div><div><p>Notina is part of the KGHQ ecosystem, where conversations can lead to real action.</p><p>Capture your meeting. Review your notes. Identify your next steps. And when you’re ready, turn those action items into tasks that your human and AI workforce can help execute.</p><p><strong>Because the goal isn’t just to remember what happened. It’s to make something happen next.</strong></p><div className="nt-workflow"><span><Mic />Capture</span><ArrowRight /><span><FileText />Review</span><ArrowRight /><span><CheckCheck />Execute</span></div></div></div></section>
    <section id="how-it-works" className="nt-section nt-white"><div className="nt-container"><div className="nt-section-heading"><span className="nt-eyebrow">Simple from the start</span><h2>Meet your new meeting routine.</h2></div><div className="nt-steps">{steps.map(([title, text], index) => <article key={title}><span className="nt-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="nt-simple">It’s that simple.</p></div></section>
    <section id="pricing" className="nt-section nt-mist"><div className="nt-container nt-two-col nt-price-layout"><div><span className="nt-eyebrow">Less admin. More time to grow.</span><h2>Your AI meeting companion for just ${notinaOffering.monthlyPrice}/month.</h2><p>Just better meetings, clearer next steps, and more time to grow your business.</p><p>Notina by KGHQ — Your Human + AI Workforce.</p></div><article className="nt-price-card"><span className="nt-eyebrow">Notina Starter</span><div className="nt-price"><strong>${notinaOffering.monthlyPrice}</strong><span>/month</span></div><p>Plus a <strong>${notinaOffering.setupFee} one-time setup fee per client.</strong></p><hr /><p>Your subscription includes:</p><ul>{notinaOffering.inclusions.map(item => <li key={item}><Check />{item}</li>)}</ul><GetNotina>Get Started With Notina</GetNotina><p className="nt-due"><strong>${notinaOffering.signupTotal} due at signup. ${notinaOffering.monthlyPrice}/month thereafter.</strong></p><p className="nt-small">Cancel anytime. Applicable meeting usage limits and supported integrations are disclosed at signup.</p></article></div></section>
    <section className="nt-section nt-white"><div className="nt-container nt-two-col"><div><span className="nt-eyebrow">Notina is just the beginning</span><h2>Meet KGHQ — Your Human + AI Workforce.</h2><img src={logo.url} alt="KGHQ — Keep Going HQ" width={249} height={66} className="nt-brand-logo" /></div><div><p>Notina is proudly brought to you by <strong>KGHQ (Keep Going HQ)</strong>, the growth platform helping entrepreneurs turn ideas into action.</p><p>We believe entrepreneurs don’t have an ideas problem. They have an execution problem.</p><p>That’s why we’re building an entire human + AI workforce to help small businesses get more done.</p><p>Notina remembers your meetings. Cossandra helps coordinate the work. And your KGHQ workforce helps you keep moving forward.</p><Button asChild variant="outline"><Link to="/">Explore KGHQ<ArrowRight /></Link></Button></div></div></section>
    <section className="nt-section nt-dark nt-final"><div className="nt-container"><span className="nt-eyebrow">Your next big idea deserves to be remembered</span><h2>Less note-taking.<br />More doing.</h2><p>Your next big idea, important decision, or customer commitment deserves to be remembered.</p><p>Let Notina handle the notes while you focus on building your business.</p><GetNotina>Get Notina — ${notinaOffering.monthlyPrice}/month + ${notinaOffering.setupFee} setup</GetNotina></div></section>
    <footer className="nt-footer"><div className="nt-container"><Link to="/" aria-label="KGHQ home"><img src={lightLogo.url} alt="KGHQ" width={249} height={66} /></Link><span>Notina by KGHQ.</span><Link to="/">Visit KGHQ<ArrowRight size={16} /></Link></div></footer>
  </main>;
}