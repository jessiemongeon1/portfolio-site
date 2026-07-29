function Featured() {
  return (
    <section id="featured" className="featured container">
      <div className="featured-head">
        <span className="eyebrow">Featured work</span>
        <div className="asterism" style={{ margin: "12px 0 0" }}>
          <span>✦</span><span>✦</span><span>✦</span>
        </div>
      </div>
      <article className="featured-card">
        <div className="featured-media" aria-hidden="true">
          <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" className="featured-svg">
            <defs>
              <linearGradient id="fwash" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="var(--blue)" />
                <stop offset="1" stopColor="var(--green)" />
              </linearGradient>
              <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="var(--ink-soft)" opacity=".18" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#fwash)" />
            <rect width="600" height="420" fill="url(#dots)" />
            <g opacity=".85">
              <circle cx="430" cy="140" r="90" fill="var(--paper)" opacity=".55" />
              <circle cx="430" cy="140" r="60" fill="none" stroke="var(--ink)" strokeWidth="1" />
              <circle cx="430" cy="140" r="30" fill="none" stroke="var(--ink)" strokeWidth="1" />
              <line x1="60" y1="360" x2="540" y2="360" stroke="var(--ink)" strokeWidth="1" opacity=".4" />
              <text x="60" y="340" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-soft)" letterSpacing="2">FIG.&nbsp;02&nbsp;—&nbsp;DEVELOPER&nbsp;ONBOARDING,&nbsp;MAPPED</text>
            </g>
          </svg>
        </div>
        <div className="featured-body">
          <div className="featured-meta">
            <span>Book</span><span>·</span><span>2026 Edition</span>
          </div>
          <h2 className="featured-title">
            The Ultimate Web3 <em>Pocket Guide</em>: 2026 edition — updated for everything that's changed.
          </h2>
          <p className="featured-dek">
            The fully revised 2026 edition of the field guide to the Web3 stack — protocols, wallets, consensus, storage, and the{" "}
            <span className="swoosh">mental models
              <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            </span>{" "}
            that make it click. Rewritten and expanded to cover the current landscape, for developers who are tired of tutorials that skip the hard parts.
          </p>
          <div className="featured-actions">
            <a className="btn primary" href="https://www.amazon.com/Ultimate-Web3-Pocket-Guide-Second-ebook/dp/B0GZWHD6DZ" target="_blank" rel="noreferrer">View on Amazon</a>
            <span className="featured-pub">Also by Jessie: <em>Mastering Web3 Documentation</em></span>
          </div>
        </div>
      </article>
    </section>
  );
}
window.Featured = Featured;
