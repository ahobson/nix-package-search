import './App.scss'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import { HashRouter as Router, Switch, Route } from 'react-router-dom'

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
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Grid>
      </Container>
    </Router>
  )
}

export default App
