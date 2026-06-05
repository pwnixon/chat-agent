import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Stack, Divider,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Button, ToggleButton, ToggleButtonGroup,
  List, ListItem, ListItemIcon, ListItemText,
  Icon as MuiIcon,
} from '@mui/material';
import palette from '../_template/palettes/archera-palette';
import { color, typography, radius, elevation } from '../_template/tokens';
import TR from '../token-reference/data.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAND = '#7101FF';
const HEADER_BG = '#26226D';
const SIDEBAR_W = 220;
const TOPBAR_H = 56;

const NAV_GROUPS = [
  {
    label: 'Code Tokens',
    items: [
      { id: 'palette',    label: 'Color Palette' },
      { id: 'semantic',   label: 'Semantic Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing' },
      { id: 'radius',     label: 'Border Radius' },
      { id: 'elevation',  label: 'Elevation' },
    ],
  },
  {
    label: 'Figma Push Keys',
    items: [
      { id: 'figma-palette',    label: 'Archera Palette Vars' },
      { id: 'figma-mui-colors', label: 'MUI Semantic Vars' },
      { id: 'figma-text',       label: 'MUI Text Styles' },
    ],
  },
  {
    label: 'MUI Overrides',
    items: [
      { id: 'components', label: 'Component Overrides' },
    ],
  },
];

