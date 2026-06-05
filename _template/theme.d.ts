// MUI theme type augmentation.
// Declares custom palette keys and extends built-in colors with tonal values
// so theme.palette.accent1[300] and theme.palette.primary[50] typecheck.

import type { TonalKey, TonalScale, NeutralScale } from './palettes/archera-palette';

declare module '@mui/material/styles' {
  // Custom typography variants
  interface TypographyVariants { body3: React.CSSProperties; }
  interface TypographyVariantsOptions { body3?: React.CSSProperties; }

  // Extend all PaletteColor entries (primary, secondary, error, etc.)
  // so tonal access like theme.palette.primary[300] is valid.
  interface PaletteColor extends Record<TonalKey, string> {}
  interface SimplePaletteColorOptions extends Partial<Record<TonalKey, string>> {}

  // Custom palette entries not in MUI's default Palette.
  // uiPrimary/brandPrimary mirror primary/secondary — MUI uses primary/secondary to
  // drive component styling; engineers reference colors by these explicit design system names.
  interface Palette {
    uiPrimary:      PaletteColor;
    brandPrimary:   PaletteColor;
    brandSecondary: PaletteColor;
    brandTertiary:  PaletteColor;
    accent1:        PaletteColor;
    accent2:        PaletteColor;
    neutral:        PaletteColor & NeutralScale;
  }
  interface PaletteOptions {
    uiPrimary?:      SimplePaletteColorOptions;
    brandPrimary?:   SimplePaletteColorOptions;
    brandSecondary?: SimplePaletteColorOptions;
    brandTertiary?:  SimplePaletteColorOptions;
    accent1?:        SimplePaletteColorOptions;
    accent2?:        SimplePaletteColorOptions;
    neutral?:        SimplePaletteColorOptions & Partial<NeutralScale>;
  }
}

export {};
