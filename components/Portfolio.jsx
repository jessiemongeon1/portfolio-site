const CLIPPINGS = [
  {
    id: "c1",
    pub: "CHAIN LEDGER QUARTERLY",
    sub: "Vol. XII · Issue 03 · Winter 2025",
    headline: "A plain-English tour of rollup economics",
    excerpt: "Rollups have been explained, in aggregate, about ten million times. Most of those explanations begin at layer two. This one begins at the diner.",
    kicker: "Feature · 4,200 words",
    year: "2025",
    accent: "blue",
    rot: -1.6,
    size: "tall"
  },
  {
    id: "c2",
    pub: "PROTOCOL REVIEW",
    sub: "Issue 14 · The Governance Number",
    headline: "What the Byzantine generals whisper about at dinner",
    excerpt: "There is a joke, inside the joke of the original problem, that the generals are not actually worried about the enemy. They are worried about each other.",
    kicker: "Essay · 8,100 words",
    year: "2026",
    accent: "green",
    rot: 1.2,
    size: "wide"
  },
  {
    id: "c3",
    pub: "FOUNDATION PRESS",
    sub: "Launch memo · Internal / public",
    headline: "Honey, a liquid staking primitive, in 900 words",
    excerpt: "We built the thing. Here is what it does, in the voice of someone who is willing to be wrong in public about what matters.",
    kicker: "Brand essay",
    year: "2025",
    accent: "blue",
    rot: -0.6,
    size: "sq"
  },
  {
    id: "c4",
    pub: "THE MINNEAPOLIS READER",
    sub: "Culture section · Sunday",
    headline: "The last honest man on Crypto Twitter",
    excerpt: "A profile of a pseudonymous developer who spent four years arguing, in good faith, with everyone, and emerged — improbably — with most of his friends.",
    kicker: "Profile · 6,400 words",
    year: "2025",
    accent: "green",
    rot: 1.8,
    size: "tall"
  },
  {
    id: "c5",
    pub: "DEVELOPER NOTES",
    sub: "Quarterly digest · No. 09",
    headline: "Writing SDKs that feel like writing",
    excerpt: "A short argument that API design is, at its honest core, a prose discipline. And that the style guide is the architecture.",
    kicker: "Talk → Essay",
    year: "2024",
    accent: "blue",
    rot: 0.8,
    size: "wide"
  },
  {
    id: "c6",
    pub: "BLOCKWORKS",
    sub: "Research brief",
    headline: "On the unreasonable patience of validators",
    excerpt: "They run the machines. They get yelled at on Discord. They are, against all odds, still here. A small taxonomy of the people who run the internet we forgot we built.",
    kicker: "Brief · 2,200 words",
    year: "2024",
    accent: "green",
    rot: -1.2,
    size: "sq"
  },
  {
    id: "c7",
    pub: "DECRYPT",
    sub: "Explainer · Front page",
    headline: "Account abstraction, for your mother",
    excerpt: "She does not want to know about ERC-4337. She wants to know if she will lose her money. The second question is the only one worth answering first.",
    kicker: "Explainer",
    year: "2024",
    accent: "blue",
    rot: 1.4,
    size: "tall"
  },
  {
    id: "c8",
    pub: "THE INDEX",
    sub: "Inaugural issue · Spring 2026",
    headline: "A writer walks into a data availability layer",
    excerpt: "Or: what happened when I spent six weeks living inside a protocol's internal Slack, and tried to leave with a readable paragraph.",
    kicker: "Field report",
    year: "2026",
    accent: "green",
    rot: -0.4,
    size: "wide"
  }
];

function Portfolio() {
  const [filter, setFilter] = React.useState("All");
  const tags = ["All", "Essay", "Feature", "Brief", "Explainer", "Profile"];
  const filtered = CLIPPINGS.filter(c =>
    filter === "All" || c.kicker.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="portfolio" className="portfolio container">
      <div className="portfolio-head">
        <span className="eyebrow">Clippings · Selected published work</span>
        <h2>A small, tidy <span className="swoosh">pile of paper
          <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
        </span>.</h2>
        <p className="portfolio-sub">
          Pieces published in places that still print. Hover to lift a clipping off the desk.
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
