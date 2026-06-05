import { Box, Stack, Typography, Button, ToggleButton, ToggleButtonGroup, Divider, Icon as MuiIcon } from '@mui/material';
import palette from '../_template/palettes/archera-palette';
import { color, typography, radius } from '../_template/tokens';

const HEADER = '#26226D';

const COMPONENTS = [
  {
    name: 'MuiButton',
    themeKey: 'components.MuiButton.styleOverrides',
    note: 'disableElevation: true on all variants.',
    sizes: [
      { size: 'large',  slot: 'sizeLarge',  fontSize: '14px', lineHeight: '14px', letterSpacing: '0.46px', padding: '6px 22px',  height: '32px' },
      { size: 'medium', slot: 'sizeMedium', fontSize: '12px', lineHeight: '12px', letterSpacing: '0.4px',  padding: '4px 16px',  height: '24px' },
      { size: 'small',  slot: 'sizeSmall',  fontSize: '10px', lineHeight: '10px', letterSpacing: '0.46px', padding: '2px 10px',  height: '18px' },
    ],
  },
  {
    name: 'MuiToggleButton',
    themeKey: 'components.MuiToggleButton.styleOverrides',
    note: 'Padding shown is for icon-only buttons. Text labels use the same font metrics.',
    sizes: [
      { size: 'large',  slot: 'sizeLarge',  fontSize: '14px', lineHeight: '14px', letterSpacing: '0.46px', padding: '16px', height: '48px' },
      { size: 'medium', slot: 'sizeMedium', fontSize: '12px', lineHeight: '12px', letterSpacing: '0.4px',  padding: '12px', height: '32px' },
      { size: 'small',  slot: 'sizeSmall',  fontSize: '10px', lineHeight: '10px', letterSpacing: '0.46px', padding: '8px',  height: '24px' },
    ],
  },
];

const COL = { size: 100, slot: 140, fs: 80, lh: 80, ls: 90, pad: 110, h: 70 };

function SectionHeader({ title, themeKey, note }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="baseline" gap={1.5} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: palette.neutral.black }}>{title}</Typography>
        <Typography component="code" sx={{ fontSize: 11, color: palette.brandPrimary[500], bgcolor: `${palette.brandPrimary[500]}0d`, px: '5px', py: '1px', borderRadius: '3px' }}>{themeKey}</Typography>
      </Stack>
      {note && <Typography sx={{ ...typography.body2, color: palette.text.secondary }}>{note}</Typography>}
    </Box>
  );
}

function ColHead({ children, w }) {
  return (
    <Box sx={{ width: w, flexShrink: 0, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: palette.text.secondary }}>
      {children}
    </Box>
  );
}

function Cell({ children, w, mono }) {
  return (
    <Box sx={{ width: w, flexShrink: 0, fontSize: 12, fontFamily: mono ? 'monospace' : undefined, color: palette.text.secondary }}>
      {children}
    </Box>
  );
}

