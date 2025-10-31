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
import Link from '@/components/Link'
import PageHeader from '@/components/shared/page-header'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import productService from '@/services/productService'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'
import { useUserPermissions } from '@/hooks/useUserPermissions'
import { useSearchParams } from 'next/navigation'

const ProductsMetadataListView = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { formatPrice } = useFormattedPrice()
  const [loading, setLoading] = useState(false)
  const [formattedData, setFormattedData] = useState([])
  const t = useTranslations()
  const { page = 0, pageSize = 10 } = paginationModel || {}
  const source = 'custom'
  const [data, setData] = useState({})
  const locale = useLocale()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const { permissions } = useUserPermissions()
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
      field: 'name',
      headerName: t('name'),
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: ({ row }) => renderEllipsisCell(row.name)
    },
    {
      field: 'type',
      headerName: t('type'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.strain)
    },

    {
      field: 'value',
      headerName: t('value'),
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => renderEllipsisCell(row.strain)
    }
  ]

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
        body: formattedData.map(f => ({ ...f, fieldName: f.fieldName.replace('2', '') }))
      }
      await productService.getProducts(payload).then(res => {
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

  useEffect(() => {
    if (page !== undefined && pageSize !== undefined) {
      // fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  return (
    <Box className='flex flex-col gap-4'>
      <PageHeader
        heading={t('productsMetadata')}
        breadcrumbs={[
          {
            label: t('products'),
            href: '/products'
          },
          {
            label: t('metadata')
          }
        ]}
        actions={[
          <>
            <CanView permission={PERMISSIONS.PRODUCT.BULK_UPLOAD_PRODUCTS}></CanView>
            <CanView permission={PERMISSIONS.PRODUCT.ADD}>
              <Link key='addProduct' href={getLocalizedURL(locale, `metadata/add?productId=${productId}`)} passHref>
                <Button variant='contained' color='primary'>
                  {t('addMetadata')}
                </Button>
              </Link>
            </CanView>
          </>
        ]}
      />

      <GridWrapper>
        <DataGrid
          autoHeight
          pagination
          getRowId={row => row.id}
          paginationMode='server'
          sortingMode='server'
          rows={data?.data?.content || []}
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
        />
      </GridWrapper>
    </Box>
  )
}

export default ProductsMetadataListView
