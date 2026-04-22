function BlogReader({ post, onClose }) {
  const [progress, setProgress] = React.useState(0);
  const scrollerRef = React.useRef(null);

  React.useEffect(() => {
    if (!post) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [post]);

  React.useEffect(() => {
    if (!post) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div className="reader" role="dialog" aria-modal="true">
      <div className="reader-backdrop" onClick={onClose} />
      <div className="reader-sheet" ref={scrollerRef}>
        <div className="reader-progress">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="reader-top">
          <button className="reader-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            <span>Close</span>
          </button>
          <div className="reader-breadcrumb">
            <span>The Journal</span>
            <span>·</span>
            <span>{post.tag}</span>
          </div>
          <div className="reader-read">{post.read}</div>
        </div>

        <article className="reader-article">
          <div className="reader-meta">
            <span>{post.date}</span>
            <span>·</span>
            <span>By Jessie Mongeon</span>
          </div>
          <h1 className="reader-title">{post.title}</h1>
          <p className="reader-dek">{post.dek}</p>

          <div className="reader-rule"><span>✦</span></div>

          <div className="reader-body">
            {post.body.map((para, i) => (
              <p key={i} style={i === 0 ? { } : {}}>{
                i === 0 ? (
                  <><span className="dropcap">{para[0]}</span>{para.slice(1)}</>
                ) : para
              }</p>
            ))}

            <p className="reader-ornament">✦ ✦ ✦</p>
            <p className="reader-signoff">
              — J.M.<br/>
              <span className="reader-signoff-loc">Minneapolis, a Tuesday.</span>
            </p>
          </div>

          <footer className="reader-footer">
            <button className="btn" onClick={onClose}>← Back to the journal</button>
            <div className="reader-share">
              <span className="eyebrow">Share</span>
              <a href="#" onClick={e => e.preventDefault()}>Email</a>
              <a href="#" onClick={e => e.preventDefault()}>Twitter</a>
              <a href="#" onClick={e => e.preventDefault()}>Copy link</a>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

window.BlogReader = BlogReader;
