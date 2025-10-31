'use client'
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import { formatDateTime } from '@/@core/utils/format'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { Icon } from '@iconify/react'
import { useLocale, useTranslations } from 'next-intl'
import getLocalizedURL from '@/utils/getLocalizedUrl'
import orderService from '@/services/orderService'
import LoadingFallback from '@/components/shared/loading'
import { isAdminUser } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import Filters from '@/components/filters'
import PageHeader from '@/components/shared/page-header'

const getInitials = name =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

const invoiceStatusObj = {
  // General invoice statuses
  PENDING: { color: 'warning', icon: 'bx:timer' },
  REJECTED: { color: 'error', icon: 'bx:x-circle' },
  APPROVED_NOT_SIGNED: { color: 'info', icon: 'bx:check-circle' },
  SIGNED: { color: 'success', icon: 'material-symbols:draw' },
  DELIVERY_PENDING: { color: 'info', icon: 'bx:timer' },
  DELIVERY_INITIATED: { color: 'primary', icon: 'material-symbols:local-shipping' },
  MARKED_FOR_DELIVERY: { color: 'secondary', icon: 'bx:bookmark' },

  // Leiferando delivery-related statuses (suggested mappings)
  COURIERJOBSTATUS: { color: 'info', icon: 'material-symbols:assignment' },
  CANCELJOBSTATUS: { color: 'error', icon: 'material-symbols:cancel' },
  COURIERCOLLECTIONTIME: { color: 'primary', icon: 'material-symbols:assignment' },
  DELIVERYCREATED: { color: 'info', icon: 'material-symbols:create-new-folder' },
  COURIERLOCATION: { color: 'info', icon: 'material-symbols:location-on' },
  DELIVERYREJECTED: { color: 'error', icon: 'bx:x' },
  COURIERDELIVERYTIME: { color: 'info', icon: 'material-symbols:assignment' },
  PROOFOFDELIVERY: { color: 'info', icon: 'material-symbols:check-box' },
  PROOFOFDELIVERY_PICTURE: { color: 'info', icon: 'material-symbols:image' },

  // uber direct related statuses
  PICKUP: { color: 'primary', icon: 'material-symbols:storefront' },
  PICKUP_COMPLETE: { color: 'success', icon: 'material-symbols:done-all' },
  DROPOFF: { color: 'info', icon: 'material-symbols:outbox' },
  DELIVERED: { color: 'success', icon: 'material-symbols:check-circle' },
  CANCELED: { color: 'error', icon: 'material-symbols:cancel' },
  RETURNED: { color: 'warning', icon: 'material-symbols:undo' },
  SHOPPING_COMPLETED: { color: 'success', icon: 'material-symbols:shopping-cart-checkout' }
}

const renderClient = row => (
  <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}>
    {getInitials(row.client)}
  </CustomAvatar>
)

// THIS CAN BE MODIFIED LATER TO INCLUDE FURTHER INFO FOR COUPON
const formatCouponInfo = ({ name }) => {
  if (!name) {
    return 'N/A'
  }
  return name
}

const EllipsisTypography = ({ children, sx = {} }) => (
  <Typography
    sx={{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block',
      ...sx
    }}
  >
    {children}
  </Typography>
)
export const RenderTime = ({ time }) => {
  const { formattedDate, formattedTime } = formatDateTime(time)
  return (
    <Box className='py-2 pb-2'>
      {time ? (
        <>
          <EllipsisTypography sx={{ color: 'text.secondary' }}>{formattedDate}</EllipsisTypography>
          <EllipsisTypography sx={{ color: 'text.secondary' }}>{formattedTime}</EllipsisTypography>
        </>
      ) : (
        <EllipsisTypography>N/A</EllipsisTypography>
      )}
    </Box>
  )
}

