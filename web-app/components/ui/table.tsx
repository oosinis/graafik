// web-app/components/ui/table.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Column<T> {
  /** Column header label */
  header: string
  /** Key in each data row object */
  accessor: string
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Column definitions */
  columns: Column<T>[]
  /** An array of row objects; 
   *  each key must match one of your column.accessor values, 
   *  and its value should be a ReactNode to render */
  data: Record<string, React.ReactNode>[]
}

export function Table<T extends object>({
  columns,
  data,
  className,
  ...divProps
}: TableProps<T>) {
  return (
    <div
      className={cn("w-full overflow-auto rounded border", className)}
      {...divProps}
    >
      <table className="w-full table-fixed text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-4 py-2 text-left font-medium text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50 hover:bg-white"
              }
            >
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className="px-4 py-2 align-top"
                >
                  {row[col.accessor as string]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}