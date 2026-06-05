# chat-agent

## What this is
A self-contained React prototype of the **Archera Chat Agent** chat UI — a cloud cost optimization assistant panel that overlays the Commitment Inventory page.

## File
- `ArcheraArchitect.jsx` — the entire app in one file (~990 lines)

## Stack
- React (hooks only: `useState`, `useEffect`, `useRef`)
- MUI (`@mui/material`) — components and `Icon as MuiIcon` for icons (Material Icons Google Font, loaded in `index.html`)
- Vite for dev server and build
- Inline styles throughout (no CSS modules, no Tailwind)
- No router, no state library

## Key components
| Component | Purpose |
|---|---|
| `ArcheraLogo` | Inline SVG brand mark (3 stars) |
| `Icon` | Animated logo — modes: `breathe`, `thinking`, `success`, `reset`, `done` |
| `Welcome` | Typewriter intro + suggested prompts shown when chat is empty |
| `Phrases` | Rotating thinking phrases with shimmer animation |
| `ActivityLog` | Collapsible sources-used list |
| `StepCards` | Inline agent progress cards revealed with staggered animation |
| `ResponseRow` | Streams response HTML character by character |
| `WriteAction` | Confirm/deny card for destructive write actions |
| `WriteActionChoice` | Pick-one-of-N then confirm/deny card |
| `App` | Root — manages message list and conversation flow state |

## Conversation flow
1. Initial message pair is pre-seeded in `INIT_MSGS`
2. User sends a message → `thinking` bubble → response from `RESP[]` (round-robin)
3. Special flows defined in `flowPlanConfirmed`, `FLOW_PLAN_DENIED`, `FLOW_AUTOMATION_CONFIRMED`, `FLOW_AUTOMATION_DENIED` fire when write-action cards are confirmed/denied
4. `showWaiting` (breathing icon) appears after each response reset animation completes

## Animation system
All SVG animations use `requestAnimationFrame` loops managed in `useRef(rafs)` to avoid stale closures. The logo morphs between three shapes: the Archera brand mark, gear shapes (thinking), and star shapes (success).

## To preview
Open `index.html` in a browser — it loads React + Babel from CDN and renders the component directly.
