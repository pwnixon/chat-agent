import { useState } from "react";
import palette from '@archera/design-system/palettes/archera-palette';
import { color, typography } from '@archera/design-system/tokens';
import { AppHeader } from '@archera/design-system/AppShell';

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
    demo: "savings_analysis",
    title: "Chat: Savings Analysis",
    desc: "Full conversation: spend analysis, step cards, commitment plan selection, write action confirmation, and automation offer.",
    version: "v1",
    status: "live",
  },
  {
    demo: "received",
    title: "Chat: Received Share",
    desc: "Receiving a conversation shared by a teammate — notification badge, shared metadata, and the continue-the-conversation flow.",
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

function Card({ title, desc, version, status, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: palette.surface,
        border: `1px solid ${hovered ? palette.brandPrimary[500] : palette.neutral[200]}`,
        borderRadius: 10,
        padding: "18px 20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? `0 2px 12px ${palette.brandPrimary[500]}1a` : "none",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{
          ...typography.caption, fontWeight: 600, letterSpacing: "0.05em",
          padding: "2px 7px", borderRadius: 4,
          background: `${palette.neutral.black}0f`, color: palette.text.disabled,
        }}>{version}</span>
        <span style={{
          ...typography.caption, fontWeight: 600, letterSpacing: "0.05em",
          padding: "2px 7px", borderRadius: 4,
          background: status === "live" ? `${palette.success[500]}1a` : `${palette.accent1[700]}1a`,
          color: status === "live" ? palette.success[500] : palette.accent1[700],
        }}>{status === "live" ? "Live" : "WIP"}</span>
      </div>
      <div style={{ ...typography.h6, fontWeight: 600, color: palette.neutral.black, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ ...typography.body1, color: palette.text.secondary, lineHeight: 1.5, flex: 1 }}>
        {desc}
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end",
        paddingTop: 8, borderTop: `1px solid ${color.divider}`,
        ...typography.body2, fontWeight: 500,
        color: hovered ? palette.brandPrimary[700] : palette.brandPrimary[500],
        transition: "color 0.15s",
      }}>
        Open ›
      </div>
    </div>
  );
}

export default function DemoIndex() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: palette.background }}>
      {/* Standard Archera header — logo, "Prototypes" title, no breadcrumb */}
      <AppHeader pageName="Prototypes" />

      {/* Content */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 40px 80px", width: "100%" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ ...typography.h3, fontWeight: 600, color: palette.neutral.black, marginBottom: 8 }}>
            {PROJECT.name}
          </h1>
          <p style={{ ...typography.body1, color: palette.text.secondary, lineHeight: 1.6, maxWidth: 560 }}>
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
