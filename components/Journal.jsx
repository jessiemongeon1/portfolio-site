const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p1",
    title: "Why I rewrote the Web3 Pocket Guide from scratch for the second edition",
    dek: "The ecosystem changed. The explanations had to change with it.",
    tag: "Books",
    date: "Apr 20, 2026",
    read: "7 min",
    accent: "blue",
    body: [
      "When I published the first edition of The Ultimate Web3 Pocket Guide in 2022, the ecosystem looked different. NFTs were dominating the conversation, Layer 2s were still emerging, and most developers I talked to were trying to figure out where to even start. The book was written for that moment – a comprehensive field guide to the full Web3 stack.",
      "By 2025, almost every section needed significant revision. New consensus mechanisms had matured. Entire categories of decentralized applications had emerged that didn't exist when I wrote the first edition. The tooling landscape for developers had shifted substantially, with new SDKs, new chains, and new approaches to building on-chain.",
      "I could have updated a few chapters and called it a revision. Instead, I chose to rewrite from scratch. The reason is simple: a reference guide is only useful if the reader can trust it. If half the content reflects the current state of the ecosystem and the other half reflects 2022, the reader doesn't know which half they're reading. That uncertainty defeats the purpose of a pocket guide.",
      "The second edition keeps the same structure – blockchains, consensus, wallets, smart contracts, storage, tokens, and developer tooling – but every section has been rewritten to reflect what the ecosystem actually looks like now. New projects have been added, outdated ones have been removed, and the explanations have been refined based on three more years of writing developer education.",
      "The hardest part wasn't the research. It was deciding, again, what to leave out. The ecosystem has only gotten bigger since 2022, and a pocket guide isn't a catalog. It's a curated set of explanations designed to help you understand the landscape without drowning in it."
    ]
  },
  {
    id: "p2",
    title: "What I learned redesigning developer docs from the ground up at DFINITY",
    dek: "Five thousand commits, six rounds of user studies, and one big lesson about information architecture.",
    tag: "Docs strategy",
    date: "Apr 05, 2026",
    read: "8 min",
    accent: "green",
    body: [
      "When I joined DFINITY to own the Internet Computer developer documentation, there wasn't a centralized docs strategy. There were docs – scattered across repositories, wikis, and blog posts – but there wasn't a coherent system for organizing them. Developers would arrive with a specific question, spend time navigating between multiple sources, and often leave without finding what they needed.",
      "The first thing I did was run user studies. Not surveys – actual sit-down sessions where I watched developers try to complete tasks using the docs. The finding that shaped everything that followed wasn't about content quality. It was about navigation. Developers could find *a* page about their topic, but they couldn't find *the* answer on that page. The information architecture was the problem.",
      "We redesigned the entire structure before rewriting a single page. This meant defining a clear taxonomy: conceptual guides, tutorials, reference material, and how-to guides. Each type of document has a different purpose and a different reader. Mixing them together – which is what most docs do by default – creates pages that partially serve everyone and fully serve no one.",
      "Over the next two years, I made roughly 5,000 commits to the docs repository. We built a tutorial series with 36 parts across 6 difficulty levels. We created quickstart guides designed to get developers to their first deploy in minutes. Support ticket volume dropped. Onboarding completion rates improved.",
      "The lesson I keep coming back to is that documentation quality isn't primarily about the writing. It's about the structure. You can have clearly written content that fails developers because it's organized in a way that hides the answer. Information architecture isn't a nice-to-have; it's the foundation that everything else depends on."
    ]
  },
  {
    id: "p3",
    title: "Moving from ICP to Sui: what changes and what doesn't when you switch ecosystems",
    dek: "The technology is different. The documentation problems are the same.",
    tag: "Transition",
    date: "Mar 22, 2026",
    read: "6 min",
    accent: "blue",
    body: [
      "Earlier this year I moved from DFINITY, where I led developer documentation for the Internet Computer, to Mysten Labs, where I now lead the Builder Education team for Sui. The two ecosystems are technically very different – ICP uses canisters and Motoko; Sui uses objects and Move. The programming models, the consensus mechanisms, and the developer tooling have almost nothing in common.",
      "What's the same is the documentation challenge. Developers arrive with varying levels of blockchain experience. They need to understand a new programming model that doesn't map neatly onto what they already know. The conceptual docs have to explain enough context without burying the reader in theory, and the tutorials have to get to a working result fast enough that the developer stays engaged.",
      "Sui's object model is a good example. Move treats everything as an object with defined ownership – this is fundamentally different from the account-based model that Ethereum developers are used to. Explaining this well means meeting developers where they are, not where you wish they were. You have to acknowledge the model they're coming from before you can explain the model they're moving to.",
      "The structural lessons from DFINITY have transferred directly. Start with a quickstart that prioritizes the first successful deploy. Build tutorials that progress through difficulty levels. Separate conceptual content from procedural content. Use the same information architecture principles, even though the underlying technology is completely different."
    ]
  },
  {
    id: "p4",
    title: "How I think about onboarding documentation for a new blockchain",
    dek: "The quickstart isn't the first thing developers read. It's the first thing they do.",
    tag: "Process",
    date: "Mar 08, 2026",
    read: "9 min",
    accent: "green",
    body: [
      "Every blockchain has a conceptual overhead problem. Before a developer can write their first line of code, they need to understand at least some of the underlying model – what a transaction is on this chain, how state is managed, what the deployment process looks like. This is unavoidable. The question is how much of that overhead belongs in the quickstart and how much belongs elsewhere.",
      "My approach has been consistent across both ICP and Sui: the quickstart should contain the absolute minimum context needed to reach a working deploy. Not the minimum to understand the system – the minimum to *use* it. Understanding comes later, through tutorials and conceptual guides. The quickstart's job is to create a successful experience as fast as possible.",
      "This means making hard editorial decisions. At ICP, the quickstart originally included a section on the consensus mechanism. This is interesting and important, but it's not required to deploy a canister. I moved it to a conceptual guide. The quickstart got shorter, and completion rates went up.",
      "At Sui, the same principle applies. A developer doesn't need to fully understand the object model to create their first Move module and deploy it. They need to understand *enough* – what an object is, that objects have owners, that transactions modify objects. The deeper explanation of ownership types, dynamic fields, and capability patterns can come in the tutorial series.",
      "The hardest thing about writing onboarding documentation is resisting the urge to explain everything upfront. Developers don't need a complete mental model before they start building. They need a working mental model that they can refine as they go."
    ]
  },
  {
    id: "p5",
    title: "Writing a second book: what Mastering Web3 Documentation is actually about",
    dek: "There wasn't a resource for technical writers working in Web3. So I wrote one.",
    tag: "Books",
    date: "Feb 15, 2026",
    read: "5 min",
    accent: "blue",
    body: [
      "Mastering Web3 Documentation started as a set of notes I kept for myself while working on the ICP developer docs. I was making decisions about information architecture, content strategy, and documentation workflows that I couldn't find discussed in any existing resource. There are good books about technical writing in general, but nothing that addressed the specific challenges of documenting decentralized protocols.",
      "Web3 documentation has unique constraints. The technology moves fast – protocols ship breaking changes regularly, and documentation has to keep pace. The audience is unusually diverse, ranging from experienced backend developers to people who are entirely new to blockchain. The terminology is often loaded with marketing language that a technical writer has to cut through without alienating the community that uses it.",
      "The book covers the full lifecycle of Web3 documentation: strategy, information architecture, writing, tooling, user research, and maintenance. It draws on case studies from my work at DFINITY and includes the frameworks I developed for structuring developer docs, running user studies, and coordinating documentation with engineering releases.",
      "I self-published both books while working full-time. The process of writing a book forces a kind of synthesis that day-to-day documentation work doesn't require. You can't link to the next page or say 'learn more about X.' Every concept has to be self-contained, and the structure has to hold across hundreds of pages without the reader losing the thread."
    ]
  },
  {
    id: "p6",
    title: "What I mean when I say 'developer education' instead of 'developer docs'",
    dek: "Documentation is part of it. But only part.",
    tag: "Strategy",
    date: "Jan 28, 2026",
    read: "6 min",
    accent: "green",
    body: [
      "At Mysten Labs, my team is called Builder Education, not Developer Documentation. This isn't a rebrand for the sake of it. The distinction reflects a genuine difference in scope. Documentation – reference pages, API guides, configuration details – is one piece of what developers need to be successful on a new platform. But it isn't sufficient on its own.",
      "Developer education includes documentation, but it also includes tutorials, quickstart guides, sample applications, workshop materials, hackathon support, and the overall onboarding experience. Each of these serves a different purpose and reaches developers at a different stage of their journey. A developer browsing the Sui docs for the first time has different needs than a developer midway through building their first application.",
      "The reason this distinction matters is that it changes what you prioritize. A documentation team optimizes for coverage and accuracy. An education team optimizes for developer success – which sometimes means writing less, not more. It means investing in the quickstart before the reference docs. It means running user studies to find out where developers get stuck, not just what content is missing.",
      "The infrastructure behind developer education isn't glamorous. It's style guides, content taxonomies, feedback loops, and release coordination processes. But this operational work is what makes it possible to produce consistent, high-quality content across a growing platform without the whole system depending on any single person's knowledge."
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
