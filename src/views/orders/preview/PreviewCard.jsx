'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import Logo from '@components/layout/shared/Logo'

import tableStyles from '@core/styles/table.module.css'

import { useTranslations } from 'next-intl'
import BackIconButton from '@/components/shared/back-icon-button'
import { Chip } from '@mui/material'
import { formatDateTime } from '@/@core/utils/format'
import { useFormattedPrice } from '@/hooks/useFormattedPrice'
import CanView from '@/@core/components/can/can-view'
import { PERMISSIONS } from '@/utils/permissions'

const getStatusColor = status => {
  if (!status) return 'default'

  switch (status.toLowerCase()) {
    // ✅ Success statuses
    case 'signed':
    case 'pickup_complete':
    case 'delivered':
    case 'shopping_completed':
      return 'success'

    // ⚠️ Warning statuses
    case 'pending':
    case 'delivery_pending':
    case 'returned':
      return 'warning'

    // ❌ Error statuses
    case 'rejected':
    case 'canceled':
      return 'error'

    // 🔵 Primary statuses
    case 'delivery_initiated':
    case 'pickup':
      return 'primary'

    // 🟣 Secondary statuses
    case 'marked_for_delivery':
      return 'secondary'

    // 🧊 Informational statuses
    case 'approved_not_signed':
    case 'courierjobstatus':
    case 'canceljobstatus':
    case 'couriercollectiontime':
    case 'deliverycreated':
    case 'courierlocation':
    case 'deliveryrejected':
    case 'courierdeliverytime':
    case 'proofofdelivery':
    case 'proofofdelivery_picture':
    case 'dropoff':
      return 'info'

    // 💤 Default fallback
    default:
      return 'default'
  }
}

