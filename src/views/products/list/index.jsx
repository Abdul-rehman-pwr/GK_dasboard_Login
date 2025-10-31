'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import RowOptions from './rowOptions'
import GridWrapper from '@/components/shared/grid-wrapper'
import { useTranslations, useLocale } from 'next-intl'
import pharmacyServices from '@/services/pharmacy-services'

import productPlaceholderImage from '@/assets/product_placeholder.png'
import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import { Button, Chip, Tooltip } from '@mui/material'
import ProductListHeader from './ProductListHeader'
import Link from '@/components/Link'
import PageHeader from '@/components/shared/page-header'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import productService from '@/services/productService'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import Filters from '@/components/filters'
import Tabs from '@/views/pharmacy/list/tabs'
import { useRouter, useSearchParams } from 'next/navigation'

const ProductListView = () => {
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

  const [data, setData] = useState({})
  const locale = useLocale()
  const { permissions } = useUserPermissions()
  const [totalElements, setTotalElements] = useState(0)
  const [sortModel, setSortModel] = useState([])
  const [sorters, setSorters] = useState([])
  const [showActionButtons, setShowActionButtons] = useState(false)

  const handleChange = (event, value) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('source', value)
    router.push(`?${params.toString()}`)
  }

  useEffect(() => {
    if (!source || activeTab !== source) {
      setActiveTab(source)
    }
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
      field: 'imageUrl',
      headerName: t('Image'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => (
        <img
          src={row.imageUrl ?? productPlaceholderImage.src}
          alt={row.name}
          onError={e => {
            e.target.onerror = null
            e.target.src = productPlaceholderImage.src
          }}
          style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
        />
      )
    },
    {
      field: 'productId',
      headerName: t('productID'),
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.productId)
    },
    {
      field: 'priorityRanking',
      headerName: t('priorityRanking'),
      sortable: true,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.priorityRanking)
    },
    {
      field: 'isNew',
      headerName: t('new'),
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => {
        return (
          <Chip
            label={row.isNew ? t('yes') : t('no')}
            color='default'
            size='small'
            sx={{ fontWeight: 'bold' }}
            variant='outlined'
          />
        )
      }
    },
    {
      field: 'slug',
      headerName: t('Slug'),
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.slug)
    },
    {
      field: 'name',
      headerName: t('productName'),
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.name)
    },
    {
      field: 'strain',
      headerName: t('strain'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.strain)
    },
    {
      field: 'thc',
      headerName: t('thc'),
      sortable: false,
      filterable: false,
      flex: 0.2,
      renderCell: ({ row }) => <Typography variant='body2'>{row.thc}%</Typography>
    },
    {
      field: 'cbd',
      headerName: t('cbd'),
      sortable: false,
      filterable: false,
      flex: 0.2,
      renderCell: ({ row }) => <Typography variant='body2'>{row.cbd}%</Typography>
    },
    {
      field: 'price',
      headerName: t('price'),
      sortable: false,
      flex: 0.3,
      renderCell: ({ row }) => <Typography variant='body2'>€ {formatPrice(row.price)}</Typography>
    },
    {
      field: 'originalPrice',
      headerName: t('originalPrice'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => <Typography variant='body2'>€ {formatPrice(row.originalPrice)}</Typography>
    },
    {
      field: 'pharmacyName',
      headerName: t('pharmacyName'),
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.pharmacyName)
    }
  ]

  const FIELDS = useMemo(() => {
    return [
      {
        label: t('pharmacyName'),
        type: 'text',
        name: 'pharmacyName',
        nullable: true,
        searchOperator: 'LIKE'
      },
      {
        label: t('productID'),
        type: 'text',
        name: 'productId',
        searchOperator: 'EQUAL',
        nullable: true
      },
      {
        label: t('productName'),
        type: 'text',
        name: 'name',
        searchOperator: 'LIKE',
        nullable: true
      },
      {
        label: t('price'),
        type: 'text',
        name: 'price',
        searchOperator: 'EQUAL',
        nullable: true
      },
      {
        label: t('originalPrice'),
        type: 'text',
        name: 'originalPrice',
        searchOperator: 'EQUAL',
        nullable: true
      }
    ]
  }, [t])

  if (permissions.has(PERMISSIONS.PRODUCT.VIEW_PRODUCT_ACTIONS)) {
    columns.push({
      field: 'actions',
      headerName: t('actions'),
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <RowOptions row={row} setData={setData} />
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const payload = {
        page,
        size: pageSize,
        source,
        body: formattedData.map(f => ({ ...f, fieldName: f.fieldName.replace('2', '') })),
        sort: sorters
      }
      await productService.getProducts(payload).then(res => {
        if (res.status == 200 || res.status == 201) {
          setData(res.data?.data?.content || [])
          setTotalElements(res?.data?.data?.totalElements ?? 0)
        }
      })

      const customPharmacies = await pharmacyServices.getPharmacies({ source: 'custom' })
      if (customPharmacies.status == 200) {
        const { data } = customPharmacies
        const { content = [] } = data ?? {}
        if (content?.length) {
          setShowActionButtons(true)
        }
      }
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
    if (page !== undefined && pageSize !== undefined && source) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, formattedData, sorters, source])

  const onSubmit = async data => {
    setFormattedData(data.values || [])
  }

  return (
    <Box className='flex flex-col gap-4'>
      <PageHeader
        heading={t('products')}
        breadcrumbs={[
          {
            label: t('products'),
            href: '/products'
          }
        ]}
        actions={[
          <>
            {showActionButtons && source === "custom" && (
              <CanView permission={PERMISSIONS.PRODUCT.BULK_UPLOAD_PRODUCTS}>
                <Link key='bulkUpload' href={getLocalizedURL(locale, `products/bulk-upload`)} passHref>
                  <Button variant='contained' color='primary' startIcon={<i className='bx bx-upload' />}>
                    {t('bulkUpload')}
                  </Button>
                </Link>
              </CanView>
            )}

            {showActionButtons && source === "custom" && (
              <CanView permission={PERMISSIONS.PRODUCT.ADD}>
                <Link key='addProduct' href={getLocalizedURL(locale, `products/add?source=${source}`)} passHref>
                  <Button variant='contained' color='primary'>
                    {t('addProduct')}
                  </Button>
                </Link>
              </CanView>
            )}
          </>
        ]}
      />

      <Box className='flex'>
        <Tabs activeTab={activeTab} handleChange={handleChange} />
      </Box>
      {/* <div className='pb-3'>
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
      </div> */}
      <GridWrapper>
        <DataGrid
          autoHeight
          pagination
          getRowId={row => row.id}
          paginationMode='server'
          sortingMode='server'
          onSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          rows={data || []}
          rowCount={totalElements || pageSize}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          isCellFocusable={() => false}
          disableCellSelection
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
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
  )
}

export default ProductListView
