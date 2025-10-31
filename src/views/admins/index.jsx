'use client'

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import GridWrapper from '@/components/shared/grid-wrapper'

import { useLocale, useTranslations } from 'next-intl'

import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import { Button, Link } from '@mui/material'
import PageHeader from '@/components/shared/page-header'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import pharmacyAdminServices from '@/services/pharmacy-admin-services'
import AddUserDrawer from './AddUserDrawer'

const PharmacyAdminListView = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { formatPrice } = useFormattedPrice()
  const [loading, setLoading] = useState(false)
  const [formattedData, setFormattedData] = useState([])
  const t = useTranslations()
  const { page = 0, pageSize = 10 } = paginationModel || {}
  const source = 'custom'
  const [data, setData] = useState({})
  const locale = useLocale()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      flex: 0.3,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant='body2'>{row.id}</Typography>
        </Box>
      )
    },
    {
      field: 'name',
      headerName: t('Name'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant='body2'>{row.name}</Typography>
        </Box>
      )
    }
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      const payload = {
        page,
        size: pageSize,
        source,
        values: formattedData.map(f => ({ ...f, fieldName: f.fieldName.replace('2', '') }))
      }
      await pharmacyAdminServices.getAllPharmacyAdminsWithIdAndNames(payload).then(res => {
        if (res.status == 200 || res.status == 201) {
          setData(res.data)
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const successCallBack = () => {
    setAddUserOpen(false)
    fetchData()
  }
  useEffect(() => {
    if (page !== undefined && pageSize !== undefined) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  return (
    <React.Fragment>
      <Box>
        <PageHeader
          heading={t('pharmacyAdmins')}
          breadcrumbs={[
            {
              label: t('pharmacyAdmins')
            }
          ]}
          actions={[
            <Button
              key={`add-pharmacy-admin`}
              color='primary'
              variant='contained'
              startIcon={<i className='bx bx-plus' />}
              className='max-sm:is-full'
              onClick={() => {
                setAddUserOpen(!addUserOpen)
              }}
            >
              {t('addPharmacyAdmin')}
            </Button>
          ]}
        />

        <GridWrapper>
          <DataGrid
            autoHeight
            pagination
            getRowId={row => row.id}
            paginationMode='server'
            sortingMode='server'
            rows={data || []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            isCellFocusable={() => false}
            disableCellSelection
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={data?.length || pageSize}
            loading={loading}
            key={paginationModel.page}
          />
        </GridWrapper>
      </Box>
      <AddUserDrawer
        open={addUserOpen}
        successCallBack={successCallBack}
        handleClose={() => setAddUserOpen(!addUserOpen)}
      />
    </React.Fragment>
  )
}

export default PharmacyAdminListView