const OrderList = () => {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const t = useTranslations()
  const [totalElements, setTotalElements] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sortModel, setSortModel] = useState([])
  const DEFAULT_SORT = 'id,desc'
  const [sorters, setSorters] = useState([DEFAULT_SORT])
  const { formatPrice } = useFormattedPrice()
  const { page = 0, pageSize = 10 } = paginationModel || {}
  const [formattedData, setFormattedData] = useState([])

  useEffect(() => {
    setIsAdmin(isAdminUser())
  }, [])
  const generateOrderStatusFilterOptions = () => {
    const basicStatuses = ['PENDING', 'APPROVED_NOT_SIGNED', 'SIGNED', 'REJECTED']

    const allStatuses = [
      ...basicStatuses,
      'DELIVERY_PENDING',
      'DELIVERY_INITIATED',
      'MARKED_FOR_DELIVERY',
      'COURIERJOBSTATUS',
      'CANCELJOBSTATUS',
      'COURIERCOLLECTIONTIME',
      'DELIVERYCREATED',
      'COURIERLOCATION',
      'DELIVERYREJECTED',
      'COURIERDELIVERYTIME',
      'PROOFOFDELIVERY',
      'PROOFOFDELIVERY_PICTURE',

      // UBER DIRECT RELATED STATUSES
      'PICKUP',
      'PICKUP_COMPLETE',
      'DROPOFF',
      'DELIVERED',
      'CANCELED',
      'RETURNED',
      'SHOPPING_COMPLETED'
    ]

    const renderOptions = statuses =>
      statuses.map(status => (
        <MenuItem key={status} value={status}>
          {t(status.toLowerCase())}
        </MenuItem>
      ))

    return isAdmin ? renderOptions(allStatuses) : renderOptions(basicStatuses)
  }
  const defaultColumns = [
    {
      field: 'id',
      minWidth: 20,
      headerName: t('Order ID'),
      sortable: true,
      filterable: false,
      renderCell: ({ row }) => <EllipsisTypography sx={{ pt: 4, textAlign: 'center' }}>{row.id}</EllipsisTypography>
    },
    {
      flex: 0.1,
      field: 'patientName',
      minWidth: 250,
      headerName: t('Client'),
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, gap: 2, width: '100%' }}>
          {renderClient(row)}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <EllipsisTypography sx={{ fontWeight: 600, color: 'text.secondary' }}>{row.client}</EllipsisTypography>
            <EllipsisTypography variant='caption' sx={{ color: 'text.disabled' }}>
              {row.clientEmail}
            </EllipsisTypography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: t('Status'),
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const status = invoiceStatusObj[row?.status] ?? invoiceStatusObj['PENDING']
        return (
          <Box sx={{ pt: 2, width: '100%', overflow: 'hidden' }}>
            <Tooltip title={t(row.status.toLowerCase() ?? 'pending')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CustomAvatar skin='light' color={status.color} sx={{ width: 30, height: 30 }}>
                  <Icon fontSize='1rem' icon={status.icon} />
                </CustomAvatar>
              </Box>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 125,
      field: 'noOfProducts',
      headerName: t('No of products'),
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <EllipsisTypography sx={{ color: 'text.secondary', pt: 4, textAlign: 'center' }}>
          {row.noOfProducts}
        </EllipsisTypography>
      )
    },
    isAdmin && {
      flex: 0.1,
      minWidth: 100,
      field: 'getKongPlatformFee',
      sortable: false,
      filterable: false,
      headerName: t('getKongPlatformFee'),
      renderCell: ({ row }) => (
        <EllipsisTypography sx={{ color: 'text.secondary', pt: 2 }}>
          {`€ ${formatPrice(row.getKongPlatformFee)}`}
        </EllipsisTypography>
      )
    },
    isAdmin && {
      flex: 0.1,
      minWidth: 120,
      field: 'pharmacyCut',
      sortable: false,
      filterable: false,
      headerName: t('pharmacyCut'),
      renderCell: ({ row }) => (
        <EllipsisTypography sx={{ color: 'text.secondary', pt: 2 }}>
          {`€ ${formatPrice(row.pharmacyCut)}`}
        </EllipsisTypography>
      )
    },
    isAdmin && {
      flex: 0.1,
      minWidth: 150,
      field: 'coupon',
      sortable: false,
      filterable: false,
      headerName: t('coupon'),
      renderCell: ({ row }) => (
        <EllipsisTypography sx={{ color: 'text.secondary', pt: 2 }}>
          {formatCouponInfo({ name: row.couponName })}
        </EllipsisTypography>
      )
    },
    isAdmin && {
      flex: 0.1,
      minWidth: 120,
      field: 'total',
      sortable: false,
      filterable: false,
      headerName: t('Bill Amount'),
      renderCell: ({ row }) => (
        <EllipsisTypography sx={{ color: 'text.secondary', pt: 2 }}>
          {`€ ${formatPrice(row.billAmount.toFixed(2))}`}
        </EllipsisTypography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      filterable: false,
      field: 'paymentMethod',
      headerName: t('paymentMethod'),
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return <EllipsisTypography sx={{ textTransform: 'capitalize', pt: 2 }}>{row.paymentMethod}</EllipsisTypography>
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      filterable: false,
      field: 'approvedAt',
      headerName: t('approvedAt'),
      renderCell: ({ row }) => {
        return <RenderTime time={row.approvedAt} />
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'approvedBy',
      sortable: false,
      filterable: false,
      headerName: t('approvedBy'),
      renderCell: ({ row }) => {
        return (
          <EllipsisTypography sx={{ color: 'text.secondary', pt: 2 }}>{row.approvedBy || 'N/A'}</EllipsisTypography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'createdDate',
      filterable: false,
      headerName: t('Created at'),
      renderCell: ({ row }) => {
        return <RenderTime time={row.createdAt} />
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'updatedAt',
      sortable: false,
      filterable: false,
      headerName: t('Updated at'),
      renderCell: ({ row }) => {
        return <RenderTime time={row.updatedAt} />
      }
    }
  ].filter(Boolean)
  const FIELDS = [
    {
      label: t('Order Status'),
      type: 'autocomplete',
      name: 'doctorApprovalStatus',
      nullable: true,
      searchOperator: 'EQUAL',
      options: generateOrderStatusFilterOptions().map(option => ({
        label: option.props.children,
        value: option.key
      }))
    },
    {
      label: t('Created Date'),
      type: 'date-range',
      name: 'createdDate',
      filterable: false,
      nullable: true,
      searchOperator: ['GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL']
    }
  ]
  const generateOrderRows = orders => {
    return orders.map(order => {
      return {
        id: order?.id,
        client: `${order?.customerAddress?.firstName} ${order?.customerAddress?.lastName}` ?? 'Doctor',
        clientEmail: order?.customerAddress?.email,
        status: order?.doctorApprovalStatus ?? 'PENDING',
        billAmount: order?.billing?.total,
        getKongPlatformFee: order?.billing?.getKongPlatformFee,
        pharmacyCut: order?.billing?.pharmacyCut,
        noOfProducts: order?.products?.length,
        createdAt: order?.createdDate,
        updatedAt: order?.lastModifiedDate,
        approvedAt: order?.approvedAt,
        approvedBy: order?.approvedBy,
        paymentMethod: order?.paymentDetails?.method,
        couponCode: order?.couponCode,
        couponName: order?.couponName,
        couponType: order?.couponType
      }
    })
  }

  useEffect(() => {
    const getAllOrders = async (values = []) => {
      try {
        setLoading(true)

        const payload = {
          page,
          size: pageSize,
          filters: values.map(v => ({
            ...v,
            fieldName: v.fieldName?.replace('2', '')
          })),
          sort: sorters
        }

        const response = await orderService.getAllOrders(payload)

        if (response?.status == 200) {
          const ordersData = response?.data?.data?.content ?? []
          setTotalElements(response?.data?.data?.totalElements ?? 0)
          setOrders(generateOrderRows(ordersData))
        } else {
          setOrders([])
        }
      } catch (error) {
        console.error(error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    getAllOrders(formattedData)
  }, [page, pageSize, sorters, formattedData])

  const handleRowClick = params => {
    const { id } = params?.row
    router.push(getLocalizedURL(locale, `orders/preview?id=${id}`))
  }

  const handleSortModelChange = newModel => {
    setSortModel(newModel)
    const userSorters = newModel.map(({ field, sort }) => `${field},${sort}`)
    const updatedSorters = [...userSorters.filter(s => s !== DEFAULT_SORT), DEFAULT_SORT]
    setSorters(updatedSorters)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
  }

  const onSubmit = async data => {
    setFormattedData(data.values || [])
    setPaginationModel(prev => ({ ...prev, page: 0 }))
  }

  const handleChangePaginationModel = data => {
    let updatedData = { ...data }
    if (updatedData.pageSize != paginationModel.pageSize) {
      updatedData.page = 0
    }
    setPaginationModel({ ...updatedData })
  }

  return (
    <DatePickerWrapper>
      <PageHeader
        heading={t('Orders')}
        breadcrumbs={[
          {
            label: t('home'),
            href: '/'
          },
          {
            label: t('Orders')
          }
        ]}
      />
      <div className='pb-3'>
        <Filters
          key='order-filters'
          loading={loading}
          submit={data => onSubmit(data)}
          dataPassToAPI={{
            page: 0,
            size: pageSize
          }}
          fields={FIELDS}
        />
      </div>
      <Grid container spacing={6}>
        {loading ? (
          <Grid item xs={12}>
            <LoadingFallback />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 6 }}>
              <DataGrid
                autoHeight
                pagination
                paginationMode='server'
                sortingMode='server'
                onSortModelChange={handleSortModelChange}
                sortModel={sortModel}
                rows={orders}
                columns={[...defaultColumns]}
                disableRowSelectionOnClick
                rowCount={totalElements}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={handleChangePaginationModel}
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
                isCellFocusable={() => false}
                disableCellSelection={true}
                onRowClick={handleRowClick}
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
            </Card>
          </Grid>
        )}
      </Grid>
    </DatePickerWrapper>
  )
}

export default OrderList
