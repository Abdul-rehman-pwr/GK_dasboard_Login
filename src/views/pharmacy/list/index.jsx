'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import RowOptions from './rowOptions'
import GridWrapper from '@/components/shared/grid-wrapper'
import { useLocale, useTranslations } from 'next-intl'
import pharmacyServices from '@/services/pharmacy-services'
import Filters from '@/components/filters'
import { Tooltip, Button, Chip, Link } from '@mui/material'
import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import PageHeader from '@/components/shared/page-header'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import Guard from '@/components/guard'
import { PERMISSIONS } from '@/utils/permissions'
import CanView from '@/@core/components/can/can-view'
import { useRouter, useSearchParams } from 'next/navigation'
import Tabs from './tabs'

const PharmacyListView = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { formatPrice } = useFormattedPrice()
  const [loading, setLoading] = useState(false)
  const [formattedData, setFormattedData] = useState([])
  const t = useTranslations()
  const { page = 0, pageSize = 10 } = paginationModel || {}
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get('source')
  const [activeTab, setActiveTab] = useState(source || 'custom')

  const handleChange = (event, value) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('source', value)
    router.push(`?${params.toString()}`)
  }

  const [data, setData] = useState({})
  const locale = useLocale()

  const [sortModel, setSortModel] = useState([])
  const [sorters, setSorters] = useState([])

  useEffect(() => {
    if (!source || activeTab !== source) {
      setActiveTab(source)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source])

  const renderEllipsisCell = value => (
    <Tooltip title={value}>
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        <Typography variant='body2' noWrap>
          {value}
        </Typography>
      </Box>
    </Tooltip>
  )

  const columns = [
    {
      field: 'pharmacyId',
      headerName: t('pharmacyId'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.pharmacyId)
    },
    {
      field: 'pharmacyName',
      headerName: t('pharmacyName'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.pharmacyName)
    },
    {
      field: 'priorityRanking',
      headerName: t('priorityRanking'),
      sortable: true,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.priorityRanking)
    },
    {
      field: 'officialName',
      headerName: t('officialName'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.officialName)
    },
    {
      field: 'pharmacyOnboardingStatus',
      headerName: t('pharmacyOnboardingStatus'),
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => (
        <Chip
          label={t(row?.pharmacyOnboardingStatus || 'PENDING')}
          variant='tonal'
          size='small'
          color={row?.pharmacyOnboardingStatus === 'COMPLETED' ? 'success' : 'error'}
        />
      )

      // renderEllipsisCell(t(row?.pharmacyOnboardingStatus || 'PENDING'))
    },
    {
      field: 'domain',
      headerName: t('domain'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.domain)
    },

    {
      field: 'email',
      headerName: 'Email',
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.email)
    },
    {
      field: 'phoneNumber',
      headerName: t('phoneNumber'),
      sortable: false,
      flex: 0.2,
      renderCell: ({ row }) => renderEllipsisCell(row.phoneNumber)
    },

    {
      field: 'doctorFee',
      headerName: t('doctorFee'),
      sortable: false,
      filterable: false,
      flex: 0.2,
      renderCell: ({ row }) => <Typography variant='body2'>€ {formatPrice(row.doctorFee)}</Typography>
    },
    {
      field: 'platformFee',
      headerName: t('platformFee'),
      sortable: false,
      filterable: false,
      flex: 0.2,
      renderCell: ({ row }) => <Typography variant='body2'>€ {formatPrice(row.platformFee)}</Typography>
    },
    {
      field: 'enabled',
      headerName: t('isEnabled'),
      sortable: false,
      filterable: false,
      flex: 0.2,
      renderCell: ({ row }) => (
        <Chip
          label={t(row.enabled ? 'Enabled' : 'Disabled')}
          color={row.enabled ? 'success' : 'error'}
          size='small'
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 0.2,
      sortable: false,
      disableColumnReorder: true,
      filterable: false,
      renderCell: ({ row }) => <RowOptions row={row} setData={setData} />
    }
  ]

  const FIELDS = useMemo(() => {
    return [
      {
        label: t('pharmacyName'),
        type: 'text',
        name: source === 'custom' ? 'pharmacyName' : 'cannabisPharmacyName',
        nullable: true,
        searchOperator: 'LIKE'
      },
      {
        label: t('officialName'),
        type: 'text',
        name: 'officialName',
        nullable: true,
        searchOperator: 'LIKE'
      },
      {
        label: t('Email'),
        type: 'text',
        name: 'email',
        searchOperator: 'LIKE',
        nullable: true
      },
      {
        label: t('domain'),
        type: 'text',
        name: 'domain',
        searchOperator: 'LIKE',
        nullable: true
      },
      {
        label: t('doctorFee'),
        type: 'text',
        name: 'doctorFee',
        searchOperator: 'EQUAL',
        nullable: true
      }
    ]
  }, [t, source])

  const fetchData = async (values = []) => {
    try {
      setLoading(true)
      const payload = {
        page,
        size: pageSize,
        source: source,
        values: values.map(v => ({
          ...v,
          fieldName: v.fieldName?.replace('2', '')
        })),
        sort: sorters
      }
      await pharmacyServices.getPharmacies(payload).then(res => {
        if (res.status == 200 || res.status == 201) {
          setData(res.data)
        } else {
          setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: pageSize })
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSortModelChange = newModel => {
    setSortModel(newModel)
    const userSorters = newModel.map(({ field, sort }) => `${field},${sort}`)
    setSorters(userSorters)
  }

  useEffect(() => {
    if (!source) return
    if (page !== undefined && pageSize !== undefined) {
      fetchData(formattedData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, formattedData, sorters, source])

  const onSubmit = async data => {
    setFormattedData(data.values || [])
  }
  return (
    <Guard permission={PERMISSIONS.PHARMACY.LIST}>
      <Box>
        <PageHeader
          heading={t('pharmacies')}
          breadcrumbs={[
            {
              label: t('home'),
              href: '/'
            },
            {
              label: t('pharmacies')
            }
          ]}
          actions={[
            source !== 'cannaleo' && (
              <CanView key='addPharmacy' permission={PERMISSIONS.PHARMACY.ADD}>
                <Link href={getLocalizedURL(locale, `pharmacy/add`)} passHref>
                  <Button variant='contained' color='primary'>
                    {t('addPharmacy')}
                  </Button>
                </Link>
              </CanView>
            )
          ]}
        />
        <Box className='flex'>
          <Tabs activeTab={activeTab} handleChange={handleChange} />
        </Box>

        <div className='pb-3'>
          <Filters
            key='filters'
            loading={loading}
            submit={data => onSubmit(data)}
            dataPassToAPI={{
              page: 0,
              size: pageSize
            }}
            fields={FIELDS}
          />
        </div>

        <GridWrapper>
          <DataGrid
            autoHeight
            pagination
            getRowId={row => row.pharmacyId}
            paginationMode='server'
            sortingMode='server'
            onSortModelChange={handleSortModelChange}
            sortModel={sortModel}
            rows={data?.content || []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            isCellFocusable={() => false}
            disableCellSelection
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={data?.totalElements || pageSize}
            loading={loading}
            key={paginationModel.page}
            sx={{
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none'
              },
              '& .MuiDataGrid-columnHeaderCheckbox': {
                visibility: 'hidden'
              },
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer !important'
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none !important'
              },
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                outline: 'none !important'
              },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none'
              }
            }}
          />
        </GridWrapper>
      </Box>
    </Guard>
  )
}

export default PharmacyListView
