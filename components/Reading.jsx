const READING = [
  { title: "The Writing Life", author: "Annie Dillard", status: "re-reading", note: "The hand thinking at a different speed." },
  { title: "Several Short Sentences About Writing", author: "Verlyn Klinkenborg", status: "on desk", note: "The best book on revision I own." },
  { title: "A Swim in a Pond in the Rain", author: "George Saunders", status: "underlined heavily", note: "Generous, rigorous, warm." },
  { title: "Seeing Like a State", author: "James C. Scott", status: "halfway", note: "Feels relevant to governance, somehow." },
  { title: "The Dawn of Everything", author: "Graeber & Wengrow", status: "paused", note: "Enormous, in every direction." }
];

function Reading() {
  return (
    <section className="reading container">
      <div className="reading-grid">
        <div className="reading-col">
          <span className="eyebrow">Currently reading</span>
          <h2>On the nightstand.</h2>
          <p className="reading-blurb">
            A slow, rotating pile. Updated when I remember. Recommendations warmly received, gently not acted upon.
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
            <h2>Working on something <em>worth reading</em>?</h2>
            <p>
              I take on a handful of writing projects each quarter — docs, launch essays, long-form editorial. The best way to reach me is a short email with what you're building and when.
            </p>
            <a className="btn primary" href="mailto:hello@jessiemongeon.com">hello@jessiemongeon.com</a>
          </div>
          <div className="contact-meta">
            <ul>
              <li><span className="k">Twitter / X</span><a href="#">@jessiewrites</a></li>
              <li><span className="k">Bluesky</span><a href="#">jessie.bsky.social</a></li>
              <li><span className="k">LinkedIn</span><a href="#">/in/jessiemongeon</a></li>
              <li><span className="k">Mirror</span><a href="#">jessie.mirror.xyz</a></li>
              <li><span className="k">RSS</span><a href="#">/feed.xml</a></li>
            </ul>
            <div className="contact-quote">
              "She writes with the calm of someone who has already read the thread."
              <span className="attrib">— a generous editor</span>
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
