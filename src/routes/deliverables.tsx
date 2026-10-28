import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Check, ChevronDown, Menu, Search, X } from
"lucide-react";

import { Button } from "@/components/ui/button";
import logoLightAsset from "@/assets/kghq-logo-light.png.asset.json";
import { DeliverableCard } from "@/components/deliverable-card";
import { StackedBricks } from "@/components/stacked-bricks";
import { categories, deliverables, filterDeliverables } from "@/lib/deliverables-catalog";

export const Route = createFileRoute("/deliverables")({
  component: DeliverablesPage,
  head: () => ({
    meta: [
    { title: "Deliverables Library — KGHQ" },
    { name: "description", content: "Explore the marketing, sales, technology, and operations work KGHQ can execute for your business." },
    { property: "og:title", content: "Explore the KGHQ Deliverables Library" },
    { property: "og:description", content: "Choose the work that moves your business forward across marketing, sales, technology, and operations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }]


  })
});



function DeliverablesPage() {return <main className="layout-bg-kh-paper layout-text-kh-ink"><section className="layout-page-section layout-bg-kh-ink layout-px-5 layout-py-20 layout-text-kh-white"><div className="layout-mx-auto layout-max-w-7xl"><h1>Deliverables Library</h1><p>Explore the work that gets growth moving. Clear scopes. Coordinated execution. Put your Bricks to work.</p><nav aria-label="Deliverable categories"><ul className="layout-category-links"><li><a href="#library">All · 174</a></li>{categories.map((category) => <li key={category}><a href={`#${category.toLowerCase().replaceAll(' ', '-')}`}>{category} · {deliverables.filter((item) => item.category === category).length}</a></li>)}</ul></nav></div></section>{categories.map((category) => <section id={category.toLowerCase().replaceAll(' ', '-')} key={category} className="layout-page-section layout-bg-kh-paper layout-px-5 layout-py-20 layout-text-kh-ink"><div className="layout-mx-auto layout-max-w-7xl"><h2>{category} Deliverables</h2><div id={category === 'Marketing' ? 'library' : undefined} className="layout-grid layout-gap-5 layout-desktop-grid-cols-4">{deliverables.filter((item) => item.category === category).map((item) => <DeliverableCard key={item.id} item={item} />)}</div></div></section>)}<section className="layout-page-section layout-bg-kh-mist layout-px-5 layout-py-20"><div className="layout-mx-auto layout-max-w-7xl"><h2>Use your Bricks your way.</h2><p>Mix and match deliverables every month. Choose what your business needs now, with clear scope and Brick amounts and expert support across all categories.</p><a href="/new-client/" className="layout-wp-button page-link">Build My Plan</a></div></section></main>;}