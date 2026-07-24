// Global feature URL params shipped by @archera/chat-agent.
// Prototypes that embed the chat list these under a "Chat" group — import from
// '@archera/chat-agent/demoParams' so they stay in one place (no drift).
export const CHAT_PARAMS = [
  { param: '?chat=off', desc: 'Hide the chat entirely (also accepts 0/false) — renders the plain page with no FAB or panel.' },
  { param: '?dock=on|off', desc: 'on = arrive with the panel open (saved dock mode/size preferred; sidebar ≥1280, overlay below). off = force FAB-only. Overrides the autoOpen prop and saved state.' },
  { param: '?fab-tooltip=on', desc: 'Show the FAB launch-prompt bubble (“Ask me about…”) once on page load. Off by default.' },
];
