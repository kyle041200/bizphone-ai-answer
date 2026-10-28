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

export function DeliverableCard({ item }: {item: Deliverable;}) {
  const Icon = itemIcon(item);
  return <article data-deliverable-id={item.id} className="layout-group layout-flex layout-min-w-0 layout-flex-col layout-overflow-hidden layout-rounded-lg layout-border layout-border-kh-line layout-bg-kh-white layout-shadow-kh service-card">
    <div className="">
      <div className="layout-aspect-4-3 layout-overflow-hidden layout-bg-kh-mist"><img src={deliverableImage(item)} alt={`${item.title} deliverable mockup`} loading="lazy" width={474} height={474} className="layout-size-full layout-object-cover content-image" /></div>
      <span className="layout-grid layout-size-12 layout-place-items-center layout-rounded-full layout-border layout-border-kh-line layout-bg-kh-white layout-text-kh-green-deep layout-shadow-kh"><Icon className="layout-size-5" /></span>
    </div>
    <div className="layout-flex layout-flex-1 layout-flex-col layout-p-5 layout-pt-9">
      <p className="layout-text-10px layout-font-bold layout-uppercase layout-text-kh-green-deep">{item.subcategory}</p>
      <h3 className="layout-mt-2 layout-font-display layout-text-base layout-font-extrabold layout-leading-snug">{item.title}</h3>
      <p className="layout-mt-3 layout-flex-1 layout-text-xs layout-leading-relaxed layout-text-kh-muted">{item.description}</p>
      <div className="layout-mt-5 layout-flex layout-items-center layout-gap-2 layout-border-t layout-border-kh-line layout-pt-4 layout-font-display layout-text-sm layout-font-bold layout-text-kh-green-deep"><StackedBricks className="layout-size-6 layout-shrink-0" /><span data-brick-amount>{brickAmount(item)} Bricks</span></div>
    </div>
  </article>;
}