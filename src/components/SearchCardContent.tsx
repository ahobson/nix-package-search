import { useState, useEffect, Fragment } from 'react'

import CardContent from '@material-ui/core/CardContent'
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

  useEffect(() => {
    if (searchPrefix.length > 0) {
      prefixSearch(searchPrefix).then((r) => {
        setSearchResults(r)
      })
    } else {
      setSearchResults(initialResults)
    }
  }, [searchPrefix])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchPrefix(e.target.value)
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
