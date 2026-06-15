import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@archera/design-system/theme'
import App from './ArcheraArchitect.jsx'
import DemoIndex from './DemoIndex.jsx'

const demo = new URLSearchParams(window.location.search).get('demo')

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {demo === null ? <DemoIndex /> : <App />}
  </ThemeProvider>
)
