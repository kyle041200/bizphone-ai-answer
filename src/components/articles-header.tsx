import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/kghq-logo-light.png.asset.json";

export function ArticlesHeader() {
  const [open, setOpen] = useState(false);
  const links = [{ label: "Home", to: "/" }, { label: "Marketing", to: "/marketing" }, { label: "Sales", to: "/sales" }, { label: "Business Support", to: "/business-support" }, { label: "Deliverables", to: "/deliverables" }, { label: "Articles", to: "/articles" }] as const;
  return <header className="sticky top-0 z-50 border-b border-kh-dark-line bg-kh-ink text-kh-white"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-5 px-5 md:px-8"><Link to="/" aria-label="KGHQ home"><img src={logo.url} alt="KGHQ" width={249} height={66} className="h-8 w-auto" /></Link><nav aria-label="Articles navigation" className="hidden items-center gap-6 lg:flex">{links.map(link => <Link key={link.to} to={link.to} className={`text-sm font-semibold hover:text-kh-lime ${link.to === "/articles" ? "text-kh-lime" : "text-kh-dark-muted"}`}>{link.label}</Link>)}</nav><Button asChild className="hidden rounded-none bg-kh-lime text-kh-ink hover:bg-kh-lime/90 md:inline-flex"><Link to="/new-client">Get Started <ArrowRight className="size-4" /></Link></Button><Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="text-kh-white hover:bg-kh-white/10 hover:text-kh-white lg:hidden">{open ? <X /> : <Menu />}</Button></div>{open && <nav className="border-t border-kh-dark-line px-5 py-4 lg:hidden">{links.map(link => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block border-b border-kh-dark-line py-3 text-sm font-semibold">{link.label}</Link>)}</nav>}</header>;
}