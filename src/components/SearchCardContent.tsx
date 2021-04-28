import { useState, useCallback, Fragment } from 'react'
import { debounce } from 'lodash'

import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { SearchResult } from './SearchResult'

import { IPackage, prefixSearch } from './../config/DBConfig'

const initialResults: IPackage[] = []

export function SearchCardContent({ hidden }: { hidden: boolean }) {
  const [searchResults, setSearchResults] = useState(initialResults)
  const [searchPrefix, setSearchPrefix] = useState('')
  const [searching, setSearching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(
    debounce((_searchPrefix: string) => {
      if (_searchPrefix.length > 0) {
        setSearching(true)
        prefixSearch(_searchPrefix).then((r) => {
          setSearching(false)
          setSearchResults(r)
        })
      } else {
        setSearching(false)
        setSearchResults(initialResults)
      }
    }, 250),
    []
  )

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchPrefix(e.target.value)
    callback(e.target.value)
  }

  return (
    <Fragment>
      <CardContent hidden={hidden}>
        <FormControl>
          <Input
            placeholder="Search"
            value={searchPrefix}
            onChange={handleSearchChange}
          />
        </FormControl>
        <Fade in={searching} unmountOnExit>
          <CircularProgress size="2em" />
        </Fade>
      </CardContent>
      <CardContent hidden={hidden}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell component="th">Show/Hide Nix Expression</TableCell>
              <TableCell component="th">Name</TableCell>
              <TableCell component="th">Nix Package Name</TableCell>
              <TableCell component="th">SHA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((row) => (
              <SearchResult key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Fragment>
  )
}
