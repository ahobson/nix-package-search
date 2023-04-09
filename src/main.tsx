import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// taken from
// https://github.com/mui-org/material-ui/issues/13394#issuecomment-815452717

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import { createTheme } from '@mui/material/styles'
import { unstable_createMuiStrictModeTheme } from '@mui/material'
const myCreateTheme = import.meta.env.PROD
  ? createTheme
  : unstable_createMuiStrictModeTheme
const theme = myCreateTheme({})

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