function ButtonRows() {
  return (
    <>
      {/* Header row */}
      <Stack direction="row" alignItems="center" gap={2} sx={{ pb: 1, borderBottom: `2px solid ${color.divider}`, mb: 0.5 }}>
        <Box sx={{ width: 260, flexShrink: 0 }}><ColHead w={260}>Preview</ColHead></Box>
        <ColHead w={COL.size}>Size</ColHead>
        <ColHead w={COL.slot}>Slot</ColHead>
        <ColHead w={COL.fs}>font-size</ColHead>
        <ColHead w={COL.lh}>line-height</ColHead>
        <ColHead w={COL.ls}>tracking</ColHead>
        <ColHead w={COL.pad}>padding</ColHead>
        <ColHead w={COL.h}>height</ColHead>
      </Stack>

      {COMPONENTS[0].sizes.map(s => (
        <Stack key={s.size} direction="row" alignItems="center" gap={2} sx={{ py: 1.5, borderBottom: `1px solid ${color.divider}` }}>
          {/* Previews: contained + outlined + text */}
          <Stack direction="row" gap={1} alignItems="center" sx={{ width: 260, flexShrink: 0 }}>
            <Button variant="contained" size={s.size} disableElevation startIcon={<MuiIcon sx={{ fontSize: '12px !important' }}>check</MuiIcon>}>Label</Button>
            <Button variant="outlined" size={s.size}>Label</Button>
            <Button variant="text" size={s.size}>Label</Button>
          </Stack>
          <Cell w={COL.size}><Typography sx={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize', color: palette.text.secondary }}>{s.size}</Typography></Cell>
          <Cell w={COL.slot} mono>{s.slot}</Cell>
          <Cell w={COL.fs} mono>{s.fontSize}</Cell>
          <Cell w={COL.lh} mono>{s.lineHeight}</Cell>
          <Cell w={COL.ls} mono>{s.letterSpacing}</Cell>
          <Cell w={COL.pad} mono>{s.padding}</Cell>
          <Cell w={COL.h} mono>{s.height}</Cell>
        </Stack>
      ))}
    </>
  );
}

function ToggleRows() {
  return (
    <>
      <Stack direction="row" alignItems="center" gap={2} sx={{ pb: 1, borderBottom: `2px solid ${color.divider}`, mb: 0.5, mt: 0.5 }}>
        <Box sx={{ width: 260, flexShrink: 0 }}><ColHead w={260}>Preview</ColHead></Box>
        <ColHead w={COL.size}>Size</ColHead>
        <ColHead w={COL.slot}>Slot</ColHead>
        <ColHead w={COL.fs}>font-size</ColHead>
        <ColHead w={COL.lh}>line-height</ColHead>
        <ColHead w={COL.ls}>tracking</ColHead>
        <ColHead w={COL.pad}>padding</ColHead>
        <ColHead w={COL.h}>height</ColHead>
      </Stack>

      {COMPONENTS[1].sizes.map(s => (
        <Stack key={s.size} direction="row" alignItems="center" gap={2} sx={{ py: 1.5, borderBottom: `1px solid ${color.divider}` }}>
          <Stack direction="row" gap={1} alignItems="center" sx={{ width: 260, flexShrink: 0 }}>
            {/* Icon-only group */}
            <ToggleButtonGroup size={s.size} value="left" exclusive>
              <ToggleButton value="left"><MuiIcon sx={{ fontSize: s.size === 'large' ? 20 : s.size === 'medium' ? 16 : 12 }}>format_align_left</MuiIcon></ToggleButton>
              <ToggleButton value="center"><MuiIcon sx={{ fontSize: s.size === 'large' ? 20 : s.size === 'medium' ? 16 : 12 }}>format_align_center</MuiIcon></ToggleButton>
              <ToggleButton value="right"><MuiIcon sx={{ fontSize: s.size === 'large' ? 20 : s.size === 'medium' ? 16 : 12 }}>format_align_right</MuiIcon></ToggleButton>
            </ToggleButtonGroup>
            {/* Text label */}
            <ToggleButtonGroup size={s.size} value="bold" exclusive sx={{ ml: 1 }}>
              <ToggleButton value="bold">BOLD</ToggleButton>
              <ToggleButton value="italic">ITALIC</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Cell w={COL.size}><Typography sx={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize', color: palette.text.secondary }}>{s.size}</Typography></Cell>
          <Cell w={COL.slot} mono>{s.slot}</Cell>
          <Cell w={COL.fs} mono>{s.fontSize}</Cell>
          <Cell w={COL.lh} mono>{s.lineHeight}</Cell>
          <Cell w={COL.ls} mono>{s.letterSpacing}</Cell>
          <Cell w={COL.pad} mono>{s.padding}</Cell>
          <Cell w={COL.h} mono>{s.height}</Cell>
        </Stack>
      ))}
    </>
  );
}

export default function ComponentsRef() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F5F4', fontFamily: 'Roboto, sans-serif' }}>
      {/* Topbar */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: HEADER, height: 56, display: 'flex', alignItems: 'center', gap: 3, px: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
        <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>Token Reference</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>MUI Component Overrides</Typography>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 4 }}>
        <Typography sx={{ ...typography.body2, color: palette.text.secondary, mb: 4 }}>
          Source: <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>_template/theme.ts → components</code>
          {' '}· per-size font and padding customizations applied on top of MUI defaults
        </Typography>

        {COMPONENTS.map((comp, i) => (
          <Box key={comp.name} sx={{ mb: 5 }}>
            <SectionHeader title={comp.name} themeKey={comp.themeKey} note={comp.note} />
            <Box sx={{ overflowX: 'auto' }}>
              {i === 0 ? <ButtonRows /> : <ToggleRows />}
            </Box>
            {i < COMPONENTS.length - 1 && <Divider sx={{ mt: 4 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
