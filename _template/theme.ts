import { createTheme } from '@mui/material/styles';
import palette from './palettes/archera-palette';

// To white-label: swap the palette import above for the customer's palette file.
// All palette files export the same shape — theme.ts never changes.

const theme = createTheme({
  palette: {
    primary: {
      ...palette.uiPrimary,
      light:        palette.uiPrimary[50],
      main:         palette.uiPrimary[500],
      dark:         palette.uiPrimary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      ...palette.brandPrimary,
      light:        palette.brandPrimary[50],
      main:         palette.brandPrimary[500],
      dark:         palette.brandPrimary[700],
      contrastText: '#FFFFFF',
    },
    uiPrimary: {
      ...palette.uiPrimary,
      light:        palette.uiPrimary[50],
      main:         palette.uiPrimary[500],
      dark:         palette.uiPrimary[700],
      contrastText: '#FFFFFF',
    },
    brandPrimary: {
      ...palette.brandPrimary,
      light:        palette.brandPrimary[50],
      main:         palette.brandPrimary[500],
      dark:         palette.brandPrimary[700],
      contrastText: '#FFFFFF',
    },
    error: {
      ...palette.error,
      light:        palette.error[50],
      main:         palette.error[500],
      dark:         palette.error[700],
      contrastText: '#FFFFFF',
    },
    warning: {
      ...palette.warning,
      light:        palette.warning[50],
      main:         palette.warning[500],
      dark:         palette.warning[700],
      contrastText: '#FFFFFF',
    },
    success: {
      ...palette.success,
      light:        palette.success[50],
      main:         palette.success[500],
      dark:         palette.success[700],
      contrastText: '#FFFFFF',
    },
    info: {
      ...palette.info,
      light:        palette.info[50],
      main:         palette.info[500],
      dark:         palette.info[700],
      contrastText: '#FFFFFF',
    },
    brandSecondary: {
      ...palette.brandSecondary,
      light:        palette.brandSecondary[50],
      main:         palette.brandSecondary[500],
      dark:         palette.brandSecondary[700],
      contrastText: '#FFFFFF',
    },
    brandTertiary: {
      ...palette.brandTertiary,
      light:        palette.brandTertiary[50],
      main:         palette.brandTertiary[500],
      dark:         palette.brandTertiary[700],
      contrastText: '#FFFFFF',
    },
    accent1: {
      ...palette.accent1,
      light:        palette.accent1[50],
      main:         palette.accent1[500],
      dark:         palette.accent1[700],
      contrastText: '#FFFFFF',
    },
    accent2: {
      ...palette.accent2,
      light:        palette.accent2[50],
      main:         palette.accent2[500],
      dark:         palette.accent2[700],
      contrastText: '#FFFFFF',
    },
    neutral: {
      ...palette.neutral,
      light:        palette.neutral[50],
      main:         palette.neutral[500],
      dark:         palette.neutral[700],
      contrastText: '#FFFFFF',
    },
    text: {
      primary:   palette.text.primary,
      secondary: palette.text.secondary,
      disabled:  palette.text.disabled,
    },
    background: {
      default: palette.background,
      paper:   palette.surface,
    },
    divider: 'rgba(0,0,0,0.12)',
  },

  typography: {
    fontFamily: 'Roboto, sans-serif',
    // Source: MUI for Figma v7.2.0 text styles (fetched via Figma Styles API)
    h1: { fontSize: '1.75rem',  fontWeight: 400, lineHeight: 1.14, letterSpacing: '-1.5px'  },
    h2: { fontSize: '1.5rem',   fontWeight: 400, lineHeight: 1.33, letterSpacing: '-0.5px'  },
    h3: { fontSize: '1.25rem',  fontWeight: 500, lineHeight: 1.2,  letterSpacing: '0px'     },
    h4: { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.33, letterSpacing: '0.25px'  },
    h5: { fontSize: '1rem',     fontWeight: 500, lineHeight: 1.25, letterSpacing: '0px'     },
    h6: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.14, letterSpacing: '0.15px'  },
    subtitle1: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.33, letterSpacing: '0.15px' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.43, letterSpacing: '0.15px', textTransform: 'uppercase' },
    body1:     { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.15px' },
    body2:     { fontSize: '0.75rem',  fontWeight: 400, lineHeight: 1.33, letterSpacing: '0.17px' },
    body3:     { fontSize: '1rem',     fontWeight: 400, lineHeight: 1.5,  letterSpacing: '0.12px' },
    caption:   { fontSize: '0.75rem',  fontWeight: 400, lineHeight: 1.66, letterSpacing: '0.4px'  },
    overline:  { fontSize: '0.75rem',  fontWeight: 400, lineHeight: 1.33, letterSpacing: '1.0px', textTransform: 'uppercase' },
    // Medium values; per-size overrides live in components.MuiButton
    button:    { fontSize: '0.75rem', lineHeight: '0.75rem', fontWeight: 500, letterSpacing: '0.4px', textTransform: 'uppercase' },
  },

  // shape.borderRadius confirmed 4px from MUI for Figma v7.2.0 button components
  shape: { borderRadius: 4 },

  spacing: (factor: number) => `${factor * 0.5}rem`,

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        sizeLarge:  { fontSize: '0.875rem', lineHeight: '0.875rem', letterSpacing: '0.46px', padding: '0.5625rem 1rem'    }, // 9px 16px
        sizeMedium: { fontSize: '0.75rem',  lineHeight: '0.75rem',  letterSpacing: '0.4px',  padding: '0.375rem 0.75rem'  }, // 6px 12px
        sizeSmall:  { fontSize: '0.625rem', lineHeight: '0.625rem', letterSpacing: '0.46px', padding: '0.25rem 0.5rem',    minWidth: 0 }, // 4px 8px
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        sizeLarge:  { fontSize: '0.875rem', lineHeight: '0.875rem', letterSpacing: '0.46px', padding: '0.8125rem', '& .MuiIcon-root': { fontSize: '1.25rem' }  }, // 13px (14px - 1px border)
        sizeMedium: { fontSize: '0.75rem',  lineHeight: '0.75rem',  letterSpacing: '0.4px',  padding: '0.4375rem', '& .MuiIcon-root': { fontSize: '1rem' }     }, // 7px  (8px - 1px border)
        sizeSmall:  { fontSize: '0.625rem', lineHeight: '0.625rem', letterSpacing: '0.46px', padding: '0.3125rem', '& .MuiIcon-root': { fontSize: '0.75rem' }  }, // 5px  (6px  - 1px border)
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.2, letterSpacing: '0px' }, // h3
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 0, marginRight: '0.5rem' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.MuiListItemIcon-root': { minWidth: '0 !important', marginRight: '0.5rem' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiSelect:    { defaultProps: { size: 'small' } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 500 },
      },
    },
  },
});

export default theme;
