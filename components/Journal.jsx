const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p1",
    title: "What writing 540 pages taught me about explaining anything.",
    dek: "A field guide is only as good as the thing it assumes you don't know yet.",
    tag: "Craft",
    date: "Apr 20, 2026",
    read: "7 min",
    accent: "blue",
    body: [
      "When I started writing The Ultimate Web3 Pocket Guide, I thought the hard part would be the research. It wasn't. The hard part was deciding what to leave out.",
      "A 540-page technical handbook covers a lot of ground: blockchains, smart contracts, wallets, NFTs, DAOs, decentralized storage, developer tooling. The ecosystem is enormous and moves fast. New projects launch while you're mid-sentence. Terminology forks without warning.",
      "What I learned is that a field guide isn't a textbook. It doesn't need to prove it knows everything. It needs to be the thing you reach for when you're confused at 11 p.m. and need one clear explanation before you can move forward.",
      "Each section ends with a quick-reference page: names, facts, ecosystem context. Not because I was padding the page count, but because readers return to reference material. They don't re-read explanations — they scan for the thing they half-remember.",
      "The discipline of writing for reference changes how you write for reading. You stop burying the answer. You learn to trust the heading to carry the promise and the first paragraph to pay it. The rest of your sentences are allowed to be interesting, but only after the work is done."
    ]
  },
  {
    id: "p2",
    title: "Documentation that drives adoption: what the data actually shows.",
    dek: "Developers don't abandon bad protocols. They abandon bad docs.",
    tag: "Notes",
    date: "Apr 05, 2026",
    read: "8 min",
    accent: "green",
    body: [
      "I ran six rounds of user studies at DFINITY. The finding that surprised me most wasn't about content at all — it was about navigation. Developers would arrive with the right question, find a page that contained the answer, and leave without it. The information was there. The structure failed them.",
      "This is the part of documentation strategy that's easy to skip when you're resource-constrained: the audit of how information is organized, not just whether it exists.",
      "For the ICP developer docs overhaul, we redesigned the information architecture before we rewrote a single page. Onboarding success went up. Support ticket volume went down. Five thousand commits later, I still think that first decision — structure before content — was the most valuable one we made.",
      "In Mastering Web3 Documentation, I spend a lot of time on this: the difference between documentation that exists and documentation that works. They're not the same thing, and the gap between them is usually architecture, not prose.",
      "The docs that drive adoption are the ones that reduce the distance between a developer's question and the answer. That's it. Every other opinion I have about technical writing is downstream of that one."
    ]
  },
  {
    id: "p3",
    title: "Why Web3 docs fail developers who are almost ready to build.",
    dek: "The gap between 'conceptual overview' and 'working code' is where developers go quiet.",
    tag: "Essay",
    date: "Mar 22, 2026",
    read: "6 min",
    accent: "blue",
    body: [
      "There's a specific kind of developer who is the hardest to write for. They're not a beginner — they understand blockchain fundamentals, they know what a smart contract is, they've read your overview docs twice. But they haven't shipped anything yet. They're right on the edge.",
      "Most Web3 documentation ignores them. It's written for either the very new (here's what a wallet is) or the very experienced (here's the API reference). The middle — the almost-builder — falls through.",
      "I wrote the quickstart series for ICP specifically for this person. Language-agnostic, focused on the first working thing, not the most impressive thing. Get them to a deploy. Let them feel the protocol move.",
      "The tutorial series — 36 parts, 6 levels — came later, for the developers who wanted to go deeper after that first success. But the quickstart is the door. If it's too heavy, too conceptual, or too dependent on assumed context, the developer doesn't walk through it. They open another tab.",
      "Good onboarding documentation is ruthless about one thing: it knows exactly where the reader is when they arrive, and it meets them there."
    ]
  },
  {
    id: "p4",
    title: "On building a docs team roadmap when everything is on fire.",
    dek: "You can have a strategy or you can have a crisis. Most docs teams have both, badly.",
    tag: "Work log",
    date: "Mar 08, 2026",
    read: "9 min",
    accent: "green",
    body: [
      "The first thing I did when I took over documentation strategy at DFINITY was build a roadmap. This sounds obvious. It wasn't. There was no existing roadmap, there were seven pending overhauls, and three teams had opinions about what the docs should say.",
      "A docs roadmap isn't a list of things to write. It's a set of decisions about what matters in what order, and a record of why you made them. The 'why' is the part people skip, and it's the part that saves you six months later when someone asks why you did it this way.",
      "I also introduced a style guide and release coordination process. Not because I love process — I don't, especially — but because consistency is a form of trust. When developers read documentation that sounds like one person wrote it, they read faster. The cognitive overhead of adjusting to a new voice disappears.",
      "The roadmap, the style guide, the feedback loops: none of it is glamorous. But it's the infrastructure that lets you do the interesting work — the tutorials, the user studies, the onboarding redesigns — without the whole thing collapsing when one person takes a week off."
    ]
  },
  {
    id: "p5",
    title: "The case for writing a book while working a full-time job.",
    dek: "It will take longer than you think. Do it anyway.",
    tag: "Craft",
    date: "Feb 15, 2026",
    read: "5 min",
    accent: "blue",
    body: [
      "I self-published The Ultimate Web3 Pocket Guide while working full-time as a senior technical writer. I do not recommend it as a restful experience. I recommend it anyway.",
      "Writing a book forces a kind of synthesis that day-to-day documentation work doesn't require. You can't link to the next page. You can't say 'see also.' You have to make things cohere across 540 pages without the reader having any context except what you've given them.",
      "The discipline of that — the long-form, self-contained explanation — made me a better technical writer for everything else. My docs got tighter. My onboarding flows got cleaner. My information architecture decisions got faster, because I'd already made the hard version of every one of them at book scale.",
      "Mastering Web3 Documentation came out of the same impulse: there was no single resource for technical writers working in Web3 specifically. The ecosystem is strange. The audience assumptions are different. The tooling is different. Someone had to write that book. It was going to be me anyway, so I did."
    ]
  },
  {
    id: "p6",
    title: "What blockchain actually is, for people who've pretended to know long enough.",
    dek: "A clear explanation shouldn't require a whitepaper first.",
    tag: "Explainer",
    date: "Jan 28, 2026",
    read: "6 min",
    accent: "green",
    body: [
      "The most common question I got after publishing The Ultimate Web3 Pocket Guide wasn't a Web3 question. It was: 'Why doesn't anyone explain this clearly?'",
      "They do. The explanations exist. They are buried in whitepapers, scattered across forum threads, written by engineers for engineers who already know most of it. The technical clarity is there. The accessibility isn't.",
      "A blockchain is a ledger. It records transactions. What makes it different from the ledger your bank keeps is that no single entity controls it — copies exist across thousands of nodes, and the rules for updating it are enforced by the network itself, not by a central authority.",
      "That's the core of it. Everything else — smart contracts, tokens, DAOs, Layer 2s, zero-knowledge proofs — is built on top of that one idea: a shared record that no one owns and everyone can verify.",
      "The job of a technical writer in Web3 is to find the sentence that makes that click for a developer who's smart, skeptical, and tired of jargon. That sentence exists. Finding it is the work."
    ]
  }
];

function Journal({ onOpen }) {
  return (
    <section id="journal" className="journal container">
      <div className="journal-head">
        <div>
          <span className="eyebrow">Journal · Recent entries</span>
          <h2>Notes from the <span className="swoosh">field
            <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
          </span>.</h2>
        </div>
        <p className="journal-sub">
          Writing about docs, Web3, developer education, and the craft of making complex things legible. Posted when there's something worth saying.
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
    const el = bodyRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = Math.min(1, Math.max(0, el.scrollTop / (el.scrollHeight - el.clientHeight)));
      setProgress(pct);
    };
    el.addEventListener("scroll", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); };
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

window.Journal = Journal;
window.JournalReader = JournalReader;
window.JOURNAL_POSTS = JOURNAL_POSTS;
