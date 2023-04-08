import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { useLocation, Link } from 'react-router-dom'

export function TopNav() {
  const location = useLocation()

  return (
    <AppBar position="static">
      <Tabs
        value={location.pathname}
        indicatorColor="secondary"
        textColor="inherit"
      >
        <Tab label="Home" value="/" component={Link} to="/" />
        <Tab label="Search" value="/search" component={Link} to="/search" />
      </Tabs>
    </AppBar>
  )
}
