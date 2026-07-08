"use client";
import { ReactNode } from "react";

export type TableProps<T> = {
  configs: T[];
  headers: { key: keyof T; label: string }[];
  keyField: keyof T;
};

export const Table = <T,>({ configs, headers, keyField }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-primary-100 mt-2">
        <thead>
          <tr className="bg-primary-50">
            {headers.map((header) => (
              <th key={String(header.key)} className="p-2 border-b border-primary-100 text-left">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {configs.map((config, rowIndex) => {
            const keyValue = config[keyField];
            const keyString = String(keyValue);
            const isEvenRow = rowIndex % 2 === 0;
            return (
              <tr key={keyString} className={`border-b border-primary-100 ${isEvenRow ? 'bg-secondary-50' : ''}`}>
                {headers.map((header, cellIndex) => {
                  const value = config[header.key];
                  const isLastCell = cellIndex === headers.length - 1;
                  const displayValue: ReactNode =
                    value === null || value === undefined
                      ? "null"
                      : String(value);
                  return (
                    <td
                      key={`${keyString}-${String(header.key)}`}
                      className="p-2"
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
