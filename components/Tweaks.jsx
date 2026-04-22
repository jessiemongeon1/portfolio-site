function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;

  const palettes = [
    { id: "sage-sky", label: "Sage + Sky", a: "oklch(0.88 0.04 230)", b: "oklch(0.89 0.05 160)" },
    { id: "meadow", label: "Meadow", a: "oklch(0.90 0.045 200)", b: "oklch(0.90 0.06 140)" },
    { id: "harbor", label: "Harbor", a: "oklch(0.86 0.05 250)", b: "oklch(0.88 0.045 180)" },
    { id: "orchard", label: "Orchard", a: "oklch(0.90 0.035 210)", b: "oklch(0.91 0.055 150)" }
  ];

  return (
    <aside className="tweaks-panel">
      <div className="tweaks-head">
        <span className="eyebrow">Tweaks</span>
        <span className="tweaks-dot" />
      </div>

      <div className="tweaks-section">
        <div className="tweaks-label">Palette</div>
        <div className="tweaks-palettes">
          {palettes.map(p => (
            <button
              key={p.id}
              className={`palette-sw ${tweaks.palette === p.id ? "on" : ""}`}
              onClick={() => setTweaks({ ...tweaks, palette: p.id })}
              aria-label={p.label}
              title={p.label}
            >
              <span className="sw sw-a" style={{ background: p.a }} />
              <span className="sw sw-b" style={{ background: p.b }} />
              <span className="sw-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks-section">
        <div className="tweaks-label">Theme</div>
        <div className="tweaks-segment">
          <button
            className={tweaks.theme === "light" ? "on" : ""}
            onClick={() => setTweaks({ ...tweaks, theme: "light" })}
          >☀ Light</button>
          <button
            className={tweaks.theme === "dark" ? "on" : ""}
            onClick={() => setTweaks({ ...tweaks, theme: "dark" })}
          >☾ Dark</button>
        </div>
      </div>

      <div className="tweaks-section">
        <div className="tweaks-label">Animation intensity <span className="tweaks-val">{Math.round(tweaks.anim * 100)}%</span></div>
        <input
          type="range"
          min="0" max="140" step="10"
          value={Math.round(tweaks.anim * 100)}
          onChange={e => setTweaks({ ...tweaks, anim: Number(e.target.value) / 100 })}
        />
        <div className="tweaks-ticks"><span>still</span><span>lively</span></div>
      </div>
    </aside>
  );
}

window.TweaksPanel = TweaksPanel;
