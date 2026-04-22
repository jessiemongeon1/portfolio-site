const BLOG_POSTS = [
  {
    id: "p1",
    title: "Notes on finality, patience, and the feeling of waiting for a block.",
    dek: "Twelve seconds is not a long time unless it is. A small essay on the emotional cadence of confirmation.",
    date: "April 12, 2026",
    read: "7 min",
    tag: "Essay",
    accent: "blue",
    body: [
      "There is a particular quiet that lives inside the twelve seconds between submitting a transaction and watching it confirm. You know, roughly, what will happen. You've done this before. You are still, despite yourself, paying attention.",
      "I think about this quiet a lot. It is the only place on the internet where I am forced to be patient.",
      "The Ethereum block time is not a number I chose, or a number I approve of, or a number I would even recognize if I hadn't spent an embarrassing amount of time looking at block explorers. It is simply a rhythm I have learned to inhabit, the way a commuter learns the rhythm of a particular train.",
      "What's interesting is that other chains have other rhythms, and each rhythm trains a slightly different kind of attention. Solana's 400ms slot is a fidget. Bitcoin's ten minutes is a nap. Both are, in their way, meditations on what it means to agree with strangers about what just happened."
    ]
  },
  {
    id: "p2",
    title: "A glossary of words engineers use when they mean something else.",
    dek: "'Trustless' does not mean what you think it means. Neither does 'permissionless.' A field guide.",
    date: "March 28, 2026",
    read: "9 min",
    tag: "Glossary",
    accent: "green",
    body: [
      "Every field has its shibboleths. In Web3 the shibboleths are particularly slippery because they arrived pre-loaded with marketing.",
      "Consider 'trustless.' It does not mean, as a friend recently asked me over coffee, that you cannot trust the system. It means something closer to: the system has been designed so that you do not have to trust any single participant inside it.",
      "This is a distinction with teeth."
    ]
  },
  {
    id: "p3",
    title: "On writing documentation nobody reads (and why it still matters).",
    dek: "A defense of the README, the tooltip, and the changelog entry nobody will ever thank you for.",
    date: "March 10, 2026",
    read: "6 min",
    tag: "Craft",
    accent: "blue",
    body: [
      "The unread document is still a document. This is the central, slightly Zen truth of technical writing, and it is the truth that keeps me employed.",
      "Good docs are like good streetlights: most people never notice them, and the people who do notice them are usually the people who are lost."
    ]
  },
  {
    id: "p4",
    title: "Reading week: three protocol papers and a short story about a lighthouse.",
    dek: "What's on the desk this week, and why the lighthouse story belongs on it.",
    date: "February 22, 2026",
    read: "4 min",
    tag: "Reading",
    accent: "green",
    body: [
      "I try, every week, to read one piece of fiction alongside whatever technical thing I'm writing. The fiction is not a palate cleanser. It is a calibration tool."
    ]
  },
  {
    id: "p5",
    title: "Interviewing a protocol: questions I ask before I write a single word.",
    dek: "A checklist, more or less, for finding the shape of a system before describing it.",
    date: "February 04, 2026",
    read: "8 min",
    tag: "Process",
    accent: "blue",
    body: [
      "Before I write anything about a protocol I sit with the team for an hour and ask them questions that sound, at first, faintly insulting.",
      "What is this actually for? Who is currently using it? If it disappeared tomorrow, who would notice?"
    ]
  },
  {
    id: "p6",
    title: "The em-dash will outlive us all.",
    dek: "A small manifesto, written in defense of the most useful piece of punctuation in the English language.",
    date: "January 19, 2026",
    read: "3 min",
    tag: "Miscellany",
    accent: "green",
    body: [
      "I am not neutral on this subject. I use em-dashes the way other people use caffeine."
    ]
  }
];

function BlogIndex({ onOpen }) {
  return (
    <section id="journal" className="journal container">
      <div className="section-head">
        <div>
          <span className="eyebrow">The journal</span>
          <h2>
            <span className="swoosh">Recent
              <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            </span> posts, mostly at night.
          </h2>
        </div>
        <a href="#" className="section-link" onClick={(e) => e.preventDefault()}>View all →</a>
      </div>

      <ol className="post-list">
        {BLOG_POSTS.map((p, i) => (
          <li key={p.id} className={`post-row ${p.accent}`} style={{ animationDelay: `${i * 60}ms` }}>
            <button className="post-row-btn" onClick={() => onOpen(p)}>
              <span className="post-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="post-main">
                <div className="post-meta">
                  <span className="post-tag">{p.tag}</span>
                  <span>·</span>
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.read}</span>
                </div>
                <h3 className="post-title">{p.title}</h3>
                <p className="post-dek">{p.dek}</p>
              </div>
              <span className="post-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
            <span className="post-row-rule" />
          </li>
        ))}
      </ol>
    </section>
  );
}

window.BlogIndex = BlogIndex;
window.BLOG_POSTS = BLOG_POSTS;
