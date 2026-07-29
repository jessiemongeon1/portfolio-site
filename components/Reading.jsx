const READING = [
  { title: "Docs for Developers", author: "Bharat Bhargava et al.", status: "on desk", note: "The closest thing to a standard the field has." },
  { title: "Every Page is Page One", author: "Mark Baker", status: "re-reading", note: "Information architecture as a first principle." },
  { title: "The Product Is Docs", author: "Splunk Documentation Team", status: "underlined heavily", note: "Honest about the operational reality of docs work." },
  { title: "Making Work Visible", author: "Dominica DeGrandis", status: "halfway", note: "The invisible work problem, finally named." },
  { title: "Team Topologies", author: "Skelton & Pais", status: "paused", note: "Thinking about how docs teams fit into the rest." }
];

function Reading() {
  return (
    <section className="reading container">
      <div className="reading-grid">
        <div className="reading-col">
          <span className="eyebrow">Currently reading</span>
          <h2>On the nightstand.</h2>
          <p className="reading-blurb">
            A slow, rotating pile. Mostly technical writing, docs strategy, and team structure. Updated when I remember.
          </p>
        </div>
        <ul className="reading-list">
          {READING.map((b, i) => (
            <li key={i} className="reading-row" style={{ "--i": i }}>
              <div className="book-spine" aria-hidden="true">
                <div className="spine-stripe" />
                <div className="spine-stripe" />
              </div>
              <div className="book-meta">
                <div className="book-title">
                  <em>{b.title}</em> <span className="book-author">— {b.author}</span>
                </div>
                <div className="book-note">"{b.note}"</div>
              </div>
              <div className="book-status">{b.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact container">
      <div className="contact-card">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2>Building something that needs <em>great docs</em>?</h2>
            <p>
              I work with protocols, foundations, and developer-facing teams on docs strategy, onboarding, and technical education. The best way to reach me is a short email with what you're building and what's broken.
            </p>
            <a className="btn primary" href="mailto:jessie.writes.docs@gmail.com">jessie.writes.docs@gmail.com</a>
          </div>
          <div className="contact-meta">
            <ul>
              <li><span className="k">LinkedIn</span><a href="https://www.linkedin.com/in/jessie-mongeon/" target="_blank" rel="noreferrer">/in/jessie-mongeon</a></li>
              <li><span className="k">Amazon</span><a href="https://www.amazon.com/stores/Jessie-Mongeon/author/B0BG9D7WZP" target="_blank" rel="noreferrer">Author page</a></li>
              <li><span className="k">Twitter / X</span><a href="https://x.com/JessieWritesx" target="_blank" rel="noreferrer">@JessieWritesx</a></li>
              <li><span className="k">GitHub</span><a href="https://github.com/jessiemongeon1" target="_blank" rel="noreferrer">/jessiemongeon1</a></li>
            </ul>
            <div className="contact-quote">
              "The docs that drive adoption are the ones that reduce the distance between a developer's question and the answer."
              <span className="attrib">— from Mastering Web3 Documentation</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-row">
          <span>© 2026 Jessie Mongeon</span>
          <span className="dot" />
          <span>Set in Fraunces &amp; Source Serif 4</span>
          <span className="dot" />
          <span>Hand-built, imperfect, maintained.</span>
        </div>
      </footer>
    </section>
  );
}

window.Reading = Reading;
window.Contact = Contact;
