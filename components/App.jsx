const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sage-sky",
  "theme": "light",
  "anim": 0.6
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useState(() => {
    try {
      const saved = localStorage.getItem("jm_tweaks");
      if (saved) return { ...TWEAK_DEFAULTS, ...JSON.parse(saved) };
    } catch {}
    return TWEAK_DEFAULTS;
  });
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [openPost, setOpenPost] = useState(null);

  // Apply tweaks to :root
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.style.setProperty("--anim", String(tweaks.anim));
    try { localStorage.setItem("jm_tweaks", JSON.stringify(tweaks)); } catch {}
    // Inform host about the edit
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: tweaks }, "*");
    } catch {}
  }, [tweaks]);

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweaksVisible(true);
      if (d.type === "__deactivate_edit_mode") setTweaksVisible(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Restore last-read post position
  useEffect(() => {
    try {
      const last = localStorage.getItem("jm_open_post");
      if (last) {
        const p = JOURNAL_POSTS.find(x => x.id === last);
        if (p) setOpenPost(p);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (openPost) localStorage.setItem("jm_open_post", openPost.id);
      else localStorage.removeItem("jm_open_post");
    } catch {}
  }, [openPost]);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }
    }, { rootMargin: "-40px 0px -40px 0px", threshold: 0.05 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <div className="fade-up"><About /></div>
      <div className="asterism container"><span>✦</span><span>✦</span><span>✦</span></div>
      <div className="fade-up"><Featured /></div>
      <div className="asterism container"><span>✦</span><span>✦</span><span>✦</span></div>
      <div className="fade-up"><Portfolio /></div>
      <div className="asterism container"><span>✦</span><span>✦</span><span>✦</span></div>
      <div className="fade-up"><Journal onOpen={setOpenPost} /></div>
      <div className="asterism container"><span>✦</span><span>✦</span><span>✦</span></div>
      <div className="fade-up"><Reading /></div>
      <div className="fade-up"><Contact /></div>

      {openPost && <JournalReader post={openPost} onClose={() => setOpenPost(null)} />}

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
