import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
