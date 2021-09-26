import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// taken from
// https://github.com/mui-org/material-ui/issues/13394#issuecomment-815452717

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import { createMuiTheme } from '@material-ui/core'
import { unstable_createMuiStrictModeTheme } from '@material-ui/core'
const createTheme =
  process.env.NODE_ENV === 'production'
    ? createMuiTheme
    : unstable_createMuiStrictModeTheme
const theme = createTheme({})

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
