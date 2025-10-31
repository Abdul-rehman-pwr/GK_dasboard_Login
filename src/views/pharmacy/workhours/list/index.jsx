'use client'

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import GridWrapper from '@/components/shared/grid-wrapper'
import PageHeader from '@/components/shared/page-header'
import { useTranslations } from 'next-intl'
import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import RowOptions from './rowOptions'
import pharmacyServices from '@/services/pharmacy-services'
import WorkingHourFormDialog from './WorkingHourFormDialog'
import { useSearchParams } from 'next/navigation'
import NotAuthorized from '@/views/NotAuthorized'
import LoadingFallback from '@/components/shared/loading'

const PharmacyWorkingHoursView = () => {
  const t = useTranslations()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [pharmacyName, setPharmacyName] = useState('')
  const searchParams = useSearchParams()
  const pharmacyId = searchParams.get('pharmacyId')
  const source = searchParams.get('source')
  const [unAuth, setUnAuth] = useState(false)

  const getTimeForInput = epoch => {
    const date = new Date(epoch)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const handleDeleteWorkingHour = async id => {
    const deleteWorkingHour = new Promise((resolve, reject) => {
      pharmacyServices
        .deleteWorkingHour(id)
        .then(response => {
          if (response?.status == 200) {
            resolve(response?.description || t('operationSuccessful'))
          } else {
            reject(response?.description || t('error'))
          }
        })
        .catch(error => {
          reject(error || t('error'))
        })
    })

    await toast.promise(deleteWorkingHour, {
      loading: t('deleteWorkingHours'),
      success: msg => msg,
      error: err => err
    })
  }

  const columns = [
    {
      field: 'dayOfWeek',
      headerName: t('day'),
      sortable: false,
      flex: 0.4,
      renderCell: ({ row }) => <Typography variant='body2'>{row.dayOfWeek}</Typography>
    },
    {
      field: 'openingTime',
      headerName: `${t('startTime')} ${t('CET')}`,
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => <Typography variant='body2'>{getTimeForInput(row.openingTime)}</Typography>
    },
    {
      field: 'closingTime',
      headerName: ` ${t('endTime')} ${t('CET')}`,
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => <Typography variant='body2'>{getTimeForInput(row.closingTime)}</Typography>
    },
    {
      field: 'bufferTime',
      headerName: t('bufferMinutes'),
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => <Typography variant='body2'>{row.bufferTime}</Typography>
    },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 0.2,
      sortable: false,
      renderCell: ({ row }) => (
        <RowOptions
          row={row}
          onEdit={() => {
            setEditingRow(row)
            setOpenDialog(true)
          }}
          onDelete={async () => {
            await handleDeleteWorkingHour(row?.id)
            await fetchWorkingHours()
          }}
        />
      )
    }
  ]

  const fetchWorkingHours = async () => {
    try {
      setLoading(true)
      const response = await pharmacyServices.getWorkingHours({
        pharmacyId: pharmacyId,
        source: source
      })

      if (response.status == 200) setData(response.data)
    } catch (error) {
      console.error('Failed to load working hours:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPharmacyData = async () => {
    try {
      setLoading(true)
      const res = await pharmacyServices.getPharmacyById(pharmacyId, source)
      if (res?.status == 200 || res?.status == 201) {
        const pharmacyData = res?.data
        setPharmacyName(pharmacyData?.pharmacyName || pharmacyData?.cannabisPharmacyName)
        setUnAuth(false)
        return true
      } else if (res?.status == 404) {
        setUnAuth(true)
        console.error('Failed to fetch pharmacy data:', res?.description || res?.data)
        return false
      } else {
        console.error('Failed to fetch pharmacy data:', res?.description || res?.data)
        return false
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchPharmacy = async () => {
      const phamracyAuth = await fetchPharmacyData()
      if (phamracyAuth) {
        fetchWorkingHours()
      }
    }
    fetchPharmacy()
  }, [])

  const renderAddButton = () => {
    if (unAuth) return false
    if (data.length === 7) return false
    return true
  }

  return (
    <Guard permission={PERMISSIONS.PHARMACY.LIST}>
      <Box>
        <PageHeader
          heading={t('pharmacyWorkingHours')}
          breadcrumbs={[
            {
              label: t('home'),
              href: '/'
            },
            {
              label: t('pharmacies'),
              href: `/pharmacy/list?source=${source}`
            },
            {
              label: loading ? t('loadingButton') : pharmacyName || t('noAccess')
            },
            {
              label: t('WorkingHours')
            }
          ]}
          actions={[
            renderAddButton() && (
              <Button
                key='addWorkingHour'
                variant='contained'
                color='primary'
                onClick={() => {
                  setEditingRow(null)
                  setOpenDialog(true)
                }}
              >
                {t('addWorkingHour')}
              </Button>
            )
          ]}
        />

        <>
          {unAuth ? (
            <NotAuthorized />
          ) : (
            <>
              <GridWrapper>
                <DataGrid
                  autoHeight
                  rows={data || []}
                  columns={columns}
                  disableRowSelectionOnClick
                  pagination={false}
                  loading={loading}
                  pageSizeOptions={[]}
                  sx={{
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                      outline: 'none'
                    }
                  }}
                />
              </GridWrapper>
              <WorkingHourFormDialog
                data={data}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                editingRow={editingRow}
                onSuccess={() => {
                  setOpenDialog(false)
                  fetchWorkingHours()
                }}
                onFailure={() => {
                  setOpenDialog(false)
                }}
              />
            </>
          )}
        </>
      </Box>
    </Guard>
  )
}

export default PharmacyWorkingHoursView