const PreviewCard = ({ id, orderDetail, loading }) => {
  const t = useTranslations()
  const { formatPrice } = useFormattedPrice()

  if (loading || !orderDetail) return null

  const { customerAddress, products = [], billing, deliveryMethod, didFallBackToDhl } = orderDetail

  const subtotal = billing?.subtotal ?? 0
  const doctorFee = billing?.doctorFee ?? 0
  const deliveryAmount = billing?.deliveryAmount ?? 0
  const total = billing?.total ?? 0

  const { formattedDate } = formatDateTime(orderDetail?.createdDate)

  return (
    <Card className='previewCard rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-100 pb-5'>
      <CardContent className='sm:!p-6 '>
        <Grid container justifyContent='center' spacing={6}>
          {/* Header */}
          <Grid item xs={11} className='mt-6 pb-6 bg-actionHover rounded'>
            <Grid container spacing={6} alignItems='flex-start'>
              {/* Logo + Address */}
              <Grid item xs={12} sm={6} lg={5} xl={7} className='flex flex-col gap-6 flex-1'>
                <div className='flex items-center gap-2.5'>
                  <Logo />
                </div>
                <div>
                  <Typography color='text.primary'>{customerAddress?.street} </Typography>
                  <Typography color='text.primary'>
                    {customerAddress?.postalCode} {customerAddress?.city}
                  </Typography>
                  <Typography color='text.primary'>{customerAddress?.country}</Typography>
                </div>
              </Grid>

              {/* Order Info */}
              <Grid item xs={12} sm={6} lg={7} xl={5}>
                <div className='flex flex-col gap-4'>
                  <Typography variant='h5'>{`${t('order')} #${id}`}</Typography>
                  <div className='flex flex-col gap-1 text-sm'>
                    {/* Date Issued */}
                    <div className='flex items-center gap-2'>
                      <Typography className='md:min-w-[150px] text-gray-700'>{t('Date Issued')}:</Typography>
                      <Typography className='text-gray-900 font-medium'>{formattedDate}</Typography>
                    </div>

                    {/* Status */}
                    <div className='flex items-center gap-2'>
                      <Typography className='md:min-w-[150px] text-gray-700'>{t('Status')}:</Typography>
                      <Chip
                        label={t(orderDetail?.doctorApprovalStatus?.toLowerCase() ?? 'pending')}
                        color={getStatusColor(orderDetail?.doctorApprovalStatus)}
                        size='small'
                        sx={{ fontWeight: 'bold' }}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={11}>
            <Grid container spacing={6}>
              {/* Customer Info */}
              <Grid item xs={12} sm={6} lg={5} xl={7}>
                <div className='flex flex-col gap-4 h-full'>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    {t('Customer Information')}:
                  </Typography>
                  <div className='space-y-1'>
                    <Typography>{`${customerAddress?.firstName} ${customerAddress?.lastName}`}</Typography>
                    <Typography>{customerAddress?.phone}</Typography>
                    <Typography>{customerAddress?.email}</Typography>
                  </div>
                </div>
              </Grid>

              {/* Delivery Info */}

              <CanView permission={PERMISSIONS.ORDER.DELIVER_INFO}>
                <Grid item xs={12} sm={6} lg={7} xl={4}>
                  <div className='flex flex-col gap-4 h-full'>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                      {t('Delivery Information')}:
                    </Typography>
                    <div className='space-y-2'>
                      <div className='flex items-start gap-4'>
                        <Typography className='min-w-[140px] text-gray-700'>{t('Total Amount')}:</Typography>
                        <Typography>€ {formatPrice(total)}</Typography>
                      </div>
                      <div className='flex items-start gap-4'>
                        <Typography className='min-w-[140px] text-gray-700'>{t('Delivery Method')}:</Typography>
                        <Typography>{didFallBackToDhl ? t('DHL-Versand') : deliveryMethod?.method}</Typography>
                      </div>
                    </div>
                  </div>
                </Grid>
              </CanView>
            </Grid>
          </Grid>

          {/* Product Table */}
          <Grid item xs={11}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead className='border-bs-0'>
                  <tr>
                    <th className='!bg-transparent'>{t('Item')}</th>
                    <th className='!bg-transparent'>{t('Pharmacy')}</th>
                    <CanView permission={PERMISSIONS.ORDER.ORDER_DETAILS_PRICE}>
                      <th className='!bg-transparent'>{t('Price')}</th>
                    </CanView>
                    <th className='!bg-transparent'>{t('Qty')}</th>
                    <CanView permission={PERMISSIONS.ORDER.ORDER_DETAILS_TOTAL}>
                      <th className='!bg-transparent'>{t('Total')}</th>
                    </CanView>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Typography color='text.primary'>{item.name}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.pharmacyName}</Typography>
                      </td>
                      <CanView permission={PERMISSIONS.ORDER.ORDER_DETAILS_PRICE}>
                        <td>
                          <Typography color='text.primary'>€ {formatPrice(item.price)}</Typography>
                        </td>
                      </CanView>
                      <td>
                        <Typography color='text.primary'>{`${item.quantity}g`}</Typography>
                      </td>
                      <CanView permission={PERMISSIONS.ORDER.ORDER_DETAILS_TOTAL}>
                        <td>
                          <Typography color='text.primary'>€ {formatPrice(item.price * item.quantity)}</Typography>
                        </td>
                      </CanView>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>

          {/* Footer Totals */}
          <CanView permission={PERMISSIONS.ORDER.FOOTER_TOTAL}>
            <Grid item xs={11}>
              <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
                <div className='flex flex-col gap-1 order-2 sm:order-[unset]'></div>
                <div className='min-is-[300px] grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <Typography>{t('Subtotal')}:</Typography>
                    <Typography variant='h6'>€ {formatPrice(subtotal)}</Typography>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Typography>{t('Delivery Amount')}:</Typography>
                    <Typography variant='h6'>€ {formatPrice(deliveryAmount)}</Typography>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Typography>{t('onlineServiceFee')}:</Typography>
                    <Typography variant='h6'>€ {formatPrice(doctorFee)}</Typography>
                  </div>

                  {Boolean(orderDetail?.couponName) && (
                    <div className='flex items-center justify-between'>
                      <Typography>{t('coupon')}:</Typography>
                      <Typography variant='h6'>{orderDetail?.couponName || 'N/A'}</Typography>
                    </div>
                  )}

                  <Divider className='mlb-2' />
                  <div className='flex items-center justify-between'>
                    <Typography>{t('Total')}:</Typography>
                    <Typography variant='h6'>€ {formatPrice(total)}</Typography>
                  </div>
                </div>
              </div>
            </Grid>
          </CanView>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
