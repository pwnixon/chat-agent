import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
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

// Feature URL params — flags appended to a demo URL to show/hide UI elements and
// states. These ship inside the @archera/chat-agent package, so they also work in
// every prototype that embeds the chat.
const PARAMS = [
  { param: "?chat=off", desc: "Hide the chat entirely (also accepts 0/false) — renders the plain page with no FAB or panel." },
  { param: "?dock=on|off", desc: "Force or suppress the chat panel auto-docking open on viewports ≥1440 (overrides the autoOpen prop). Below 1440 it's always the FAB." },
  { param: "?fab-tooltip=on", desc: "Show the FAB launch-prompt bubble (“Ask me anything…”) once on page load. Off by default." },
];
// ─────────────────────────────────────────────────────────────────────────────

function DemoCard({ title, desc, version, status, onClick }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
        <CardContent>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={0.75}>
              <Chip size="small" variant="outlined" label={version} />
              <Chip
                size="small"
                color={status === 'live' ? 'success' : 'warning'}
                label={status === 'live' ? 'Live' : 'WIP'}
              />
            </Stack>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{desc}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function DemoIndex() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader pageName="Prototypes" />
      <Box component="main" sx={{ width: '100%', maxWidth: 960, mx: 'auto', px: 5, pt: 6, pb: 10 }}>
        <Box sx={{ mb: 4.5 }}>
          <Typography variant="h2" gutterBottom>{PROJECT.name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>{PROJECT.desc}</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1.75 }}>
          {DEMOS.map((d) => (
            <DemoCard
              key={d.demo}
              title={d.title}
              desc={d.desc}
              version={d.version}
              status={d.status}
              onClick={() => { window.location.href = `?demo=${d.demo}`; }}
            />
          ))}
        </Box>
        {PARAMS.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>URL parameters</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Append to any demo URL to show/hide UI elements and states. These ship with the
              @archera/chat-agent package, so they work in every prototype that embeds the chat.
            </Typography>
            <Stack spacing={1.5}>
              {PARAMS.map((p) => (
                <Stack key={p.param} direction="row" spacing={1.5} alignItems="flex-start">
                  <Chip size="small" variant="outlined" label={p.param} />
                  <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>{p.desc}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
