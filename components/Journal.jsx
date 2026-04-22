const JOURNAL_POSTS = [
  {
    id: "p1",
    title: "On writing for people who ship at 2 a.m.",
    dek: "Developer-facing prose is not technical writing's shy cousin. It is the main event.",
    tag: "Craft",
    date: "Apr 12, 2026",
    read: "9 min",
    accent: "blue",
    body: [
      "There is a particular kind of reader who opens your documentation at 2:04 a.m., three beers in, with a deploy going sideways. Everything you write is really written for them.",
      "I keep a small list of rules above my desk. They are unoriginal. They are, however, correct.",
      "One: the heading is a promise. Two: the first sentence pays it. Three: the code example is the thesis, and your paragraphs are the footnotes.",
      "The rest is care — the ordinary kind. It's the kind you apply to a sentence you have already read four times, and still want to read once more because the rhythm is slightly off.",
      "Write for the 2 a.m. reader. Not because they're important (though they are), but because writing for them makes everything else better. They do not have time for your cleverness. Neither, it turns out, does anyone else."
    ]
  },
  {
    id: "p2",
    title: "A field guide to protocol foundations, for people who are about to join one.",
    dek: "Governance is not a process. It is a weather pattern. Dress accordingly.",
    tag: "Notes",
    date: "Mar 30, 2026",
    read: "6 min",
    accent: "green",
    body: [
      "You are about to take a job at a protocol foundation. Congratulations. The stock, such as it is, will vest in four years, by which time the protocol may be either a public utility or a footnote. Both are fine outcomes.",
      "Here is what no one will tell you on the first day.",
      "The org chart is a suggestion. The real structure lives in four Signal groups, two of which you will never be added to. The third one is where the actual decisions are made; the fourth is where people complain about them.",
      "Every governance proposal is, secretly, a proposal about who gets to be tired on behalf of whom. Read them that way and the voting patterns make sense.",
      "Bring a good chair. You will be in it a long time."
    ]
  },
  {
    id: "p3",
    title: "The em-dash, and other small acts of resistance.",
    dek: "In praise of a punctuation mark that refuses to be optimized.",
    tag: "Essay",
    date: "Mar 14, 2026",
    read: "4 min",
    accent: "blue",
    body: [
      "The em-dash is an unruly thing. It does not know whether it is a comma, a colon, or a parenthesis, and it has decided, cheerfully, not to find out.",
      "Strunk would have us use it sparingly. Strunk was wrong about a great many things — I say this with love — and this is one of them.",
      "A sentence with an em-dash breathes differently. There is a small hinge, a change of mind, a half-step backward before a half-step forward. It is the closest punctuation comes to a shrug.",
      "In a world of tight, optimized prose, the em-dash is a little act of refusal. Keep one in your pocket."
    ]
  },
  {
    id: "p4",
    title: "Notes from the edge of a docs migration.",
    dek: "We moved 1,400 pages from one static site generator to another. I have feelings.",
    tag: "Work log",
    date: "Feb 22, 2026",
    read: "12 min",
    accent: "green",
    body: [
      "Every docs migration is a slow audit of your past decisions, performed in public, in front of users, while the page is on fire.",
      "We began with optimism. We ended with a spreadsheet called redirects_final_FINAL_v3.csv. Between the two was a lot of grep.",
      "The most useful tool turned out to be a plain-text file where we wrote down every decision, dated, with the person who made it. When someone, two weeks later, said 'why did we do it this way', we had an answer. Usually a boring one. Sometimes a good one.",
      "Document your migrations the way you would document your code. Future you is a different person with fewer friends."
    ]
  },
  {
    id: "p5",
    title: "Why I still write drafts by hand.",
    dek: "The keyboard is too fast. That is exactly the problem.",
    tag: "Craft",
    date: "Feb 02, 2026",
    read: "5 min",
    accent: "blue",
    body: [
      "The hand, as Annie Dillard knew, thinks at a different speed than the mind. Slower, yes, but also stranger — it knows things the mind is still working out.",
      "I write first drafts in a cheap notebook, with a fountain pen I bought used. It is a ridiculous affectation. It is also, measurably, the reason my sentences are better.",
      "When the hand is the bottleneck, only the sentences worth writing get written. The rest die on the trip from the thought to the page, which is where a lot of bad writing ought to die and doesn't, on a keyboard."
    ]
  },
  {
    id: "p6",
    title: "Against the white paper.",
    dek: "An argument that the form itself is the problem.",
    tag: "Opinion",
    date: "Jan 18, 2026",
    read: "8 min",
    accent: "green",
    body: [
      "The white paper is a genre invented by governments in the 1920s to seem more sober than press releases. It has worked. It continues to work. That is the problem.",
      "Every time we dress an idea in the clothes of a white paper, we inherit the genre's worst habit: the assumption that seriousness is a tone, not a property of the thinking.",
      "Write the memo. Write the long blog post. Write the essay. Call it what it is. The ideas will survive the honesty."
    ]
  }
];

