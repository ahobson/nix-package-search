import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { useLocation, Link } from 'react-router-dom'

export function TopNav() {
  const location = useLocation()

  return (
    <AppBar position="static">
      <Tabs value={location.pathname}>
        <Tab label="Home" value="/" component={Link} to="/" />
        <Tab label="Search" value="/search" component={Link} to="/search" />
      </Tabs>
    </AppBar>
  )
}
