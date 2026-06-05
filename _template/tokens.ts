import palette, { type AppPalette, type TonalScale, type NeutralScale } from './palettes/archera-palette';

// Re-exports palette values in a shape convenient for inline-style usage.
// theme.ts uses the same palette for MUI ThemeProvider.

export { palette };
export type { AppPalette, TonalScale, NeutralScale };

export const color = {
  uiPrimary:      palette.uiPrimary,
  brandPrimary:   palette.brandPrimary,
  brandSecondary: palette.brandSecondary,
  brandTertiary:  palette.brandTertiary,
  accent1:        palette.accent1,
  accent2:        palette.accent2,
  success:        palette.success,
  warning:        palette.warning,
  error:          palette.error,
  info:           palette.info,
  neutral:        palette.neutral,
  text:           palette.text,
  background:     palette.background,
  surface:        palette.surface,
  header:         palette.header,
  divider:        'rgba(0,0,0,0.12)',
  outlineBorder:  'rgba(0,0,0,0.12)', // MUI _components/paper/outlineBorder
};

// Semantic color objects matching MUI theme palette shape (main/dark/light/contrastText).
// Mirrors the values in theme.ts — use for inline styles where theme is unavailable.
export const semantic = {
  primary:   { light: palette.uiPrimary[50],     main: palette.uiPrimary[500],  dark: palette.uiPrimary[700],  contrastText: '#FFFFFF' },
  secondary: { light: palette.brandPrimary[50],  main: palette.brandPrimary[500], dark: palette.brandPrimary[700], contrastText: '#FFFFFF' },
  success:   { light: palette.success[50],   main: palette.success[500],   dark: palette.success[700],   contrastText: '#FFFFFF' },
  warning:   { light: palette.warning[50],   main: palette.warning[500],   dark: palette.warning[700],   contrastText: '#FFFFFF' },
  error:     { light: palette.error[50],     main: palette.error[500],     dark: palette.error[700],     contrastText: '#FFFFFF' },
  info:      { light: palette.info[50],      main: palette.info[500],      dark: palette.info[700],      contrastText: '#FFFFFF' },
};

// Source: MUI for Figma v7.2.0 text styles (Figma Styles API)
export const typography = {
  fontFamily: 'Roboto, sans-serif',
  h1:        { fontSize: '1.75rem',  lineHeight: '2rem',    fontWeight: 400, letterSpacing: '-1.5px' },
  h2:        { fontSize: '1.5rem',   lineHeight: '2rem',    fontWeight: 400, letterSpacing: '-0.5px' },
  h3:        { fontSize: '1.25rem',  lineHeight: '1.5rem',  fontWeight: 500, letterSpacing: '0px'    },
  h4:        { fontSize: '1.125rem', lineHeight: '1.5rem',  fontWeight: 500, letterSpacing: '0.25px' },
  h5:        { fontSize: '1rem',     lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0px'    },
  h6:        { fontSize: '0.875rem', lineHeight: '1rem',    fontWeight: 500, letterSpacing: '0.15px' },
  subtitle1: { fontSize: '1.125rem', lineHeight: '1.5rem',  fontWeight: 400, letterSpacing: '0.15px' },
  subtitle2: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0.15px', textTransform: 'uppercase' as const },
  body1:     { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '0.15px' },
  body2:     { fontSize: '0.75rem',  lineHeight: '1rem',    fontWeight: 400, letterSpacing: '0.17px' },
  body3:     { fontSize: '1rem',     lineHeight: '1.5',     fontWeight: 400, letterSpacing: '0.12px' },
  caption:   { fontSize: '0.75rem',  lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '0.4px'  },
  overline:  { fontSize: '0.75rem',  lineHeight: '1rem',    fontWeight: 400, letterSpacing: '1.0px',  textTransform: 'uppercase' as const },
  button:    { fontSize: '0.75rem',  lineHeight: '0.75rem', fontWeight: 500, letterSpacing: '0.4px',  textTransform: 'uppercase' as const },
};

export const spacing = {
  base: 8,
  sp: (n: number): string => `${n * 0.5}rem`,
  '0.25': '0.125rem', '0.5': '0.25rem', '1': '0.5rem',  '1.5': '0.75rem', '2': '1rem',
  '2.5': '1.25rem',   '3': '1.5rem',    '4': '2rem',    '5': '2.5rem',
  '6': '3rem',        '8': '4rem',      '10': '5rem',   '12': '6rem',
};

// borderRadius: 4px confirmed from MUI for Figma v7.2.0 button components
export const radius = { base: 4, sm: 4, md: 4, lg: 8, xl: 16, full: 9999 };

export const elevation = {
  0: 'none',
  1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  2: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  3: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  4: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
};
