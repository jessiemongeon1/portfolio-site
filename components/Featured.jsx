function Featured() {
  return (
    <section id="featured" className="featured container">
      <div className="featured-head">
        <span className="eyebrow">Featured essay</span>
        <div className="asterism" style={{ margin: "12px 0 0", justifyContent: "flex-start" }}>
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
              <text x="60" y="340" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-soft)" letterSpacing="2">FIG.&nbsp;02&nbsp;—&nbsp;CONSENSUS,&nbsp;OBSERVED</text>
            </g>
          </svg>
        </div>

        <div className="featured-body">
          <div className="featured-meta">
            <span>Essay</span><span>·</span><span>28 min read</span><span>·</span><span>March 2026</span>
          </div>
          <h2 className="featured-title">
            The social life of <em>consensus</em>: what Byzantine generals whisper about at dinner.
          </h2>
          <p className="featured-dek">
            A long look at why distributed systems are, underneath the math, <span className="swoosh">human arguments
              <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            </span> held in unusually formal cages — and why the cage, not the argument, is the interesting part.
          </p>
          <div className="featured-actions">
            <a className="btn primary" href="#journal">Read the essay</a>
            <span className="featured-pub">Originally in <em>Protocol Review</em>, Issue 14</span>
          </div>
        </div>
      </article>
    </section>
  );
}

window.Featured = Featured;
