/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'

const DisplayTable = ({data, column }) => {

  const table = useReactTable({
    data,
    columns : column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
    <table className='w-full'>
      <thead className='bg-black text-white'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {/* console.log("headerGroup",headerGroup.headers) */}
            <th>Item No.</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='border whitespace-nowrap'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr key={row.id}>
            <td className='border px-2 py-2'>{index + 1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='border px-2 py-2 whitespace-nowrap'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
     
    </table>
  </div>
  )
}

export default DisplayTable