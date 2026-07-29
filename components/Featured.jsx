function Featured() {
  return (
    <section id="featured" className="featured container">
      <span className="eyebrow">Featured work</span>
      <article className="featured-card">
        <div className="featured-body">
          <div className="featured-meta">
            <span>Book</span><span>·</span><span>2026 Edition</span>
          </div>
          <h2 className="featured-title">
            The Ultimate Web3 <em>Pocket Guide</em>: 2026 edition
          </h2>
          <p className="featured-dek">
            The fully revised second edition of the field guide to the Web3 stack — protocols, wallets, consensus, storage, and the mental models that make it click. Rewritten and expanded to cover the current landscape.
          </p>
          <div className="featured-actions">
            <a className="btn primary" href="https://www.amazon.com/Ultimate-Web3-Pocket-Guide-Second-ebook/dp/B0GZWHD6DZ" target="_blank" rel="noreferrer">View on Amazon</a>
            <span className="featured-pub">Also by Jessie: <em>Mastering Web3 Documentation</em></span>
          </div>
        </div>
      </article>
    </section>
  );
}
window.Featured = Featured;
