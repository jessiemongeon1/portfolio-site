const CLIPPINGS = [
  {
    id: "c1",
    pub: "MYSTEN LABS",
    sub: "Builder Education · Developer Docs",
    headline: "Getting started with Sui: your first Move module in 20 minutes",
    excerpt: "Move is not Solidity. The sooner you stop mapping one to the other, the sooner the object model starts to make sense.",
    kicker: "Tutorial · Developer Education",
    year: "2026",
    accent: "blue",
    rot: -1.6,
    size: "tall"
  },
  {
    id: "c2",
    pub: "INTERNET COMPUTER",
    sub: "ICP Developer Docs · DFINITY",
    headline: "Chain Fusion, explained: how ICP talks to every other blockchain",
    excerpt: "Most cross-chain bridges move assets. Chain Fusion moves computation. That distinction is either obvious or everything, depending on where you're standing.",
    kicker: "Explainer · Developer Docs",
    year: "2025",
    accent: "green",
    rot: 1.2,
    size: "wide"
  },
  {
    id: "c3",
    pub: "SELF-PUBLISHED",
    sub: "The Ultimate Web3 Pocket Guide · 540 pp.",
    headline: "What a blockchain actually is, for people who are done pretending",
    excerpt: "A shared ledger that no single entity controls, enforced by the network itself. Everything else is footnotes. Here are the footnotes.",
    kicker: "Book · Reference",
    year: "2022",
    accent: "blue",
    rot: -0.6,
    size: "sq"
  },
  {
    id: "c4",
    pub: "SELF-PUBLISHED",
    sub: "Mastering Web3 Documentation",
    headline: "Why your docs exist and still fail developers",
    excerpt: "The information is there. The architecture isn't. A case-study-driven guide to the difference between documentation that exists and documentation that works.",
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
    headline: "Decentralized storage: the backbone of Web3",
    excerpt: "IPFS is not a backup solution. It is an addressing system that makes content persistent without making any single server responsible for it.",
    kicker: "Whitepaper · 3,800 words",
    year: "2022",
    accent: "blue",
    rot: 0.8,
    size: "wide"
  },
  {
    id: "c6",
    pub: "FILEBASE",
    sub: "eBook · Onboarding",
    headline: "Migrating to Web3: a cheat sheet for developers who've been meaning to",
    excerpt: "You don't have to abandon your S3 workflow. You just have to understand what you're pointing it at now, and why that changes the failure modes.",
    kicker: "eBook · Developer Education",
    year: "2023",
    accent: "green",
    rot: -1.2,
    size: "sq"
  },
  {
    id: "c7",
    pub: "DFINITY",
    sub: "ICP Developer Blog · Community Update",
    headline: "Six months of user studies: what ICP developers actually need",
    excerpt: "They didn't want more content. They wanted the content to stop hiding the answer three clicks from where they started.",
    kicker: "Research Summary",
    year: "2024",
    accent: "blue",
    rot: 1.4,
    size: "tall"
  },
  {
    id: "c8",
    pub: "HACK MIT",
    sub: "Workshop · Live Presentation",
    headline: "Building with Chain Fusion: a live walkthrough for people who just arrived",
    excerpt: "A hackathon workshop has one job: get a developer to their first working thing before the energy in the room dies. Everything else is a distraction.",
    kicker: "Talk · Workshop",
    year: "2024",
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