function Journal({ onOpen }) {
  return (
    <section id="journal" className="journal container">
      <div className="journal-head">
        <div>
          <span className="eyebrow">Journal · Recent entries</span>
          <h2>Dispatches from the <span className="swoosh">desk
            <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
          </span>.</h2>
        </div>
        <p className="journal-sub">
          Short and long pieces, posted when I have something to say and not before. Usually twice a month.
        </p>
      </div>

      <ol className="journal-list">
        {JOURNAL_POSTS.map((p, i) => (
          <li key={p.id} className="journal-row" style={{ "--i": i }}>
            <button className="journal-card lift" onClick={() => onOpen(p)}>
              <span className={`j-accent j-accent-${p.accent}`} aria-hidden="true" />
              <div className="j-meta">
                <span className="j-num">№ {String(JOURNAL_POSTS.length - i).padStart(2, "0")}</span>
                <span className="j-tag">{p.tag}</span>
                <span className="j-date">{p.date}</span>
                <span className="j-read">{p.read}</span>
              </div>
              <h3 className="j-title">{p.title}</h3>
              <p className="j-dek">{p.dek}</p>
              <span className="j-cta">Read entry <span className="arrow">→</span></span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function JournalReader({ post, onClose }) {
  const bodyRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onScroll = (e) => {
      const el = bodyRef.current;
      if (!el) return;
      const pct = Math.min(1, Math.max(0, el.scrollTop / (el.scrollHeight - el.clientHeight)));
      setProgress(pct);
    };
    const el = bodyRef.current;
    if (el) el.addEventListener("scroll", onScroll);
    return () => { if (el) el.removeEventListener("scroll", onScroll); };
  }, [post]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="reader-overlay" role="dialog" aria-modal="true">
      <div className="reader-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="reader-bar">
        <button className="reader-close" onClick={onClose} aria-label="Close">
          <span>✕</span> Close
        </button>
        <div className="reader-bar-title">{post.tag} · {post.date}</div>
        <div className="reader-bar-right">{Math.round(progress * 100)}%</div>
      </div>

      <article className="reader-body" ref={bodyRef}>
        <div className="reader-inner">
          <div className="reader-meta">
            <span className="eyebrow">{post.tag}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.read}</span>
          </div>
          <h1 className="reader-title">{post.title}</h1>
          <p className="reader-dek">{post.dek}</p>
          <div className="asterism"><span>✦</span><span>✦</span><span>✦</span></div>
          <div className="reader-prose">
            {post.body.map((para, i) => (
              <p key={i} className={i === 0 ? "lede" : ""}>
                {i === 0 ? (
                  <>
                    <span className="dropcap">{para.charAt(0)}</span>
                    {para.slice(1)}
                  </>
                ) : para}
              </p>
            ))}
          </div>
          <div className="asterism"><span>✦</span><span>✦</span><span>✦</span></div>
          <p className="reader-sig">— J.M.</p>
        </div>
      </article>
    </div>
  );
}

// React hooks shadowed inside JournalReader — fix by not redeclaring
// (above redeclaration is a bug; remove it)

window.Journal = Journal;
window.JournalReader = JournalReader;
window.JOURNAL_POSTS = JOURNAL_POSTS;
