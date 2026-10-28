import { BarChart3, FileText, Globe2, Layers3, Mail, Mic, Palette, PhoneCall, Target, Users, Video, Workflow } from "lucide-react";
import { StackedBricks } from "@/components/stacked-bricks";
import { brickAmount, deliverableImage, type Deliverable } from "@/lib/deliverables-catalog";

function itemIcon(item: Deliverable) {
  const title = item.title.toLowerCase();
  if (/phone|call|dialing|voicemail|sms|receptionist/.test(title)) return PhoneCall;
  if (/podcast|audio|voiceover/.test(title)) return Mic;
  if (/video|reel|thumbnail/.test(title)) return Video;
  if (/email|newsletter|spf/.test(title)) return Mail;
  if (/website|domain|hosting|ssl|dns|ecommerce|landing/.test(title)) return Globe2;
  if (/dashboard|report|analysis|bookkeeping/.test(title)) return BarChart3;
  if (/automation|system|integration|agent|chatbot/.test(title)) return Workflow;
  if (/lead|prospect|icp|account|territory/.test(title)) return Target;
  if (/brand|logo|design|brochure|merch|flyer|banner/.test(title)) return Palette;
  if (/social|outreach/.test(title)) return Users;
  if (/slide|deck/.test(title)) return Layers3;
  return FileText;
}

export function DeliverableCard({ item, className = "", attrs }: { item: Deliverable; className?: string; attrs?: Record<string, string> }) {
  const Icon = itemIcon(item);
  return <article {...attrs} data-deliverable-id={item.id} className={`${className} group flex min-w-0 flex-col overflow-hidden rounded-lg border border-kh-line bg-kh-white shadow-kh transition-transform motion-safe:hover:-translate-y-1`}>
    <div className="relative">
      <div className="aspect-[4/3] overflow-hidden bg-kh-mist"><img src={deliverableImage(item)} alt={`${item.title} deliverable mockup`} loading="lazy" width={474} height={474} className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
      <span className="absolute -bottom-6 left-5 grid size-12 place-items-center rounded-full border border-kh-line bg-kh-white text-kh-green-deep shadow-kh"><Icon className="size-5" /></span>
    </div>
    <div className="flex flex-1 flex-col p-5 pt-9">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-kh-green-deep">{item.subcategory}</p>
      <h3 className="mt-2 font-display text-base font-extrabold leading-snug">{item.title}</h3>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-kh-muted">{item.description}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-kh-line pt-4 font-display text-sm font-bold text-kh-green-deep"><StackedBricks className="size-6 shrink-0" /><span data-brick-amount>{brickAmount(item)} Bricks</span></div>
    </div>
  </article>;
}