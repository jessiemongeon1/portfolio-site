function Contact() {
  const [copied, setCopied] = React.useState(false);
  const email = "jessie@jessiemongeon.ink";

  const copy = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-copy">
            <span className="eyebrow">Get in touch</span>
            <h2 className="contact-headline">
              Writing a thing?<br/>
              <span className="swoosh">I'd love
                <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
              </span> to hear about it.
            </h2>
            <p>
              Drafts, briefs, three-line ideas at 1 a.m. — all welcome. I'm currently booking projects for Q3 2026 and reply to most messages within a working day.
            </p>

            <div className="contact-actions">
              <button className="btn primary" onClick={copy}>
                {copied ? "Copied ✓" : "Copy email"}
              </button>
              <a className="btn" href={`mailto:${email}`}>Write a letter →</a>
            </div>
            <p className="contact-email"><span className="eyebrow">Email</span> {email}</p>
          </div>

          <aside className="contact-card">
            <div className="eyebrow">Elsewhere on the internet</div>
            <ul className="social-list">
              <li><a href="#" onClick={e=>e.preventDefault()}><span>Twitter</span><span className="handle">@jessiewrites</span></a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}><span>Are.na</span><span className="handle">/jessie-mongeon</span></a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}><span>Substack</span><span className="handle">thequietledger.substack.com</span></a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}><span>LinkedIn</span><span className="handle">/in/jessiemongeon</span></a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}><span>GitHub</span><span className="handle">@jmongeon-docs</span></a></li>
            </ul>
            <div className="contact-hours">
              <span className="eyebrow">Office hours</span>
              <p>Tue &amp; Thu, 10a–12p CT.<br/><span className="mute">Book a 30-minute slot.</span></p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="site-footer container">
        <div className="footer-rule" />
        <div className="footer-row">
          <span>© 2026 Jessie Mongeon</span>
          <span className="mono">Set in Fraunces &amp; Source Serif. Hand-built, Minneapolis.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </section>
  );
}

window.Contact = Contact;
