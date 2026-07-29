const BLOG_POSTS = [
  {
    id: "p1",
    title: "The object model problem: explaining Sui's Move to Solidity developers",
    dek: "When your reader's mental model is wrong, your first job is to acknowledge it before replacing it.",
    date: "April 12, 2026",
    read: "7 min",
    tag: "Education",
    accent: "blue",
    body: [
      "Sui's Move language treats everything as an object with defined ownership. If you're coming from Ethereum, where state lives in account-based mappings, this is a fundamental shift in how you think about on-chain data. The challenge for developer education isn't explaining the new model – it's un-explaining the old one.",
      "I've found that the most effective approach is to start with a direct comparison. In Solidity, a token balance is a number in a mapping tied to an address. In Move, a token is an object that you own, like a physical coin in your wallet. You can transfer it, split it, or merge it with other coins. This analogy isn't perfect, but it gives the developer a foothold before the technical details arrive.",
      "The worst thing you can do is pretend the developer has no prior context. They do. If you ignore it, they'll map new concepts onto old ones anyway, and the mapping will be wrong in ways that cause confusion later. Better to address the comparison directly, explain where it holds and where it breaks, and then build from there.",
      "This is a pattern I've used across both ICP and Sui documentation: meet the developer where they are, acknowledge what they already know, and use that existing knowledge as a bridge to the new concept."
    ]
  },
  {
    id: "p2",
    title: "How I structure a tutorial series for a new blockchain platform",
    dek: "Thirty-six tutorials, six difficulty levels, and the editorial decisions behind the progression.",
    date: "March 28, 2026",
    read: "9 min",
    tag: "Process",
    accent: "green",
    body: [
      "At DFINITY, I built a tutorial series for the Internet Computer that grew to 36 parts across 6 difficulty levels. The structure wasn't accidental – it was the result of iterating based on user studies and developer feedback over several months.",
      "The key insight was that difficulty levels aren't about the complexity of the code. They're about how much context the developer needs before they can follow along. A beginner tutorial shouldn't just use simpler code – it should assume the developer hasn't set up their environment, doesn't know the CLI commands, and may not be familiar with the deployment process. An advanced tutorial can skip all of that and focus on the implementation pattern.",
      "Each level builds on the previous one. Level 1 tutorials assume nothing beyond basic programming knowledge. By level 6, the developer should be comfortable with inter-canister calls, stable memory patterns, and threshold cryptography integrations. The progression is designed so that a developer who completes the series has touched every major feature of the platform.",
      "I'm applying the same approach at Sui, adapted for Move and the object model. The principles transfer directly: define clear levels, state prerequisites explicitly, build in complexity gradually, and make sure each tutorial produces a working result the developer can deploy and test."
    ]
  },
  {
    id: "p3",
    title: "Running user studies on developer documentation",
    dek: "Watching developers use your docs is uncomfortable and irreplaceable.",
    date: "March 10, 2026",
    read: "6 min",
    tag: "Research",
    accent: "blue",
    body: [
      "At DFINITY, I ran six rounds of user studies on the ICP developer docs. The format was straightforward: I'd give a developer a task – deploy a canister, make an inter-canister call, set up a local development environment – and watch them try to complete it using only the documentation. No hints, no guidance.",
      "The most consistent finding was that developers could locate the right page but couldn't extract the answer from it. The information existed; the structure buried it. Pages tried to serve too many purposes at once – explaining concepts, providing step-by-step instructions, and listing configuration options all in the same document. Developers would scan for the procedural steps and get lost in the conceptual paragraphs in between.",
      "This led directly to the content taxonomy I've used since: separate conceptual guides from procedural tutorials from reference material. Each type has a different purpose, a different structure, and a different reader. A developer looking for a CLI command doesn't want to read three paragraphs about why the command exists. A developer trying to understand the consensus mechanism doesn't want to be interrupted by installation steps.",
      "User studies are uncomfortable because they show you how your documentation actually performs, not how you think it performs. But they're the most reliable way to find the structural problems that analytics and feedback forms miss."
    ]
  },
  {
    id: "p4",
    title: "What I've learned about Web3 terminology as a technical writer",
    dek: "When the industry's vocabulary is pre-loaded with marketing, clarity becomes an editorial choice.",
    date: "February 22, 2026",
    read: "4 min",
    tag: "Writing",
    accent: "green",
    body: [
      "Web3 has a vocabulary problem. Terms like 'trustless,' 'permissionless,' and 'decentralized' arrived in the ecosystem pre-loaded with marketing language, and they've stuck. For a technical writer, this creates a specific challenge: you need to use the terms the community recognizes while making sure the reader actually understands what they mean.",
      "Take 'trustless.' It doesn't mean that you can't trust the system. It means the system has been designed so that you don't have to trust any single participant in it. This distinction matters, and it's not obvious from the word itself. When I write about trustless systems in documentation, I define the term on first use – not because the reader is uninformed, but because the word itself is misleading.",
      "In The Ultimate Web3 Pocket Guide, I spent considerable time on definitions for exactly this reason. Every section that introduces a concept starts by stating what it is in plain terms, then explains how it works, then provides the ecosystem context. This structure isn't stylistic preference; it's a response to the fact that many readers have encountered these terms before but haven't encountered clear definitions of them.",
      "Technical writing in Web3 requires more definitional work than most fields. The writer has to cut through the accumulated layers of marketing, community shorthand, and assumed knowledge to reach the actual meaning. It's tedious work, but it's the work that makes everything else legible."
    ]
  },
  {
    id: "p5",
    title: "The style guide nobody asked for (and why I wrote it anyway)",
    dek: "Consistency in documentation is a form of trust between the writer and the reader.",
    date: "February 04, 2026",
    read: "8 min",
    tag: "Process",
    accent: "blue",
    body: [
      "One of the first things I did at DFINITY was write a style guide for the developer docs. Nobody asked for it. There were more urgent things on the list – pages to rewrite, tutorials to build, a whole information architecture to redesign. But I wrote the style guide first because everything else would be harder without it.",
      "A style guide for developer documentation isn't about comma preferences. It's about consistency in the things that affect developer comprehension: how you format code examples, how you introduce CLI commands, how you structure a tutorial step, how you refer to components of the system. When these things are consistent, the reader can focus on the content. When they're inconsistent, the reader has to spend cognitive effort adjusting to each page's conventions.",
      "The guide I wrote at DFINITY covered code formatting, admonition usage, cross-referencing patterns, heading structure, and terminology. It wasn't long. The goal was to make it easy to follow, not comprehensive. A style guide that nobody reads is worse than no style guide at all, because it creates the illusion of consistency without the reality.",
      "I've since written similar guides for every docs project I've led. The specifics change – different platforms have different terminology, different tools, different conventions – but the principle stays the same. Consistency is infrastructure. It isn't visible to the reader when it's there, but it's immediately noticeable when it's not."
    ]
  },
  {
    id: "p6",
    title: "From Filebase to DFINITY to Mysten Labs: how my approach to docs has evolved",
    dek: "Each role taught me something different about what developer documentation can be.",
    date: "January 19, 2026",
    read: "6 min",
    tag: "Career",
    accent: "green",
    body: [
      "My first technical writing role in Web3 was at Filebase, where I wrote whitepapers and eBooks about decentralized storage. The content was long-form and educational – explaining what IPFS is, why decentralized storage matters, and how developers could integrate it into their existing workflows. This was where I learned to write about complex technical systems for audiences who were encountering them for the first time.",
      "At DFINITY, the scope expanded significantly. I owned the entire developer documentation for the Internet Computer – thousands of pages, a 36-part tutorial series, quickstart guides, reference material, and the information architecture connecting all of it. This was where I learned that documentation at scale is primarily an organizational problem, not a writing problem. The challenge isn't producing content; it's structuring it so that developers can find what they need.",
      "At Mysten Labs, I lead the Builder Education team for Sui. The role has expanded beyond documentation into the full developer education lifecycle: tutorials, workshops, hackathon support, sample applications, and onboarding strategy. This is where I've learned that documentation is one component of developer success, not the whole picture.",
      "Each transition has reinforced the same core principle: the job of technical writing is to reduce the distance between a developer's question and the answer. The tools change, the technology changes, and the scope of the role changes. That principle doesn't."
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
