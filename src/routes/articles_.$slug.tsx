import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { articles } from "@/lib/articles";

export const Route = createFileRoute("/articles_/$slug")({
  loader: ({ params }) => {const article = articles.find((item) => item.slug === params.slug);if (!article) throw notFound();return article;},
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} — KGHQ Articles` : "Article Unavailable — KGHQ" },
    { name: "description", content: loaderData?.excerpt ?? "Explore small business insights from KGHQ." },
    { property: "og:title", content: loaderData?.title ?? "Article Unavailable — KGHQ" },
    { property: "og:description", content: loaderData?.excerpt ?? "Explore small business insights from KGHQ." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
    ...(!loaderData ? [{ name: "robots", content: "noindex" }] : [])]
  }),
  component: ArticlePage,
  notFoundComponent: () => <main className="layout-min-h-screen layout-bg-kh-paper layout-font-body layout-text-kh-ink"><div className="layout-mx-auto layout-max-w-3xl layout-px-5 layout-py-24"><h1 className="layout-font-display layout-text-4xl layout-font-bold">Article not found</h1><a href="/articles/" className="layout-mt-6 layout-inline-flex layout-items-center layout-gap-2 layout-text-kh-green-deep page-link"><ArrowLeft className="layout-size-4" />Back to articles</a></div></main>
});

function ArticlePage() {
  const article = Route.useLoaderData();
  return <main className="layout-min-h-screen layout-bg-kh-paper layout-font-body layout-text-kh-ink"><article className="layout-mx-auto layout-max-w-5xl layout-px-5 layout-py-10 layout-tablet-px-8 layout-tablet-py-16 service-card"><a href="/articles/" className="layout-inline-flex layout-items-center layout-gap-2 layout-text-sm layout-font-bold layout-text-kh-green-deep page-link"><ArrowLeft className="layout-size-4" />All articles</a><p className="layout-mt-10 layout-text-xs layout-font-bold layout-uppercase layout-text-kh-green-deep">{article.categories.join(" · ")}</p><h1 className="layout-mt-5 layout-max-w-4xl layout-font-display layout-text-3xl layout-font-extrabold layout-leading-tight layout-tablet-text-5xl">{article.title}</h1><p className="layout-mt-5 layout-text-lg layout-leading-relaxed layout-text-kh-muted">{article.excerpt}</p><p className="layout-mt-5 layout-text-xs layout-font-semibold layout-text-kh-muted">KGHQ</p><img src={article.image} alt={article.title} width={1536} height={1024} fetchPriority="high" className="layout-mt-8 layout-aspect-16-9 layout-w-full layout-rounded-lg layout-object-cover content-image" /><div className="layout-mx-auto layout-mt-12 layout-max-w-3xl">{article.introduction && <div className="layout-mb-10 layout-space-y-5">{article.introduction.map((paragraph) => <p key={paragraph} className="layout-text-base layout-leading-loose layout-text-kh-muted">{paragraph}</p>)}</div>}{article.sections.map((section) => <section key={section.title} className="layout-page-section layout-mb-10"><h2 className="layout-font-display layout-text-2xl layout-font-bold layout-leading-snug">{section.title}</h2><div className="layout-mt-4 layout-space-y-5">{section.blocks ? section.blocks.map((block, index) => block.type === "paragraph" ? <p key={index} className="layout-text-base layout-leading-loose layout-text-kh-muted">{block.text}</p> : <ul key={index} className="layout-list-disc layout-space-y-2 layout-pl-6 layout-text-base layout-leading-loose layout-text-kh-muted layout-marker-text-kh-green-deep">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>) : <p className="layout-text-base layout-leading-loose layout-text-kh-muted">{section.body}</p>}</div></section>)}<div className="layout-mt-12 layout-border-t layout-border-kh-line layout-pt-8"><h2 className="layout-font-display layout-text-2xl layout-font-bold">Turn your next idea into progress.</h2><a href="/new-client/" className="layout-mt-5 layout-inline-flex layout-items-center layout-gap-2 layout-font-bold layout-text-kh-green-deep page-link">Talk to KGHQ <ArrowRight className="layout-size-4" /></a></div></div></article></main>;
}