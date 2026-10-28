import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticlesHeader } from "@/components/articles-header";
import { articles } from "@/lib/articles";

export const Route = createFileRoute("/articles_/$slug")({
  loader: ({ params }) => { const article = articles.find(item => item.slug === params.slug); if (!article) throw notFound(); return article; },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} — KGHQ Articles` : "Article Unavailable — KGHQ" },
    { name: "description", content: loaderData?.excerpt ?? "Explore small business insights from KGHQ." },
    { property: "og:title", content: loaderData?.title ?? "Article Unavailable — KGHQ" },
    { property: "og:description", content: loaderData?.excerpt ?? "Explore small business insights from KGHQ." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
    ...(!loaderData ? [{ name: "robots", content: "noindex" }] : []),
  ] }),
  component: ArticlePage,
  notFoundComponent: () => <main className="min-h-screen bg-kh-paper font-body text-kh-ink"><ArticlesHeader /><div className="mx-auto max-w-3xl px-5 py-24"><h1 className="font-display text-4xl font-bold">Article not found</h1><Link to="/articles" search={{ category: "All", q: "" }} className="mt-6 inline-flex items-center gap-2 text-kh-green-deep"><ArrowLeft className="size-4" />Back to articles</Link></div></main>,
});

function ArticlePage() {
  const article = Route.useLoaderData();
  return <main className="min-h-screen bg-kh-paper font-body text-kh-ink"><ArticlesHeader /><article className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16"><Link to="/articles" search={{ category: "All", q: "" }} className="inline-flex items-center gap-2 text-sm font-bold text-kh-green-deep"><ArrowLeft className="size-4" />All articles</Link><p className="mt-10 text-xs font-bold uppercase tracking-[0.1em] text-kh-green-deep">{article.categories.join(" · ")}</p><h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold leading-tight md:text-5xl">{article.title}</h1><p className="mt-5 text-lg leading-relaxed text-kh-muted">{article.excerpt}</p><p className="mt-5 text-xs font-semibold text-kh-muted">Editorial draft · KGHQ</p><img src={article.image} alt={article.title} width={1536} height={1024} fetchPriority="high" className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" /><div className="mx-auto mt-12 max-w-3xl">{article.sections.map(section => <section key={section.title} className="mb-10"><h2 className="font-display text-2xl font-bold leading-snug">{section.title}</h2><p className="mt-4 text-base leading-loose text-kh-muted">{section.body}</p></section>)}<div className="mt-12 border-t border-kh-line pt-8"><h2 className="font-display text-2xl font-bold">Turn your next idea into progress.</h2><Link to="/new-client" className="mt-5 inline-flex items-center gap-2 font-bold text-kh-green-deep">Talk to KGHQ <ArrowRight className="size-4" /></Link></div></div></article></main>;
}