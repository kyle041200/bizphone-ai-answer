import logo from '@/assets/kghq-logo-light.png.asset.json';

const groups = [
  { title: 'Services', items: [['Marketing', '/marketing/'], ['Sales', '/sales/'], ['Business Support', '/business-support/'], ['BizPhone', '/bizphone/'], ['BizSite', '/bizsite/'], ['Deliverables', '/deliverables/']] },
  { title: 'Resources', items: [['Growth Reset', '/growth-reset/'], ['Articles', '/articles/'], ['Training', '/training/']] },
  { title: 'Company', items: [['Partners', '/partners/'], ['New Client', '/new-client/']] },
];

export function SiteHeader() {
  return <header className="site-header"><div className="site-container header-row"><a href="/" aria-label="KGHQ home" className="site-logo"><img src={logo.url} width={249} height={66} alt="KGHQ" /></a><details className="site-menu" open><summary aria-label="Toggle navigation"><span aria-hidden="true">☰</span> Menu</summary><nav aria-label="Main navigation"><ul className="menu-list">{groups.map(group => <li key={group.title}><span className="menu-group-title">{group.title}</span><ul>{group.items.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></li>)}</ul></nav></details><a className="wp-button header-cta" href="/new-client/">Get Started</a></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-container"><div className="footer-grid"><div><a href="/" className="site-logo"><img src={logo.url} width={249} height={66} alt="KGHQ" /></a><p>The Execution Engine for Small Businesses &amp; Entrepreneurs.</p><p>Know what to do next. Then get it done.</p></div>{groups.map(group => <nav key={group.title} aria-label={`${group.title} footer links`}><h3>{group.title}</h3><ul>{group.items.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>)}</div><p className="copyright">© 2026 KGHQ. AI-assisted. Human-executed.</p></div></footer>;
}
