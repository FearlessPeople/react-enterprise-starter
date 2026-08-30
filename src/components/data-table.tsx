import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import {
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"
import {
  dataTableFeatures,
  type DataTableFeatures,
} from "@/components/data-table-features"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "搜索...",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState("")
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  })
  const rows = table.getRowModel().rows.filter(
    (row) =>
      !filterColumn ||
      String(row.getValue(filterColumn) ?? "")
        .toLowerCase()
        .includes(filter.toLowerCase())
  )
  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={filterPlaceholder}
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() =>
                          header.column.toggleSorting(
                            header.column.getIsSorted() === "asc"
                          )
                        }
                      >
                        {String(header.column.columnDef.header ?? header.id)}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="size-3" />
                        ) : (
                          <ChevronsUpDown className="size-3 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {String(cell.getValue() ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}
