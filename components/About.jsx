function About() {
  return (
    <section id="about" className="about container">
      <div className="about-grid">
        <div className="about-photo">
          <div className="photo-frame">
            <div className="tape" style={{ top: -10, left: 24 }} />
            <div className="tape" style={{ bottom: -10, right: 18, transform: "rotate(5deg)", background: "color-mix(in oklch, var(--accent-2) 70%, transparent)" }} />
            <svg className="portrait-placeholder" viewBox="0 0 300 380" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <rect width="10" height="10" fill="var(--paper-2)" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="var(--rule)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="300" height="380" fill="url(#stripes)" />
              <text x="150" y="195" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" letterSpacing="2" fill="var(--ink-mute)">[ PORTRAIT — 3:4 ]</text>
            </svg>
          </div>
          <p className="caption">Photograph by someone kind, autumn 2024.</p>
        </div>
      <div className="about-copy">
        <span className="eyebrow">About</span>
        <h2>A technical writer with a <em>builder's</em> instinct.</h2>
        <p>
          I'm Jessie. For the last six years I've been embedded in Web3 &mdash; writing the docs, tutorials, and education that help developers actually build. Most recently I lead the Builder Education team at Mysten Labs; before that I owned all of developer documentation for the Internet Computer at DFINITY, racking up 5,000+ commits and redesigning the docs from the ground up.
        </p>
        <p>
          I care about the full stack of developer experience: information architecture, onboarding flows, the sentence that makes a concept click. I've also published two books on Web3 and technical writing, because some ideas need more than a docs page.
        </p>
        <ul className="about-facts">
          <li><span className="k">Based</span><span className="v">Austin, TX</span></li>
          <li><span className="k">Currently</span><span className="v">Tech Lead Manager, Builder Education @ Mysten Labs</span></li>
          <li><span className="k">Specialty</span><span className="v">Developer docs, onboarding, information architecture, Web3 & AI</span></li>
          <li><span className="k">Books</span><span className="v">The Ultimate Web3 Pocket Guide &amp; Mastering Web3 Documentation</span></li>
        </ul>
      </div>
    </section>
  );
}

window.About = About;
