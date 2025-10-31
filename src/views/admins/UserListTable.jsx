'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from '@core/components/mui/Avatar'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import { useLocale, useTranslations } from 'next-intl'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import CustomTextField from '@core/components/mui/TextField'
import { toast, Toaster } from 'react-hot-toast'
import clientService from '@/services/clientService'
import responseHandler from '@/utils/responseHandler'
import Filters from './Filters'
import ConfirmationDialog from '@/components/shared/dialogs/confirmation-dialog'
import { Box, IconButton, Tooltip } from '@mui/material'
import { FaTrashAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaEye } from 'react-icons/fa'
import { countries } from '@/configs/app'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const UserListTable = ({
  tableData,
  refresh,
  setRefresh = () => {},
  filters = [],
  setFilters = () => {},
  totalRows,
  page,
  setPage,
  setPageSize,
  pageSize
}) => {
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [alertUserForDelete, setAlertUserForDelete] = useState(false)
  const t = useTranslations()

  const successCallBack = () => {
    setAddUserOpen(false)
    setRefresh(Date.now())
  }

  const deleteClient = async id => {
    try {
      const response = await clientService.deleteClient(id)
      const { result, status, description } = responseHandler(response)
      if (status == '200') {
        toast.success(t('clientDeletedSuccessfully'))
        setRefresh(Date.now())
        setAlertUserForDelete(false)
        setSelectedUser({})
      } else {
        console.error(description)
      }
    } catch (err) {
      console.error(err?.message || 'An error occurred.')
    }
  }

  const handleEditClick = user => {
    setEditMode(true)
    setAddUserOpen(true)
    setSelectedUser(user)
  }

  const handleCancelAlert = () => {
    setAlertUserForDelete(false)
  }

  const columns = [
    {
      sortable: false,
      field: 'id',
      headerName: 'ID',
      maxWidth: 40,
      flex: 1,
      renderCell: params => <div>{params.value}</div>
    },
    {
      sortable: false,
      field: 'name',
      headerName: t('clientName'),
      flex: 1,
      renderCell: params => <div>{params.value}</div>
    },
    {
      sortable: false,
      field: 'email',
      headerName: t('emailLabel'),
      flex: 2,
      renderCell: params => <div>{params.value}</div>
    },
    {
      sortable: false,
      field: 'country',
      headerName: t('countryLabel'),
      flex: 1,
      renderCell: params => {
        const country = countries.find(c => c.value === params.value)
        return <div>{country ? country.label : params.value}</div>
      }
    },
    {
      sortable: false,
      field: 'clientType',
      headerName: t('clientType'),
      flex: 1,
      renderCell: params => (
        <div>{params.value == 'Public' ? t('businessOrganization') : t('privateIndividualorOrganization')}</div>
      )
    },
    {
      sortable: false,
      field: 'action',
      headerName: t('actions'),
      flex: 1,
      renderCell: params => <ActionButtons row={params.row} />
    }
  ]

  const ActionButtons = row => {
    const { id, status } = row?.row
    return (
      <Box className='flex items-center p-2 justify-center gap-2'>
        <Tooltip title={t('delete')} arrow>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              setAlertUserForDelete(true)
              setSelectedUser(row?.row)
            }}
            sx={{
              color: '#E63946',
              '&:hover': {
                backgroundColor: 'rgba(230, 57, 70, 0.1)'
              }
            }}
          >
            <FaTrashAlt size={20} />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('edit')} arrow>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              handleEditClick(row?.row)
            }}
            sx={{
              color: '#457B9D'
            }}
          >
            <FaEdit size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  const TableHeader = () => {
    return (
      <div className='flex justify-between p-4'>
        <h2>{t('pharmacyAdmins')}</h2>
        <div className='flex justify-end'>
          <div>
            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='bx-filter' />}
              className='max-sm:is-full'
              onClick={() => setGlobalFilter(true)}
            >
              {t('Filters')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 4000
        }}
      />
      <Box className='flex flex-col gap-4'>
        <Box className='flex justify-end'>
          <Button
            color='primary'
            variant='contained'
            startIcon={<i className='bx bx-plus' />}
            className='max-sm:is-full'
            onClick={() => {
              setEditMode(false)
              setSelectedUser({})
              setAddUserOpen(!addUserOpen)
            }}
          >
            {t('addPharmacyAdmin')}
          </Button>
        </Box>

        {/* Card containing Table */}
        <Card>
          <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
            <TableHeader />
            <DataGrid
              rows={tableData}
              columns={columns}
              pageSize={pageSize}
              pagination
              rowsPerPageOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              page={page}
              rowCount={totalRows}
              onPaginationModelChange={({ page, pageSize }) => {
                setPage(page)
                setPageSize(pageSize)
              }}
              onRowClick={params => {
                setSelectedUser(params.row)
                handleEditClick(params.row)
              }}
              getRowClassName={() => 'custom-row'}
              sx={{
                '& .custom-row:hover': {
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            />
          </div>
        </Card>
      </Box>

      <AddUserDrawer
        user={selectedUser}
        editMode={editMode}
        open={addUserOpen}
        successCallBack={successCallBack}
        handleClose={() => setAddUserOpen(!addUserOpen)}
      />
      <Filters
        open={globalFilter}
        handleClose={() => setGlobalFilter(!globalFilter)}
        filters={filters}
        setFilters={setFilters}
      />
      <ConfirmationDialog
        open={alertUserForDelete}
        heading={t('delete')}
        text={t('areYouSureToDelete')}
        onProceed={() => deleteClient(selectedUser?.id)}
        onCancel={handleCancelAlert}
      />
    </>
  )
}

export default UserListTable