// ─── Helper: luminance for contrast detection ─────────────────────────────────
function isLight(hex) {
  if (!hex || !hex.startsWith('#')) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const GROUP_LABEL_SX = {
  fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'text.secondary', mb: 1,
};
const SECTION_TITLE_SX = { fontSize: 18, fontWeight: 500, color: palette.neutral.black, mb: 0.5 };
const SECTION_SUBTITLE_SX = { ...typography.body2, color: palette.text.secondary };
const CODE_CHIP_SX = {
  fontFamily: 'monospace', fontSize: 11, color: BRAND,
  bgcolor: `${BRAND}12`, px: '5px', py: '1px', borderRadius: '3px', display: 'inline',
};
const TH_SX = {
  fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: palette.text.secondary,
  py: 1, px: 1.5, borderBottom: `1px solid ${color.divider}`,
  bgcolor: 'rgba(0,0,0,0.02)',
};
const TD_SX = {
  py: 1, px: 1.5, fontSize: 12,
  borderBottom: `1px solid ${color.divider}`,
  verticalAlign: 'middle',
};

// ─── Copy cell ────────────────────────────────────────────────────────────────
function CopyCell({ text, copiedKey, onCopy, children }) {
  const isCopied = copiedKey === text;
  return (
    <TableCell
      sx={{
        ...TD_SX,
        cursor: text ? 'pointer' : 'default',
        color: isCopied ? BRAND : 'inherit',
        transition: 'color 0.15s',
        userSelect: 'none',
        '&:hover': text ? { color: BRAND, bgcolor: `${BRAND}08` } : {},
      }}
      onClick={() => text && onCopy(text)}
    >
      {isCopied ? (
        <Box component="span" sx={{ color: BRAND, fontWeight: 500 }}>Copied!</Box>
      ) : children}
    </TableCell>
  );
}

// ─── Color dot ────────────────────────────────────────────────────────────────
function ColorDot({ hex, size = 16 }) {
  const hasAlpha = hex && hex.startsWith('rgba');
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '3px', flexShrink: 0,
      bgcolor: hex || 'transparent',
      border: `1px solid rgba(0,0,0,${hasAlpha ? '0.15' : isLight(hex) ? '0.15' : '0'})`,
      display: 'inline-block',
    }} />
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, title, subtitle, children }) {
  return (
    <Box
      id={id}
      component="section"
      sx={{ mb: 5, scrollMarginTop: `${TOPBAR_H + 16}px` }}
    >
      <Typography sx={SECTION_TITLE_SX}>{title}</Typography>
      {subtitle && (
        <Typography sx={{ ...SECTION_SUBTITLE_SX, mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// ─── SECTION: Color Palette ───────────────────────────────────────────────────
function PaletteSection({ copiedKey, onCopy }) {
  const groups = Object.entries(TR.palette).filter(([k]) => !k.startsWith('_'));

  return (
    <Section
      id="palette"
      title="Color Palette"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/palettes/archera-palette.ts</Box></>}
    >
      {groups.map(([key, group]) => (
        <Box key={key} sx={{ mb: 3 }}>
          <Typography sx={GROUP_LABEL_SX}>
            {group.label || key} &nbsp;
            <Box component="span" sx={{ ...CODE_CHIP_SX, fontWeight: 400 }}>{group.codeKey}</Box>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(group.shades || {}).map(([shade, hex]) => {
              const label = `${key}[${shade}]`;
              const copied = copiedKey === hex;
              return (
                <Box
                  key={shade}
                  onClick={() => onCopy(hex)}
                  title={`Click to copy ${hex}`}
                  sx={{
                    width: 80, cursor: 'pointer', flexShrink: 0,
                    '&:hover .swatch': { outline: `2px solid ${BRAND}` },
                  }}
                >
                  <Box
                    className="swatch"
                    sx={{
                      width: 80, height: 48, borderRadius: '6px',
                      bgcolor: hex,
                      border: `1px solid ${isLight(hex) ? 'rgba(0,0,0,0.10)' : 'transparent'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'outline 0.1s',
                    }}
                  >
                    {copied && (
                      <Typography sx={{ fontSize: 9, fontWeight: 600, color: isLight(hex) ? '#333' : '#fff', letterSpacing: '0.05em' }}>
                        COPIED
                      </Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 10, color: palette.text.secondary, mt: 0.5, lineHeight: 1.3 }}>
                    {shade}
                  </Typography>
                  <Typography sx={{
                    fontSize: 10, fontFamily: 'monospace',
                    color: copied ? BRAND : palette.text.secondary,
                    lineHeight: 1.3, transition: 'color 0.15s',
                  }}>
                    {hex}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Section>
  );
}

// ─── SECTION: Semantic Colors ─────────────────────────────────────────────────
function SemanticSection({ copiedKey, onCopy }) {
  return (
    <Section
      id="semantic"
      title="Semantic Colors"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/tokens.ts → semantic + color</Box></>}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Color', 'Token', 'Value', 'Note'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.semantic.map((row, i) => (
              <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={TD_SX}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <ColorDot hex={row.val} size={32} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12, color: BRAND }}>
                  {row.code}
                </TableCell>
                <CopyCell text={row.val} copiedKey={copiedKey} onCopy={onCopy}>
                  <Box sx={{ fontFamily: 'monospace', fontSize: 11 }}>{row.val}</Box>
                </CopyCell>
                <TableCell sx={{ ...TD_SX, color: palette.text.secondary, fontSize: 11 }}>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Typography ──────────────────────────────────────────────────────
function TypographySection() {
  return (
    <Section
      id="typography"
      title="Typography"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/tokens.ts → typography</Box></>}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Token', 'Size', 'Weight', 'Preview'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.typography.map((row, i) => {
              const sizeNum = parseFloat(row.size);
              const styles = {
                fontSize: sizeNum,
                fontWeight: parseInt(row.weight),
                letterSpacing: row.ls,
                ...(row.transform ? { textTransform: row.transform } : {}),
              };
              return (
                <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11, color: BRAND }}>{row.key}</TableCell>
                  <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{row.size}</TableCell>
                  <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{row.weight}</TableCell>
                  <TableCell sx={TD_SX}>
                    <Typography sx={styles}>{row.preview}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Spacing ─────────────────────────────────────────────────────────
function SpacingSection() {
  const maxPx = Math.max(...TR.spacing.map(s => s.px));
  return (
    <Section
      id="spacing"
      title="Spacing"
      subtitle={<>Base: 8px. Usage: <Box component="code" sx={CODE_CHIP_SX}>spacing.sp(n)</Box> or <Box component="code" sx={CODE_CHIP_SX}>spacing['2']</Box></>}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Token', 'rem', 'px', 'Scale'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.spacing.map((row, i) => (
              <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12, color: BRAND }}>
                  sp({row.n})
                </TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12 }}>{row.rem}</TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12 }}>{row.px}px</TableCell>
                <TableCell sx={TD_SX}>
                  <Box sx={{
                    height: 12, borderRadius: 1,
                    bgcolor: `${BRAND}30`,
                    width: Math.max(2, (row.px / maxPx) * 200),
                    minWidth: 2,
                  }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Border Radius ───────────────────────────────────────────────────
function RadiusSection() {
  return (
    <Section
      id="radius"
      title="Border Radius"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/tokens.ts → radius</Box></>}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Preview', 'Key', 'Value', 'Description'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.radius.map((row, i) => {
              const px = row.val >= 9999 ? '9999px' : `${row.val}px`;
              return (
                <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <TableCell sx={TD_SX}>
                    <Box sx={{
                      width: 40, height: 40, flexShrink: 0,
                      borderRadius: px,
                      bgcolor: `${BRAND}15`,
                      border: `1.5px solid ${BRAND}40`,
                    }} />
                  </TableCell>
                  <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12, color: BRAND }}>{row.key}</TableCell>
                  <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12 }}>{px}</TableCell>
                  <TableCell sx={{ ...TD_SX, fontSize: 12, color: palette.text.secondary }}>{row.desc}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Elevation ───────────────────────────────────────────────────────
function ElevationSection() {
  return (
    <Section
      id="elevation"
      title="Elevation"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/tokens.ts → elevation</Box></>}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Preview', 'Key', 'Shadow'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.elevation.map((row, i) => (
              <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={TD_SX}>
                  <Box sx={{
                    width: 60, height: 40, bgcolor: '#fff', borderRadius: 1,
                    boxShadow: row.val === 'none' ? 'none' : row.val,
                    border: '1px solid rgba(0,0,0,0.06)',
                  }} />
                </TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 12, color: BRAND }}>{row.key}</TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 10, color: palette.text.secondary, maxWidth: 480 }}>
                  {row.val}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Figma Palette Vars ─────────────────────────────────────────────
function FigmaPaletteSection({ copiedKey, onCopy }) {
  return (
    <Section
      id="figma-palette"
      title="Archera Palette Vars"
      subtitle={<>File key: <Box component="code" sx={CODE_CHIP_SX}>HNzOMTY2iPk2uoMHl0gKP1</Box> · Import with <Box component="code" sx={CODE_CHIP_SX}>figma.variables.importVariableByKeyAsync(KEY)</Box></>}
    >
      <Typography sx={{ ...typography.body2, color: palette.text.secondary, mb: 2, fontStyle: 'italic' }}>
        Complete — all 119 variables from the Archera Palette library.
      </Typography>
      {TR.figmaPaletteGroups.map((group) => (
        <Box key={group.figmaPrefix} sx={{ mb: 3 }}>
          <Typography sx={GROUP_LABEL_SX}>
            {group.figmaPrefix} &nbsp;
            <Box component="span" sx={{ ...CODE_CHIP_SX, fontWeight: 400 }}>{group.codeBase}</Box>
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Figma Variable', 'Color', 'Code Accessor', 'Key (click copies)'].map(h => (
                    <TableCell key={h} sx={TH_SX}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {group.vars.map((v, i) => (
                  <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                    <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{v.name}</TableCell>
                    <TableCell sx={TD_SX}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <ColorDot hex={v.hex} size={20} />
                        <Box sx={{ fontFamily: 'monospace', fontSize: 11, color: palette.text.secondary }}>{v.hex}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11, color: BRAND }}>{v.code}</TableCell>
                    <CopyCell text={v.key} copiedKey={copiedKey} onCopy={onCopy}>
                      <Box sx={{ fontFamily: 'monospace', fontSize: 10, color: palette.text.secondary, wordBreak: 'break-all' }}>{v.key}</Box>
                    </CopyCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Section>
  );
}

// ─── SECTION: Figma MUI Semantic Vars ────────────────────────────────────────
function FigmaMuiColorsSection({ copiedKey, onCopy }) {
  return (
    <Section
      id="figma-mui-colors"
      title="MUI Semantic Vars"
      subtitle={<>File: <Box component="code" sx={CODE_CHIP_SX}>MFfU32eTHKdHswYDFgrX9u</Box> · Prefer these over Archera palette vars wherever a semantic MUI var exists — they support light/dark mode.</>}
    >
      {TR.figmaMuiGroups.map((group) => (
        <Box key={group.label} sx={{ mb: 3 }}>
          <Typography sx={GROUP_LABEL_SX}>{group.label}</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Variable', 'Value', 'Code', 'Key (click copies)'].map(h => (
                    <TableCell key={h} sx={TH_SX}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {group.vars.map((v, i) => (
                  <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                    <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{v.name}</TableCell>
                    <TableCell sx={TD_SX}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <ColorDot hex={v.hex} size={20} />
                        <Box sx={{ fontFamily: 'monospace', fontSize: 11, color: palette.text.secondary }}>{v.hex}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11, color: v.code ? BRAND : palette.text.disabled }}>
                      {v.code || '—'}
                    </TableCell>
                    <CopyCell text={v.key} copiedKey={copiedKey} onCopy={onCopy}>
                      <Box sx={{ fontFamily: 'monospace', fontSize: 10, color: palette.text.secondary, wordBreak: 'break-all' }}>{v.key}</Box>
                    </CopyCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Section>
  );
}

// ─── SECTION: Figma Text Styles ───────────────────────────────────────────────
function FigmaTextSection({ copiedKey, onCopy }) {
  return (
    <Section
      id="figma-text"
      title="MUI Text Styles"
      subtitle={<>File: <Box component="code" sx={CODE_CHIP_SX}>MFfU32eTHKdHswYDFgrX9u</Box> · Import with <Box component="code" sx={CODE_CHIP_SX}>figma.importStyleByKeyAsync(KEY)</Box>, apply via <Box component="code" sx={CODE_CHIP_SX}>node.textStyleId = style.id</Box></>}
    >
      <Typography sx={{ ...typography.body2, color: palette.text.secondary, mb: 2, fontStyle: 'italic' }}>
        Never set fontSize/fontName manually when a style exists.
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Style Name', 'Size', 'Weight', 'Code Token', 'Key (click copies)'].map(h => (
                <TableCell key={h} sx={TH_SX}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TR.figmaTextStyles.map((row, i) => (
              <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{row.name}</TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11 }}>{row.size}</TableCell>
                <TableCell sx={{ ...TD_SX, fontSize: 12 }}>{row.weight}</TableCell>
                <TableCell sx={{ ...TD_SX, fontFamily: 'monospace', fontSize: 11, color: row.codeKey !== '—' ? BRAND : palette.text.disabled }}>
                  {row.codeKey}
                </TableCell>
                <CopyCell text={row.key} copiedKey={copiedKey} onCopy={onCopy}>
                  <Box sx={{ fontFamily: 'monospace', fontSize: 10, color: palette.text.secondary, wordBreak: 'break-all' }}>{row.key}</Box>
                </CopyCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

// ─── SECTION: Component Overrides ────────────────────────────────────────────
const COL = { preview: 280, size: 90, slot: 140, fs: 80, lh: 80, ls: 90, pad: 110, h: 90, hFigma: 90 };

function ColHead({ children, w }) {
  return (
    <Box sx={{ width: w, flexShrink: 0, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: palette.text.secondary }}>
      {children}
    </Box>
  );
}

function DataCell({ children, w, mono }) {
  return (
    <Box sx={{ width: w, flexShrink: 0, fontSize: 12, fontFamily: mono ? 'monospace' : undefined, color: palette.text.secondary }}>
      {children}
    </Box>
  );
}

function MeasuredRow({ s, previewEl, extra }) {
  const measureRef = useRef(null);
  const [height, setHeight] = useState('—');

  useEffect(() => {
    if (measureRef.current) {
      setHeight(Math.round(measureRef.current.getBoundingClientRect().height) + 'px');
    }
  }, []);

  return (
    <Stack direction="row" alignItems="center" gap={2} sx={{ py: 1.5, borderBottom: `1px solid ${color.divider}` }}>
      <Stack direction="row" gap={1} alignItems="center" sx={{ width: COL.preview, flexShrink: 0 }}>
        {/* Invisible single element we measure */}
        <Box ref={measureRef} sx={{ display: 'inline-flex' }}>{previewEl}</Box>
        {extra}
      </Stack>
      <DataCell w={COL.size}>
        <Typography sx={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize', color: palette.text.secondary }}>{s.size}</Typography>
      </DataCell>
      <DataCell w={COL.slot} mono>{s.slot}</DataCell>
      <DataCell w={COL.fs} mono>{s.fontSize}</DataCell>
      <DataCell w={COL.lh} mono>{s.lineHeight}</DataCell>
      <DataCell w={COL.ls} mono>{s.letterSpacing}</DataCell>
      <DataCell w={COL.pad} mono>{s.padding}</DataCell>
      <DataCell w={COL.hFigma} mono>{s.figmaHeight ?? '—'}</DataCell>
      <DataCell w={COL.h} mono sx={{ color: height !== '—' && s.figmaHeight && height !== s.figmaHeight ? '#c05c2e' : undefined }}>
        {height}
      </DataCell>
    </Stack>
  );
}

function ButtonPreviewRows({ sizes }) {
  return (
    <>
      <Stack direction="row" alignItems="center" gap={2} sx={{ pb: 1, borderBottom: `2px solid ${color.divider}`, mb: 0.5 }}>
        <ColHead w={COL.preview}>Preview</ColHead>
        <ColHead w={COL.size}>Size</ColHead>
        <ColHead w={COL.slot}>Slot</ColHead>
        <ColHead w={COL.fs}>font-size</ColHead>
        <ColHead w={COL.lh}>line-height</ColHead>
        <ColHead w={COL.ls}>tracking</ColHead>
        <ColHead w={COL.pad}>padding</ColHead>
        <ColHead w={COL.hFigma}>figma h</ColHead>
        <ColHead w={COL.h}>rendered h</ColHead>
      </Stack>
      {sizes.map(s => (
        <MeasuredRow
          key={s.size}
          s={s}
          previewEl={<Button variant="contained" size={s.size} disableElevation>Label</Button>}
          extra={
            <Stack direction="row" gap={1}>
              <Button variant="outlined" size={s.size}>Label</Button>
              <Button variant="text" size={s.size}>Label</Button>
            </Stack>
          }
        />
      ))}
    </>
  );
}

function TogglePreviewRows({ sizes }) {
  return (
    <>
      <Stack direction="row" alignItems="center" gap={2} sx={{ pb: 1, borderBottom: `2px solid ${color.divider}`, mb: 0.5, mt: 0.5 }}>
        <ColHead w={COL.preview}>Preview</ColHead>
        <ColHead w={COL.size}>Size</ColHead>
        <ColHead w={COL.slot}>Slot</ColHead>
        <ColHead w={COL.fs}>font-size</ColHead>
        <ColHead w={COL.lh}>line-height</ColHead>
        <ColHead w={COL.ls}>tracking</ColHead>
        <ColHead w={COL.pad}>padding</ColHead>
        <ColHead w={COL.hFigma}>figma h</ColHead>
        <ColHead w={COL.h}>rendered h</ColHead>
      </Stack>
      {sizes.map(s => {
        const iconSize = s.size === 'large' ? 20 : s.size === 'medium' ? 16 : 12;
        return (
          <MeasuredRow
            key={s.size}
            s={s}
            previewEl={
              <ToggleButton value="left" size={s.size}>
                <MuiIcon sx={{ fontSize: iconSize }}>format_align_left</MuiIcon>
              </ToggleButton>
            }
            extra={
              <Stack direction="row" gap={1}>
                <ToggleButtonGroup size={s.size} value="left" exclusive>
                  <ToggleButton value="center"><MuiIcon sx={{ fontSize: iconSize }}>format_align_center</MuiIcon></ToggleButton>
                  <ToggleButton value="right"><MuiIcon sx={{ fontSize: iconSize }}>format_align_right</MuiIcon></ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup size={s.size} value="bold" exclusive sx={{ ml: 1 }}>
                  <ToggleButton value="bold">BOLD</ToggleButton>
                  <ToggleButton value="italic">ITALIC</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            }
          />
        );
      })}
    </>
  );
}

function ListItemIconPreviewRows({ sizes }) {
  const s = sizes[0];
  return (
    <Stack direction="row" gap={6} alignItems="flex-start">
      {/* Preview */}
      <Box sx={{ minWidth: 260 }}>
        <Typography sx={{ ...typography.body2, color: palette.text.secondary, mb: 1 }}>With override</Typography>
        <List dense disablePadding sx={{ border: `1px solid ${color.divider}`, borderRadius: `${radius.sm}px`, width: 240 }}>
          {['Savings Plan', 'Reserved Instance', 'Committed Use'].map(label => (
            <ListItem key={label}>
              <ListItemIcon><MuiIcon baseClassName="material-icons-outlined" sx={{ fontSize: 20 }}>inventory_2</MuiIcon></ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Override values */}
      <Stack gap={1} sx={{ pt: 4 }}>
        <Stack direction="row" gap={2} alignItems="center">
          <ColHead w={100}>Slot</ColHead>
          <ColHead w={100}>minWidth</ColHead>
          <ColHead w={120}>marginRight</ColHead>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center" sx={{ py: 1, borderTop: `1px solid ${color.divider}` }}>
          <DataCell w={100} mono>{s.slot}</DataCell>
          <DataCell w={100} mono>{s.minWidth}</DataCell>
          <DataCell w={120} mono>{s.marginRight}</DataCell>
        </Stack>
      </Stack>
    </Stack>
  );
}

function ComponentsSection() {
  return (
    <Section
      id="components"
      title="Component Overrides"
      subtitle={<>Source: <Box component="code" sx={CODE_CHIP_SX}>_template/theme.ts → components</Box> · Per-size font and padding customizations applied on top of MUI defaults.</>}
    >
      {TR.components.map((comp, i) => (
        <Box key={comp.name} sx={{ mb: 5 }}>
          {/* Group header */}
          <Stack direction="row" alignItems="baseline" gap={1.5} sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: palette.neutral.black }}>{comp.name}</Typography>
            <Box component="code" sx={CODE_CHIP_SX}>{comp.themeKey}</Box>
          </Stack>
          <Typography sx={{ ...typography.body2, color: palette.text.secondary, mb: 2 }}>{comp.note}</Typography>

          <Box sx={{ overflowX: 'auto' }}>
            {comp.name === 'MuiButton'
              ? <ButtonPreviewRows sizes={comp.sizes} />
              : comp.name === 'MuiToggleButton'
              ? <TogglePreviewRows sizes={comp.sizes} />
              : comp.name === 'MuiListItemIcon'
              ? <ListItemIconPreviewRows sizes={comp.sizes} />
              : null
            }
          </Box>

          {i < TR.components.length - 1 && <Divider sx={{ mt: 4 }} />}
        </Box>
      ))}
    </Section>
  );
}

// ─── Nav Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ activeId }) {
  return (
    <Box sx={{
      width: SIDEBAR_W, flexShrink: 0,
      position: 'sticky', top: TOPBAR_H, height: `calc(100vh - ${TOPBAR_H}px)`,
      overflowY: 'auto', bgcolor: '#fff',
      borderRight: `1px solid ${color.divider}`,
      py: 2,
    }}>
      {NAV_GROUPS.map((group) => (
        <Box key={group.label} sx={{ mb: 2, px: 2 }}>
          <Typography sx={{ ...GROUP_LABEL_SX, mb: 0.5 }}>{group.label}</Typography>
          {group.items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Box
                key={item.id}
                component="a"
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                sx={{
                  display: 'block', py: 0.6, px: 1.25,
                  fontSize: 13, textDecoration: 'none', borderRadius: '6px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? BRAND : palette.text.secondary,
                  bgcolor: isActive ? `${BRAND}10` : 'transparent',
                  transition: 'all 0.1s',
                  '&:hover': { color: BRAND, bgcolor: `${BRAND}08` },
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function TokenReference() {
  const [activeId, setActiveId] = useState('palette');
  const [copiedKey, setCopiedKey] = useState(null);
  const timerRef = useRef(null);

  // Copy handler
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedKey(null), 1200);
  };

  // IntersectionObserver for active nav
  useEffect(() => {
    const allIds = NAV_GROUPS.flatMap(g => g.items.map(i => i.id));
    const observers = [];

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F5F4', fontFamily: 'Roboto, sans-serif' }}>
      {/* Topbar */}
      <Box sx={{
        position: 'sticky', top: 0, zIndex: 200,
        bgcolor: HEADER_BG, height: TOPBAR_H,
        display: 'flex', alignItems: 'center', gap: 2, px: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}>
        <Typography sx={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Token Reference</Typography>
        <Box sx={{ width: '1px', height: 16, bgcolor: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
          Archera Design Tokens + Figma Keys
        </Typography>
      </Box>

      {/* Body: sidebar + content */}
      <Box sx={{ display: 'flex' }}>
        <Sidebar activeId={activeId} />

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0, px: 4, py: 4, maxWidth: 1100 }}>
          <PaletteSection    copiedKey={copiedKey} onCopy={handleCopy} />
          <Divider sx={{ mb: 4 }} />
          <SemanticSection   copiedKey={copiedKey} onCopy={handleCopy} />
          <Divider sx={{ mb: 4 }} />
          <TypographySection />
          <Divider sx={{ mb: 4 }} />
          <SpacingSection />
          <Divider sx={{ mb: 4 }} />
          <RadiusSection />
          <Divider sx={{ mb: 4 }} />
          <ElevationSection />
          <Divider sx={{ mb: 4 }} />
          <FigmaPaletteSection copiedKey={copiedKey} onCopy={handleCopy} />
          <Divider sx={{ mb: 4 }} />
          <FigmaMuiColorsSection copiedKey={copiedKey} onCopy={handleCopy} />
          <Divider sx={{ mb: 4 }} />
          <FigmaTextSection    copiedKey={copiedKey} onCopy={handleCopy} />
          <Divider sx={{ mb: 4 }} />
          <ComponentsSection />

          {/* Footer padding */}
          <Box sx={{ height: 64 }} />
        </Box>
      </Box>
    </Box>
  );
}
