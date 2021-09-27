import Card from '@material-ui/core/Card'

import { SearchCardContent } from './SearchCardContent'

export function Search() {
  const hideSearch = false

  return (
    <Card>
      <SearchCardContent hidden={hideSearch} />
    </Card>
  )
}
