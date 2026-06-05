import { useState } from "react";

// ─── Edit this to add / remove demos ─────────────────────────────────────────
const PROJECT = {
  name: "Archera Chat Agent",
  desc: "AI-powered cloud cost optimization assistant panel for the Commitment Inventory page.",
};

const DEMOS = [
  {
    demo: "welcome",
    title: "Chat: Welcome Screen",
    desc: "Empty state with animated typewriter intro and suggested prompts.",
    version: "v1",
    status: "live",
  },
  {
    demo: "chat",
    title: "Chat: Savings Analysis",
    desc: "Full conversation: spend analysis, step cards, commitment plan selection, write action confirmation, and automation offer.",
    version: "v1",
    status: "live",
  },
  {
    demo: "dev",
    title: "Chat: Dev",
    desc: "Minimal pre-seeded conversation for component development and testing. Responses render at 400ms for fast iteration.",
    version: "v1",
    status: "wip",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function ArcheraLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ flexShrink: 0 }}>
      <path d="M26.7 10.6C27.8 7.2 32.5 7.2 33.6 10.6L38.7 27.2C39.1 28.3 40 29.2 41.1 29.6L57.8 34.6C61.2 35.6 61.2 40.4 57.8 41.4L41.1 46.4C40 46.7 39.1 47.6 38.7 48.8L33.6 65.3C32.5 68.7 27.8 68.7 26.7 65.3L21.6 48.8C21.3 47.6 20.4 46.7 19.2 46.4L2.6 41.4C-.9 40.4-.9 35.6 2.6 34.6L19.2 29.6C20.4 29.2 21.3 28.3 21.6 27.2Z" fill="#7101FF" />
      <path d="M62.1 49.5C62.6 47.7 65.2 47.7 65.7 49.5L68.5 58.3C68.7 58.9 69.1 59.4 69.7 59.6L78.6 62.2C80.5 62.8 80.5 65.3 78.6 65.9L69.7 68.6C69.1 68.7 68.7 69.2 68.5 69.8L65.7 78.7C65.2 80.4 62.6 80.4 62.1 78.7L59.4 69.8C59.2 69.2 58.7 68.7 58.1 68.6L49.2 65.9C47.4 65.3 47.4 62.8 49.2 62.2L58.1 59.6C58.7 59.4 59.2 58.9 59.4 58.3Z" fill="#F89090" />
      <path d="M63 1C63.4-.3 65.3-.3 65.7 1L67.8 7.6C67.9 8.1 68.3 8.4 68.7 8.6L75.4 10.6C76.7 11 76.7 12.9 75.4 13.3L68.7 15.3C68.3 15.5 67.9 15.8 67.8 16.3L65.7 22.9C65.3 24.2 63.4 24.2 63 22.9L60.9 16.3C60.8 15.8 60.4 15.5 60 15.3L53.3 13.3C51.9 12.9 51.9 11 53.3 10.6L60 8.6C60.4 8.4 60.8 8.1 60.9 7.6Z" fill="#6DD8FC" />
    </svg>
  );
}

function Card({ title, desc, version, status, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "#7101FF" : "#e2e2e5"}`,
        borderRadius: 10,
        padding: "18px 20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? "0 2px 12px rgba(113,1,255,0.1)" : "none",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
          padding: "2px 7px", borderRadius: 4,
          background: "rgba(9,10,29,0.06)", color: "rgba(9,10,29,0.45)",
        }}>{version}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
          padding: "2px 7px", borderRadius: 4,
          background: status === "live" ? "rgba(58,158,110,0.1)" : "rgba(240,165,0,0.1)",
          color: status === "live" ? "#3a9e6e" : "#d49000",
        }}>{status === "live" ? "Live" : "WIP"}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(9,10,29,0.85)", lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(104,104,112,0.75)", flex: 1 }}>
        {desc}
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end",
        paddingTop: 8, borderTop: "1px solid #f2f2f4",
        fontSize: 12, fontWeight: 500,
        color: hovered ? "#5500cc" : "#7101FF",
        transition: "color 0.15s",
      }}>
        Open ›
      </div>
    </div>
  );
}

export default function DemoIndex() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f6f5f4", fontFamily: "Roboto, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <header style={{ background: "#161259", height: 60, display: "flex", alignItems: "center", padding: "0 40px", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ArcheraLogo size={22} />
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600, letterSpacing: "-0.2px" }}>archera</span>
        </div>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>Prototypes</span>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 40px 80px", width: "100%" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "rgba(9,10,29,0.85)", marginBottom: 8 }}>
            {PROJECT.name}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(104,104,112,0.75)", lineHeight: 1.6, maxWidth: 560 }}>
            {PROJECT.desc}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {DEMOS.map(d => (
            <Card
              key={d.demo}
              title={d.title}
              desc={d.desc}
              version={d.version}
              status={d.status}
              onClick={() => { window.location.href = `?demo=${d.demo}`; }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
