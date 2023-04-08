import { useState, Fragment } from 'react'

import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
            onClick={() => setOpen(!open)}
          >
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
