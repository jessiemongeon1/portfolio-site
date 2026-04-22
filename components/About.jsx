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
          <h2>A technical writer with a <em>literary</em> bent.</h2>
          <p>
            I'm Jessie. For the last six years I've been translating between engineers and everyone else &mdash; docs, long-form essays, white papers, launch notes. My beat is Web3: the protocols that keep ledgers honest, the humans who argue about them at 2 a.m., and the strange, stubborn poetry of distributed systems.
          </p>
          <p>
            I care about sentences. I believe a well-built paragraph can be load-bearing. I've written for protocols, foundations, and a handful of magazines that still believe in em-dashes.
          </p>

          <ul className="about-facts">
            <li><span className="k">Based</span><span className="v">Minneapolis, MN</span></li>
            <li><span className="k">Bylines</span><span className="v">CoinDesk, Decrypt, Blockworks &amp; internal docs you'll never read</span></li>
            <li><span className="k">Specialty</span><span className="v">Protocol docs, developer education, brand essays</span></li>
            <li><span className="k">Currently</span><span className="v">Available for Q3 projects</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

window.About = About;
