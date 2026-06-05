// AppShell — Archera prototype chrome
// Props:
//   breadcrumb  string  — shown above page name (optional)
//   pageName    string  — shown as the page title (default: "Page Name")
//   provider    "AWS" | "Azure" | "GCP" | "Multi"  (default: "AWS")
//   navIcons    [{icon: string, active?: boolean}]  — material icon names for nav
//   contentStyle  object  — sx spread onto the <main> Box
//   children    — content area

import { Box, Stack, Typography, IconButton, Divider } from '@mui/material';
import palette from './palettes/archera-palette';
import { color } from './tokens';

const PROVIDER = {
  AWS:   { color: '#FF9900', label: 'AWS'   },
  Azure: { color: '#0078D4', label: 'Azure' },
  GCP:   { color: '#4285F4', label: 'GCP'   },
  Multi: { color: palette.brandPrimary[500], label: 'Multi' },
};

// Provider badge backgrounds — cloud-brand colors, not in Archera palette
const PROVIDER_BADGE_BG = {
  AWS: '#fff3e0', Azure: '#e3f2fd', GCP: '#e8f5e9', Multi: `${palette.brandPrimary[50]}`,
};

function ArcheraLogo() {
  return (
    <svg width="102" height="24" viewBox="0 0 102 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <path d="M21.7765 17.0341H13.1136V21.9211H21.7765V17.0341Z" fill="url(#as_g0)"/>
      <path d="M2.37738 18.2749L6.71965 10.7538L10.9317 13.1919L6.60024 20.713L2.37738 18.2749Z" fill="url(#as_g1)"/>
      <path d="M15.2848 3.36328L19.6162 10.8844L15.4042 13.3225L11.0728 5.80138L15.2848 3.36328Z" fill="url(#as_g2)"/>
      <path d="M4.45084 21.9102C5.79381 21.9102 6.88251 20.8187 6.88251 19.4722C6.88251 18.1256 5.79381 17.0341 4.45084 17.0341C3.10786 17.0341 2.01917 18.1256 2.01917 19.4722C2.01917 20.8187 3.10786 21.9102 4.45084 21.9102Z" fill={palette.brandTertiary[500]}/>
      <path d="M8.83652 14.3891C10.1795 14.3891 11.2682 13.2976 11.2682 11.951C11.2682 10.6045 10.1795 9.51294 8.83652 9.51294C7.49354 9.51294 6.40485 10.6045 6.40485 11.951C6.40485 13.2976 7.49354 14.3891 8.83652 14.3891Z" fill={palette.brandTertiary[500]}/>
      <path d="M17.4342 14.3891C18.7772 14.3891 19.8659 13.2976 19.8659 11.951C19.8659 10.6045 18.7772 9.51294 17.4342 9.51294C16.0913 9.51294 15.0026 10.6045 15.0026 11.951C15.0026 13.2976 16.0913 14.3891 17.4342 14.3891Z" fill={palette.brandPrimary[500]}/>
      <path d="M21.7874 21.9102C23.1304 21.9102 24.2191 20.8187 24.2191 19.4722C24.2191 18.1256 23.1304 17.0341 21.7874 17.0341C20.4444 17.0341 19.3557 18.1256 19.3557 19.4722C19.3557 20.8187 20.4444 21.9102 21.7874 21.9102Z" fill={palette.brandSecondary[500]}/>
      <path d="M13.1137 21.9102C14.4567 21.9102 15.5454 20.8187 15.5454 19.4722C15.5454 18.1256 14.4567 17.0341 13.1137 17.0341C11.7707 17.0341 10.682 18.1256 10.682 19.4722C10.682 20.8187 11.7707 21.9102 13.1137 21.9102Z" fill={palette.brandSecondary[500]}/>
      <path d="M13.1137 6.85715C14.4567 6.85715 15.5454 5.76557 15.5454 4.41905C15.5454 3.07253 14.4567 1.98096 13.1137 1.98096C11.7707 1.98096 10.682 3.07253 10.682 4.41905C10.682 5.76557 11.7707 6.85715 13.1137 6.85715Z" fill={palette.brandPrimary[500]}/>
      <path d="M38.592 16.011H32.2523L30.9387 19.6572H29.0933L34.4125 4.85449H36.4317L41.751 19.6572H39.9055L38.592 16.011ZM37.9624 14.3239L35.4004 7.19463L32.8385 14.3239H37.9624Z" fill="white"/>
      <path d="M48.6878 9.36054L48.373 10.9279C48.1667 10.7864 47.7542 10.5905 47.2548 10.5905C45.6373 10.5905 44.9426 12.4299 44.9426 14.4V19.6571H43.1514V9.12109H44.834L44.9208 10.4599C45.5613 9.56734 46.3755 8.91428 47.3525 8.91428C48.0039 8.9034 48.4598 9.15374 48.6878 9.36054Z" fill="white"/>
      <path d="M54.6801 10.5905C52.661 10.5905 50.8372 12.1905 50.8372 14.3674C50.8372 16.5769 52.6718 18.1769 54.6801 18.1769C55.8634 18.1769 56.8187 17.7198 57.698 16.8382V18.5905C56.8838 19.3851 55.7657 19.864 54.4087 19.864C51.3366 19.864 48.9592 17.3824 48.9592 14.3565C48.9592 11.396 51.3257 8.89258 54.4087 8.89258C55.7548 8.89258 56.8838 9.37149 57.698 10.166V11.8967C56.8187 11.0586 55.8634 10.5905 54.6801 10.5905Z" fill="white"/>
      <path d="M69.3679 13.4966V19.668H67.5767V14.2476C67.5767 11.6027 66.4585 10.6014 64.8302 10.6014C62.3334 10.6014 61.3346 12.7891 61.3346 14.2912V19.668H59.5435V4.02722H61.3346V10.9497C62.2899 9.80681 63.6469 8.90341 65.449 8.90341C67.8915 8.90341 69.3679 10.5143 69.3679 13.4966Z" fill="white"/>
      <path d="M81.2874 14.9551H72.5594C72.6246 16.8708 74.0358 18.264 76.1961 18.264C77.9222 18.264 78.9643 17.3279 79.4202 16.3919L81.0052 16.5987C80.5927 18.0354 78.9643 19.8749 76.207 19.8749C73.0262 19.8749 70.7791 17.5238 70.7791 14.3347C70.7791 11.3742 72.9177 8.91431 76.0333 8.91431C79.2574 8.91431 81.2874 11.5157 81.2874 14.498V14.9551ZM72.5486 13.6599H79.4962C79.3877 12.0163 78.085 10.5143 76.0224 10.5143C74.0467 10.5143 72.6137 11.9293 72.5486 13.6599Z" fill="white"/>
      <path d="M88.4522 9.36054L88.1374 10.9279C87.9311 10.7864 87.5186 10.5905 87.0192 10.5905C85.4017 10.5905 84.707 12.4299 84.707 14.4V19.6571H82.9158V9.12109H84.5984L84.6852 10.4599C85.3257 9.56734 86.1399 8.91428 87.1169 8.91428C87.7683 8.9034 88.2242 9.15374 88.4522 9.36054Z" fill="white"/>
      <path d="M94.0428 8.90344C96.0185 8.90344 97.6143 10.0245 98.2874 11.5048L98.3742 9.11024H100.079V19.6572H98.3742L98.2874 17.2626C97.6252 18.7429 96.0185 19.864 94.0428 19.864C91.0249 19.864 88.7235 17.4041 88.7235 14.3565C88.7235 11.3633 91.0358 8.90344 94.0428 8.90344ZM94.3142 18.1769C96.4745 18.1769 98.092 16.4463 98.092 14.3674C98.092 12.3211 96.4745 10.5905 94.3142 10.5905C92.1756 10.5905 90.5147 12.3211 90.5147 14.3674C90.5147 16.4572 92.1756 18.1769 94.3142 18.1769Z" fill="white"/>
      <defs>
        <linearGradient id="as_g0" x1="13.1558" y1="19.4772" x2="20.7073" y2="19.4772" gradientUnits="userSpaceOnUse">
          <stop offset="0.00123855" stopColor={palette.brandSecondary[500]}/>
          <stop offset="0.7693" stopColor={palette.brandSecondary[500]} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="as_g1" x1="8.80488" y1="12.0218" x2="5.01418" y2="18.57" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.brandTertiary[500]}/>
          <stop offset="0.8674" stopColor={palette.brandTertiary[500]} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="as_g2" x1="17.4751" y1="12.0624" x2="13.6844" y2="5.51416" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.brandPrimary[500]}/>
          <stop offset="0.8204" stopColor={palette.brandPrimary[500]} stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function NavIconBtn({ icon, active = false }) {
  return (
    <IconButton
      size="small"
      sx={{
        width: 32, height: 32, borderRadius: 2,
        bgcolor: active ? `${palette.brandPrimary[500]}14` : 'transparent',
        '&:hover': { bgcolor: active ? `${palette.brandPrimary[500]}28` : 'action.hover' },
      }}
    >
      <span className="material-icons" style={{fontSize: 18, color: active ? palette.brandPrimary[500] : palette.text.secondary}}>
        {icon}
      </span>
    </IconButton>
  );
}

const DEFAULT_NAV = [
  { icon: 'list_alt' },
  { icon: 'equalizer' },
  { icon: 'workspaces' },
];

export default function AppShell({
  breadcrumb,
  pageName = 'Page Name',
  provider = 'AWS',
  navIcons = DEFAULT_NAV,
  contentStyle,
  children,
}) {
  const prov = PROVIDER[provider] || PROVIDER.AWS;

  return (
    <Box sx={{display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', bgcolor:'background.default'}}>

      {/* ── Header ── */}
      <Box component="header" sx={{flexShrink:0, position:'relative', zIndex:1}}>
        <Box sx={{
          bgcolor: palette.header,
          boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.15)',
          display:'flex', alignItems:'center',
          px: 3, height: 56, gap: 2,
        }}>
          {/* Branding */}
          <Stack direction="row" alignItems="center" gap={3} sx={{flex:1, height:40, minWidth:0}}>
            <ArcheraLogo />
            <Divider orientation="vertical" flexItem sx={{borderColor:'rgba(255,255,255,0.2)', alignSelf:'stretch'}} />
            <Stack gap={0.25} justifyContent="center" sx={{minWidth:0}}>
              {breadcrumb && (
                <Typography variant="overline" sx={{fontWeight:500, color:'rgba(255,255,255,0.8)'}}>
                  {breadcrumb} /
                </Typography>
              )}
              <Typography variant="h3" sx={{color:'common.white'}}>
                {pageName}
              </Typography>
            </Stack>
          </Stack>

          {/* User nav */}
          <Stack direction="row" gap={2} alignItems="center" sx={{flexShrink:0}}>
            <IconButton sx={{color:'rgba(255,255,255,0.8)', p:0}}>
              <span className="material-icons-outlined" style={{fontSize:24}}>help</span>
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{borderColor:'rgba(255,255,255,0.2)', height:32, alignSelf:'center'}} />
            <IconButton sx={{
              bgcolor: 'secondary.main', width:32, height:32, borderRadius:'50%', p:0,
              '&:hover': { bgcolor: 'secondary.dark' },
            }}>
              <span className="material-icons" style={{fontSize:20, color:'white'}}>notifications</span>
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{display:'flex', flex:1, overflow:'hidden'}}>

        {/* Side nav */}
        <Box component="nav" sx={{
          bgcolor: 'background.paper',
          borderRight: `1px solid ${color.outlineBorder}`,
          display:'flex', flexShrink:0, height:'100%',
        }}>
          {/* Provider color stripe */}
          <Box sx={{width:2, bgcolor: prov.color, height:'100%', flexShrink:0}} />

          {/* Nav content */}
          <Stack sx={{height:'100%'}}>
            <Stack sx={{flex:1, gap:3, alignItems:'center', pt:4, px:1, pb:3}}>

              {/* Account section */}
              <Stack alignItems="center" gap={2} sx={{borderBottom:`1px solid ${color.divider}`, pb:2, width:'100%'}}>
                <Box sx={{
                  bgcolor: 'brandSecondary.main',
                  width:32, height:32, borderRadius:1,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Typography variant="h5" sx={{color: palette.neutral.black, lineHeight:1}}>A</Typography>
                </Box>
                <Box sx={{bgcolor: PROVIDER_BADGE_BG[provider] || PROVIDER_BADGE_BG.Multi, borderRadius:1, px:'5px', py:'2px'}}>
                  <Typography sx={{fontSize:'0.5625rem', fontWeight:700, color: prov.color, letterSpacing:'0.05em'}}>
                    {prov.label}
                  </Typography>
                </Box>
              </Stack>

              {/* Nav icons */}
              {navIcons.map((n, i) => (
                <NavIconBtn key={i} icon={n.icon} active={n.active} />
              ))}
            </Stack>

            {/* Collapse button */}
            <Box sx={{borderTop:`1px solid ${color.divider}`, display:'flex', alignItems:'center', justifyContent:'center', py:1}}>
              <IconButton sx={{color:'text.secondary', p:0.5}}>
                <span className="material-icons-outlined" style={{fontSize:24}}>menu</span>
              </IconButton>
            </Box>
          </Stack>
        </Box>

        {/* Content area */}
        <Box component="main" sx={{flex:1, p:'2rem 2rem 3rem', overflowY:'auto', bgcolor:'background.default', ...contentStyle}}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
