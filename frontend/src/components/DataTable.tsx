import type { Key, ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn<T>[]
  getRowKey: (row: T) => Key
  caption: string
}

const DataTable = <T,>({
  rows,
  columns,
  getRowKey,
  caption,
}: DataTableProps<T>) => (
  <TableContainer component={Paper} className="table-scroll" elevation={0}>
    <Table aria-label={caption}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key} component="th" scope="col">
              {column.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowKey(row)} hover>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.render(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default DataTable
