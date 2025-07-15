import React from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends { id: string },>(
  { columns, data }: TableProps<T>
) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${col.className || ''}`}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
