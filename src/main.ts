import { setupLanding } from './landing'
import { setupMenu } from './menu'
import { setupSearch } from './search'

setupLanding(document.querySelector<HTMLDivElement>('#noscript')!)
setupMenu(document.querySelector<HTMLDivElement>('#menu')!)
setupSearch(document.querySelector<HTMLDivElement>('#search')!)
