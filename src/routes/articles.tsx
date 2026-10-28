import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticlesHeader } from "@/components/articles-header";
import { articleCategories, filterArticles } from "@/lib/articles";

export const Route = createFileRoute("/articles")({
  validateSearch: (search: Record<string, unknown>) => ({ category: typeof search.category === "string" ? search.category : "All", q: typeof search.q === "string" ? search.q : "" }),
  head: () => ({ meta: [
    { title: "Articles — Small Business Insights | KGHQ" },
    { name: "description", content: "Practical perspectives on entrepreneurship, leadership, mindset, sales, and technology from KGHQ." },
    { property: "og:title", content: "Articles — Small Business Insights | KGHQ" },
    { property: "og:description", content: "Explore ideas for stronger strategy, smarter systems, and more consistent small business execution." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const { category: rawCategory, q } = Route.useSearch();
  const category = articleCategories.includes(rawCategory) ? rawCategory : "All";
  const navigate = Route.useNavigate();
  const results = filterArticles(category, q);
  return <main className="min-h-screen bg-kh-paper font-body text-kh-ink"><ArticlesHeader />
    <section className="border-b border-kh-line px-5 py-12 md:px-8 md:py-16"><div className="mx-auto max-w-7xl"><p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-kh-green-deep">The KGHQ journal</p><div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h1 className="font-display text-5xl font-extrabold md:text-7xl">Articles<span className="text-kh-green-deep">.</span></h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-kh-muted">Fresh perspectives. Practical next moves.<br />For the business you’re building.</p></div><p className="max-w-xs border-l-2 border-kh-green pl-5 text-sm leading-relaxed text-kh-muted">Entrepreneurship, leadership, sales, and the systems that keep growth moving.</p></div></div></section>
    <section className="px-5 py-8 md:px-8 md:py-10"><div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 border-b border-kh-line pb-7 xl:flex-row xl:items-center"><div className="flex flex-wrap gap-2" aria-label="Article categories">{["All", ...articleCategories].map(item => <Button key={item} variant="outline" aria-pressed={category === item} onClick={() => navigate({ search: { category: item, q }, replace: true, resetScroll: false })} className={`rounded-md px-4 text-xs ${category === item ? "border-kh-green bg-kh-green text-kh-white hover:bg-kh-green-deep hover:text-kh-white" : "border-kh-line bg-kh-white text-kh-ink hover:bg-kh-mist"}`}>{item}</Button>)}</div><div className="relative w-full xl:w-72"><Search className="absolute left-3 top-3 size-4 text-kh-muted" /><input aria-label="Search articles" placeholder="Search articles…" value={q} onChange={e => navigate({ search: { category, q: e.target.value }, replace: true, resetScroll: false })} className="h-10 w-full rounded-md border border-kh-line bg-kh-white pl-10 pr-10 text-sm outline-none focus:border-kh-green" />{q && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => navigate({ search: { category, q: "" }, replace: true, resetScroll: false })} className="absolute right-0 top-0 size-10 text-kh-muted"><X className="size-4" /></Button>}</div></div>
      <p aria-live="polite" className="mt-6 text-xs font-semibold text-kh-muted">{results.length} {results.length === 1 ? "article" : "articles"}{category !== "All" ? ` · ${category}` : " · All perspectives"}</p>
      <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{results.map(article => <article key={article.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-kh-line bg-kh-white"><Link to="/articles/$slug" params={{ slug: article.slug }} tabIndex={-1} aria-hidden="true" className="block aspect-[16/10] overflow-hidden bg-kh-mist"><img src={article.image} alt="" width={1536} height={1024} loading="lazy" className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></Link><div className="flex flex-1 flex-col p-6"><p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.08em] text-kh-green-deep">{article.categories.join(" · ")}</p><h2 className="mt-4 font-display text-xl font-extrabold leading-snug"><Link to="/articles/$slug" params={{ slug: article.slug }} className="hover:text-kh-green-deep">{article.title}</Link></h2><p className="mt-3 flex-1 text-sm leading-relaxed text-kh-muted">{article.excerpt}</p><Link to="/articles/$slug" params={{ slug: article.slug }} className="mt-6 inline-flex items-center justify-between gap-3 border-t border-kh-line pt-4 font-display text-sm font-bold text-kh-green-deep">Read Post <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" /></Link></div></article>)}</div>
      {results.length === 0 && <div className="py-20 text-center"><Search className="mx-auto size-8 text-kh-green-deep" /><h2 className="mt-4 font-display text-2xl font-bold">No articles found</h2><p className="mt-3 text-sm text-kh-muted">Try another topic or a broader search.</p><Button variant="outline" className="mt-6" onClick={() => navigate({ search: { category: "All", q: "" }, replace: true, resetScroll: false })}>Clear filters</Button></div>}
    </div></section><footer className="mt-10 border-t border-kh-line px-5 py-8 text-sm text-kh-muted"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4"><span>KGHQ · Strategy. Systems. Execution.</span><Link to="/new-client" className="inline-flex items-center gap-2 font-bold text-kh-green-deep">Find your next move <ArrowRight className="size-4" /></Link></div></footer></main>;
}