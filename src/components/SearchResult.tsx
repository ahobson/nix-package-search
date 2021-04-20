import { useState, Fragment } from 'react'

import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import { IPackage } from './../config/DBConfig'
import { NixExpression } from './NixExpression'

export function SearchResult({ row }: { row: IPackage }) {
  const [open, setOpen] = useState(false)
  return (
    <Fragment>
      <TableRow key={row.id}>
        <TableCell>
          <IconButton
            aria-label="expand-row"
            size="small"
            onClick={() => setOpen(!open)}>
            {open ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.nixPackageName}</TableCell>
        <TableCell>{row.sha}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <NixExpression row={row} />
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
