const { useState, useEffect, useRef } = React;
function Hero() {
  const sentence = "I write docs, education, and developer content for the protocols building what's next.";
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i++;
      setTyped(sentence.slice(0, i));
      if (i < sentence.length) {
        const ch = sentence[i - 1];
        const delay = ch === "," || ch === "." ? 260 : (Math.random() * 20 + 34);
        setTimeout(tick, delay);
      } else {
        setDone(true);
      }
    };
    const kickoff = setTimeout(tick, 600);
    return () => { cancelled = true; clearTimeout(kickoff); };
  }, []);
  return (
    <header className="hero" id="top">
      <nav className="hero-nav container">
        <a className="wordmark" href="#top">
          <span className="wm-j">J</span>essie&nbsp;Mongeon
        </a>
        <ul className="hero-links">
          <li><a href="#about">About</a></li>
          <li><a href="#featured">Featured</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div className="container hero-inner">
        <div className="hero-eyebrow">
          <span className="dot" /> <span className="eyebrow">Technical Writer · Web3 &amp; AI · Builder Education ·&nbsp;est.&nbsp;2021</span>
        </div>
        <h1 className="hero-headline">
          <span className="line-1">
            <span className="swoosh">
              Docs
              <svg viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            that help
          </span>
          <span className="line-2">
            builders <em>actually</em> build.
          </span>
        </h1>
        <p className="hero-sentence">
          {typed}
          <span className={`caret ${done ? "done" : ""}`}>▍</span>
        </p>
        <div className="hero-meta">
          <div className="meta-card">
            <span className="eyebrow">Currently</span>
            <span>Tech Lead Manager, Builder Education @ Mysten Labs.</span>
          </div>
          <div className="meta-actions">
            <a className="btn primary" href="#featured">See featured work</a>
            <a className="btn" href="#portfolio">View portfolio</a>
          </div>
        </div>
        <div className="blob blob-a" aria-hidden="true" />
        <div className="blob blob-b" aria-hidden="true" />
        <div className="hero-margin-note" aria-hidden="true">
          <span>fig. 1 — a technical writer, somewhere in Austin, making complexity legible.</span>
        </div>
      </div>
    </header>
  );
}
window.Hero = Hero;
