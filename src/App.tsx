import './App.scss'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
import { Search } from './components/Search'
import { TopNav } from './components/TopNav'

function NoMatch() {
  window.location.reload()
  return <></>
}

function App() {
  return (
    <Router>
      <Container>
        <Grid>
          <TopNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/*" element={<Search />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Grid>
      </Container>
    </Router>
  )
}

export default App
