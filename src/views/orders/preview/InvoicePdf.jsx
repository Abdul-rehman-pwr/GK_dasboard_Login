'use client'

import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useAuth } from '@/@core/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { InvoicePDF } from './invoice'
import { PrescriptionPDF } from './prescription'
import { formatToGermanDate } from '@/utils/germanDate'

export default function PDFExample({ orderDetail, customerDateOfBirth = '1980-01-01' }) {
  const searchParams = useSearchParams()
  const auth = useAuth()

  const { id, customerAddress, products = [], billing } = orderDetail
  const doctorName = `${auth?.user?.firstName ?? 'Doctor'} ${auth?.user?.lastName ?? ''}`
  const orderIdRaw = searchParams.get('id')
  const orderId = orderIdRaw.toString().padStart(3, '0')
  const timestamp = Date.now()
  const fileName = `Invoice-${orderId}-${timestamp}.pdf`
  const userData = JSON.parse(localStorage.getItem('userData'))

  const doctorAddress = {
    address: userData?.address ?? 'Musterstraße 1',
    postalCode: userData?.postalCode ?? '10115',
    dateOfBirth: customerDateOfBirth ? formatToGermanDate(customerDateOfBirth) : '01.01.1980',
    city: userData?.city ?? 'Berlin',
    phone: userData?.phone ?? '+49 30 12345678'
  }

  const orderData = {
    orderId,
    doctorName,
    products,
    customerAddress,
    billing,
    doctorAddress
  }

  return (
    <div sx={{ width: '100%' }}>
      <PDFDownloadLink
        document={
          <PrescriptionPDF
            orderId={orderData.orderId}
            customerAddress={orderData.customerAddress}
            products={orderData.products}
            doctorName={doctorName}
            doctorAddress={doctorAddress}
            billing={orderData.billing}
            orderDetail={orderDetail}
            pharmacyName={orderData.products[0]?.pharmacyName}
            pharmacyStreet={orderData.products[0]?.pharmacyStreet}
            pharmacyCity={orderData.products[0]?.pharmacyCity}
            pharmacyPlz={orderData.products[0]?.pharmacyPlz}
            pharmacyVatId={orderData.products[0]?.vatId}
            customerDateOfBirth={customerDateOfBirth ? formatToGermanDate(customerDateOfBirth) : '01.01.1980'}
          />
        }
        fileName={fileName}
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#1976d2',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download ')}
      </PDFDownloadLink>
    </div>
  )
}
