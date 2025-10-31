'use client'

import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { formatDateTime } from '@/@core/utils/format'

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 40,
    lineHeight: 1.5,
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  logoContainer: {
    alignItems: 'left',
    marginBottom: 20
  },
  logo: {
    width: 120
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  leftInfo: {
    width: '48%'
  },
  rightInfo: {
    width: '48%',
    textAlign: 'right'
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left'
  },
  table: {
    display: 'table',
    width: 'auto',
    border: '1 solid #ccc',
    borderRadius: 4
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #eee',
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  columnItem: { width: '40%' },
  columnQty: { width: '20%' },
  columnPrice: { width: '40%' },
  billingBreakdown: {
    alignItems: 'flex-end',
    gap: 2
  },
  billingText: {
    fontSize: 11
  },
  info: {
    marginTop: 16,
    marginBottom: 16
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 6
  },
  footerNote: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'left',
    color: '#333'
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 2
  },
  billingLabel: {
    fontSize: 11,
    width: '50%',
    fontWeight: 'normal'
  },
  billingValue: {
    fontSize: 11,
    width: '50%',
    textAlign: 'right'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 4,
    marginTop: 8,
    borderTop: '1 solid #ccc'
  },
  totalLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '50%'
  },
  totalValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    width: '50%'
  }
})

// Helper function for formatting
const formatEuro = amount => {
  if (typeof amount !== 'number') return '0,00'
  return `${amount.toFixed(2).replace('.', ',')}`
}

// PDF Component
export const InvoicePDF = ({
  customerAddress,
  products,
  orderId,
  billing,
  pharmacyName,
  pharmacyStreet,
  pharmacyCity,
  pharmacyPlz,
  orderDetail,
  pharmacyVatId = '',
  customerDateOfBirth,
  couponName,
  discount
}) => {
  const getKongLogoSrc =
    'https://cdn.prod.website-files.com/682d91a374443b922e44b293/68405da6de445d551be98eaf_6840337f1d503fea2fca2b5b_GETKONG_v_final%20(2).png'

  const { formattedDate } = formatDateTime(orderDetail?.createdDate)
  const nettoSumme = billing?.subtotal / 1.19
  const taxInPercent = billing?.subtotal - nettoSumme

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image src={getKongLogoSrc} style={styles.logo} />
        </View>
        {/* Patient & Pharmacy Info */}
        <View style={styles.infoRow}>
          <View style={styles.leftInfo}>
            <Text>{`${customerAddress?.firstName} ${customerAddress?.lastName}`}</Text>
            <Text>{customerAddress?.street}</Text>
            <Text>
              {customerAddress?.postalCode} {customerAddress?.city}
            </Text>
          </View>
          <View style={styles.rightInfo}>
            <Text>{pharmacyName}</Text>
            <Text>{pharmacyStreet}</Text>
            <Text>
              {pharmacyPlz} {pharmacyCity}
            </Text>
            {pharmacyVatId && <Text>Ust-IdNr. {pharmacyVatId}</Text>}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.leftInfo}></View>
          <View style={styles.rightInfo}>
            <Text>{formattedDate}</Text>
          </View>
        </View>

        {/* Invoice Number */}
        <Text style={styles.invoiceNumber}>Rechnung</Text>
        <Text>NR: {`ORD-${orderId}`}</Text>
        <Text>
          Patient: {`${customerAddress?.lastName} ${customerAddress?.firstName}`}{' '}
          {customerDateOfBirth && `(${customerDateOfBirth})`}
        </Text>

        <Text style={styles.info}>Aufgefuhrte Preise sind in EUR</Text>

        {/* Product Table */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.columnItem}>Produkt</Text>
              <Text style={styles.columnQty}>Menge in g</Text>
              <Text style={styles.columnPrice}>Gesamtpreis (inkl. 19% MwSt.)</Text>
            </View>
            {products.map((item, i) => {
              const quantityInGrams = item.quantity
              const totalPrice = item.price * quantityInGrams

              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.columnItem}>{item.name}</Text>
                  <Text style={styles.columnQty}>{quantityInGrams}</Text>
                  <Text style={styles.columnPrice}>{formatEuro(totalPrice)}</Text>
                </View>
              )
            })}
          </View>
        </View>
        {/* Billing Breakdown */}
        <View style={styles.infoRow}>
          <View style={styles.leftInfo}></View>
          <View style={styles.rightInfo}>
            <View style={styles.section}>
              <View style={styles.billingBreakdown}>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Nettosumme:</Text>
                  <Text style={styles.billingValue}>{formatEuro(nettoSumme)}</Text>
                </View>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>MwST.-Satz:</Text>
                  <Text style={styles.billingValue}>19%</Text>
                </View>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>MwST.-Betrag:</Text>
                  <Text style={styles.billingValue}>{formatEuro(taxInPercent)}</Text>
                </View>
                {couponName && (
                  <View style={styles.billingRow}>
                    <Text style={styles.billingLabel}>Gutschein:</Text>
                    <Text style={styles.billingValue}>{couponName}</Text>
                  </View>
                )}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabelText}>Gesamtbetrag:</Text>
                  <Text style={styles.totalValueText}>{formatEuro(billing?.total)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          Der Rechnungsbetrag wurde bereits per Online-Zahlung beglichen. Vielen Dank für Ihren Auftrag.
        </Text>
      </Page>
    </Document>
  )
}
