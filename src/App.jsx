import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

const COLLECTION = "photobooth";
const DOC_ID = "counts";

// Inject Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap";
document.head.appendChild(fontLink);

export default function PhotoboothApp() {
  const [view, setView] = useState("form");
  const [name, setName] = useState("");
  const [counts, setCounts] = useState({});
  const [flash, setFlash] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [adminUnlock, setAdminUnlock] = useState(0);
  const [loading, setLoading] = useState(true);

  // Écoute les données Firebase en temps réel
  useEffect(() => {
    const ref = doc(collection(db, COLLECTION), DOC_ID);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setCounts(snap.data().entries || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const save = async (newCounts) => {
    const ref = doc(collection(db, COLLECTION), DOC_ID);
    await setDoc(ref, { entries: newCounts });
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    const newCounts = { ...counts, [key]: (counts[key] || 0) + 1 };
    await save(newCounts);
    setConfirmed(trimmed);
    setFlash(true);
    setName("");
    setTimeout(() => setFlash(false), 600);
    setTimeout(() => setConfirmed(null), 2500);
  };

  const handleReset = async () => {
    await save({});
  };

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8edf5 0%, #f5f7fb 40%, #dce4f0 100%)",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Denim texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(100,130,180,0.04) 2px, rgba(100,130,180,0.04) 4px), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,130,180,0.04) 2px, rgba(100,130,180,0.04) 4px)`,
      }} />

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 5, zIndex: 10, background: "linear-gradient(90deg, #3a5a8c, #6b8fc4, #3a5a8c)" }} />

      {flash && (
        <div style={{ position: "fixed", inset: 0, background: "white", zIndex: 100, animation: "fadeOut 0.5s ease-out forwards", pointerEvents: "none" }} />
      )}

      <style>{`
        @keyframes fadeOut { from { opacity: 0.85 } to { opacity: 0 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
        .tab-btn:hover { opacity: 0.75 !important; }
        .submit-btn:hover { transform: scale(1.03) !important; background: #2d4a7a !important; }
        .submit-btn:active { transform: scale(0.97) !important; }
        input::placeholder { color: #a0aec0; }
        input:focus { outline: none; border-color: #3a5a8c !important; box-shadow: 0 0 0 3px rgba(58,90,140,0.15) !important; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 540, margin: "0 auto", padding: "60px 24px 40px", animation: "slideUp 0.6s ease-out" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6b8fc4", marginBottom: 10, fontWeight: 500 }}>✦ Photobooth ✦</div>
          <h1 style={{ fontSize: 44, fontWeight: 400, color: "#1a2a45", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>Qui a posé ?</h1>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, #3a5a8c, #6b8fc4)", margin: "16px auto 0", borderRadius: 2 }} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, background: "rgba(58,90,140,0.1)", borderRadius: 12, padding: 3, marginBottom: 40 }}>
          {["form", "leaderboard"].map(v => (
            <button key={v} className="tab-btn" onClick={() => setView(v)} style={{
              flex: 1, padding: "10px 0", border: "none", cursor: "pointer", borderRadius: 10,
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              background: view === v ? "white" : "transparent",
              color: view === v ? "#1a2a45" : "#6b8fc4",
              boxShadow: view === v ? "0 2px 8px rgba(58,90,140,0.15)" : "none",
              transition: "all 0.2s",
            }}>
              {v === "form" ? "📸 Prendre une photo" : `🏆 Classement (${total})`}
            </button>
          ))}
        </div>

        {/* FORM */}
        {view === "form" && (
          <div style={{ animation: "slideUp 0.4s ease-out" }}>
            <div style={{ background: "white", borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(58,90,140,0.12)", border: "1px solid rgba(107,143,196,0.2)" }}>
              <label style={{ display: "block", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b8fc4", marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Ton prénom</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Entre ton prénom…"
                autoComplete="off"
                style={{ width: "100%", boxSizing: "border-box", padding: "16px 20px", fontSize: 22, border: "2px solid #d4dde8", borderRadius: 12, color: "#1a2a45", background: "#f8fafc", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}
              />
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!name.trim()}
                style={{
                  width: "100%", padding: "18px", fontSize: 16,
                  background: name.trim() ? "#3a5a8c" : "#b0bec5",
                  color: "white", border: "none", borderRadius: 12,
                  cursor: name.trim() ? "pointer" : "not-allowed",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: "all 0.2s",
                }}
              >
                📸 &nbsp; Valider ma photo
              </button>
            </div>

            {confirmed && (
              <div style={{ marginTop: 24, textAlign: "center", animation: "popIn 0.3s ease-out" }}>
                <div style={{ background: "white", borderRadius: 14, padding: "20px 28px", boxShadow: "0 4px 20px rgba(58,90,140,0.15)", border: "1px solid rgba(107,143,196,0.3)", display: "inline-block" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✨</div>
                  <div style={{ fontSize: 18, color: "#1a2a45", fontWeight: 500 }}>Merci <strong>{confirmed}</strong> !</div>
                  <div style={{ fontSize: 13, color: "#8a9ab0", marginTop: 4 }}>Photo comptabilisée — c'est noté 📷</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEADERBOARD */}
        {view === "leaderboard" && (
          <div style={{ animation: "slideUp 0.4s ease-out" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#8a9ab0" }}>Chargement…</div>
            ) : sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(58,90,140,0.08)", color: "#8a9ab0", fontSize: 17 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📷</div>
                Aucune photo encore prise.<br />
                <span style={{ fontSize: 14 }}>Soyez les premiers à poser !</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sorted.map(([person, count], i) => (
                  <div key={person} style={{
                    background: "white", borderRadius: 14, padding: "16px 22px",
                    boxShadow: i === 0 ? "0 6px 24px rgba(58,90,140,0.18)" : "0 2px 12px rgba(58,90,140,0.08)",
                    border: i === 0 ? "1px solid rgba(107,143,196,0.4)" : "1px solid rgba(107,143,196,0.15)",
                    display: "flex", alignItems: "center", gap: 16,
                    animation: `slideUp 0.4s ease-out ${i * 0.06}s both`,
                  }}>
                    <span style={{ fontSize: i < 3 ? 26 : 18, minWidth: 32, textAlign: "center" }}>
                      {i < 3 ? medals[i] : `${i + 1}.`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, color: "#1a2a45", fontWeight: 600, textTransform: "capitalize" }}>
                        {person.charAt(0).toUpperCase() + person.slice(1)}
                      </div>
                      <div style={{ marginTop: 6, height: 4, borderRadius: 4, background: "#eef1f7", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          width: `${(count / sorted[0][1]) * 100}%`,
                          background: i === 0 ? "linear-gradient(90deg, #3a5a8c, #6b8fc4)" : "linear-gradient(90deg, #8aaad0, #b0c4de)",
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#3a5a8c", minWidth: 40, textAlign: "right" }}>
                      {count}
                      <div style={{ fontSize: 10, color: "#8a9ab0", fontWeight: 400 }}>photo{count > 1 ? "s" : ""}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 8, textAlign: "center", padding: "14px", background: "rgba(58,90,140,0.06)", borderRadius: 12, fontSize: 14, color: "#6b8fc4" }}>
                  {total} photo{total > 1 ? "s" : ""} au total · {sorted.length} participant{sorted.length > 1 ? "s" : ""}
                </div>

                <div
                  onClick={() => {
                    const next = adminUnlock + 1;
                    setAdminUnlock(next);
                    if (next >= 5) {
                      if (window.confirm("Remettre le compteur à zéro ?")) handleReset();
                      setAdminUnlock(0);
                    }
                  }}
                  style={{ textAlign: "center", fontSize: 11, color: "#c8d4e0", marginTop: 4, cursor: "default", userSelect: "none" }}
                >
                  {adminUnlock > 0 ? "● ".repeat(adminUnlock) : "· · ·"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
