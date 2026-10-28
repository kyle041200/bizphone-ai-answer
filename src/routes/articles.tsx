import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { articleCategories, articles } from "@/lib/articles";

export const Route = createFileRoute("/articles")({
  validateSearch: (search: Record<string, unknown>) => ({ category: typeof search.category === "string" ? search.category : "All", q: typeof search.q === "string" ? search.q : "" }),
  head: () => ({ meta: [
    { title: "Articles — Small Business Insights | KGHQ" },
    { name: "description", content: "Practical perspectives on entrepreneurship, leadership, mindset, sales, and technology from KGHQ." },
    { property: "og:title", content: "Articles — Small Business Insights | KGHQ" },
    { property: "og:description", content: "Explore ideas for stronger strategy, smarter systems, and more consistent small business execution." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }]
  }),
  component: ArticlesPage
});

function ArticlesPage() {return <main className="layout-bg-kh-paper layout-text-kh-ink"><section className="layout-page-section layout-px-5 layout-py-20"><div className="layout-mx-auto layout-max-w-7xl"><h1>Articles.</h1><p>Fresh perspectives. Practical next moves. For the business you’re building.</p><nav aria-label="Article categories"><ul className="layout-category-links"><li><a href="#all-articles">All</a></li>{articleCategories.map((category) => <li key={category}><a href={`#category-${category.toLowerCase()}`}>{category}</a></li>)}</ul></nav></div></section><section id="all-articles" className="layout-page-section layout-px-5 layout-py-20"><div className="layout-mx-auto layout-max-w-7xl"><div className="layout-grid layout-gap-7 layout-desktop-grid-cols-3">{articles.map((article) => <article key={article.slug} className="layout-article-card layout-border layout-border-kh-line layout-bg-kh-white layout-p-6 service-card"><img src={article.image} alt={article.title} width={1536} height={1024} /><p>{article.categories.join(' · ')}</p><h2>{article.title}</h2><p>{article.excerpt}</p><a href={`/articles/${article.slug}/`} className="layout-wp-button page-link">Read Post</a></article>)}</div></div></section>{articleCategories.map((category) => <section key={category} id={`category-${category.toLowerCase()}`} className="layout-page-section layout-px-5 layout-py-10"><div className="layout-mx-auto layout-max-w-7xl"><h2>{category}</h2><ul>{articles.filter((article) => article.categories.includes(category)).map((article) => <li key={article.slug}><a href={`/articles/${article.slug}/`}>{article.title}</a></li>)}</ul></div></section>)}</main>;}