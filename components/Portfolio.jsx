const CLIPPINGS = [
  {
    id: "c1",
    pub: "MYSTEN LABS",
    sub: "Builder Education · Sui Developer Docs",
    headline: "Sui developer documentation and tutorial series",
    excerpt: "Developer education for the Sui blockchain, including quickstart guides, Move tutorials, and onboarding content for the object-centric programming model.",
    kicker: "Tutorial · Developer Education",
    year: "2025–present",
    accent: "blue",
    rot: -1.6,
    size: "tall"
  },
  {
    id: "c2",
    pub: "DFINITY",
    sub: "ICP Developer Docs · 5,000+ commits",
    headline: "Internet Computer developer documentation overhaul",
    excerpt: "Full redesign of the ICP developer docs: information architecture, 36-part tutorial series across 6 difficulty levels, quickstart guides, and reference material.",
    kicker: "Docs · Information Architecture",
    year: "2022–2025",
    accent: "green",
    rot: 1.2,
    size: "wide"
  },
  {
    id: "c3",
    pub: "SELF-PUBLISHED",
    sub: "The Ultimate Web3 Pocket Guide · 2nd Edition",
    headline: "A field guide to the Web3 stack for developers and the curious",
    excerpt: "Covers blockchains, consensus mechanisms, wallets, smart contracts, decentralized storage, tokens, and developer tooling. Fully revised for the 2026 edition.",
    kicker: "Book · Reference",
    year: "2022, 2026",
    accent: "blue",
    rot: -0.6,
    size: "sq"
  },
  {
    id: "c4",
    pub: "SELF-PUBLISHED",
    sub: "Mastering Web3 Documentation",
    headline: "Strategy, architecture, and workflows for Web3 technical writers",
    excerpt: "A case-study-driven guide covering docs strategy, information architecture, user research, content taxonomies, and the specific challenges of documenting decentralized protocols.",
    kicker: "Book · Technical Writing",
    year: "2024",
    accent: "green",
    rot: 1.8,
    size: "tall"
  },
  {
    id: "c5",
    pub: "FILEBASE",
    sub: "Whitepaper · Decentralized Storage",
    headline: "Decentralized storage and the IPFS addressing model",
    excerpt: "A technical whitepaper explaining how IPFS content addressing works, how decentralized storage differs from traditional cloud providers, and integration patterns for developers.",
    kicker: "Whitepaper",
    year: "2022",
    accent: "blue",
    rot: 0.8,
    size: "wide"
  },
  {
    id: "c6",
    pub: "FILEBASE",
    sub: "eBook · Developer Onboarding",
    headline: "Migrating to decentralized storage: a developer guide",
    excerpt: "Step-by-step guide for developers moving from centralized cloud storage to decentralized alternatives, covering S3-compatible workflows and integration strategies.",
    kicker: "eBook · Developer Education",
    year: "2022",
    accent: "green",
    rot: -1.2,
    size: "sq"
  },
  {
    id: "c7",
    pub: "DFINITY",
    sub: "Developer Research · User Studies",
    headline: "ICP developer experience research: six rounds of user studies",
    excerpt: "Findings from hands-on user studies with developers using the ICP docs. Identified navigation and information architecture as the primary barriers to onboarding success.",
    kicker: "Research · UX",
    year: "2023–2024",
    accent: "blue",
    rot: 1.4,
    size: "tall"
  },
  {
    id: "c8",
    pub: "HACKATHONS",
    sub: "HackMIT, ETHGlobal, ICP Community Events",
    headline: "Developer workshops and hackathon education",
    excerpt: "Live workshops and hackathon support materials designed to get developers to their first working deploy on a new platform within a single session.",
    kicker: "Talk · Workshop",
    year: "2023–2025",
    accent: "green",
    rot: -0.4,
    size: "wide"
  }
];

function Portfolio() {
  const [filter, setFilter] = React.useState("All");
  const tags = ["All", "Tutorial", "Explainer", "Book", "Whitepaper", "Research", "Talk"];
  const filtered = CLIPPINGS.filter(c =>
    filter === "All" || c.kicker.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="portfolio" className="portfolio container">
      <div className="portfolio-head">
        <span className="eyebrow">Portfolio · Selected work</span>
        <h2>Docs, books, and <span className="swoosh">field work
          <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
        </span>.</h2>
        <p className="portfolio-sub">
          Selected tutorials, whitepapers, books, and developer education across the Web3 stack. Hover to lift a clipping off the desk.
        </p>
        <div className="portfolio-filters">
          {tags.map(t => (
            <button
              key={t}
              className={`filter ${filter === t ? "on" : ""}`}
              onClick={() => setFilter(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="clippings">
        {filtered.map((c, i) => (
          <article
            key={c.id}
            className={`clipping clipping-${c.size} clipping-${c.accent}`}
            style={{ "--rot": `${c.rot}deg`, "--i": i }}
          >
            <div className="tape tape-1" />
            <div className="tape tape-2" />
            <div className="clipping-inner">
              <div className="masthead">
                <div className="masthead-top">{c.pub}</div>
                <div className="masthead-rule"><span /><span className="dot" /><span /></div>
                <div className="masthead-sub">{c.sub}</div>
              </div>
              <h3 className="clipping-headline">{c.headline}</h3>
              <p className="clipping-excerpt">{c.excerpt}</p>
              <div className="clipping-foot">
                <span>{c.kicker}</span>
                <span className="dot" />
                <span>{c.year}</span>
                <span className="clipping-read">Read →</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

window.Portfolio = Portfolio;
