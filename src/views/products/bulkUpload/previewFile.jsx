'use client'

import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import Typography from '@mui/material/Typography'

const PreviewFile = ({ file }) => {
  const [previewData, setPreviewData] = useState([])

  useEffect(() => {
    if (!file) return

    const reader = new FileReader()

    reader.onload = e => {
      const data = e.target.result

      if (file.name.endsWith('.csv')) {
        const text = data.toString()
        const rows = text
          .split('\n')
          .map(row => row.split(',').map(cell => cell.trim()))
          .filter(row => row.length > 1) // filter out empty lines
        setPreviewData(rows)
      } else if (file.name.endsWith('.xlsx')) {
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        setPreviewData(json)
      }
    }

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else if (file.name.endsWith('.xlsx')) {
      reader.readAsBinaryString(file)
    }
  }, [file])

  if (!file || previewData.length === 0) return null

  const [header, ...rows] = previewData

  return (
    <div className='overflow-auto'>
      <div className=' border border-gray-300 overflow-auto max-h-[400px]'>
        <table className='min-w-full table-fixed border-collapse text-sm'>
          <thead className='bg-gray-100 text-gray-800 font-semibold'>
            <tr>
              {header.map((cell, index) => (
                <th key={index} className='border border-gray-300 '>
                  <div className='px-2 py-1'>{cell?.toUpperCase() || '—'}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 5).map((row, rowIndex) => (
              <tr key={rowIndex} className='border-t border-gray-200'>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className='border border-gray-200 p-0 m-0'>
                    <div className='px-2 py-1'>{cell || '—'}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 5 && (
        <Typography variant='caption' color='text.disabled' className='mt-1 block'>
          Showing first 5 rows only...
        </Typography>
      )}
    </div>
  )
}

export default PreviewFile
