'use client'

import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 50,
    lineHeight: 1.5,
    backgroundColor: '#ffffff'
  },
  letterhead: {
    marginBottom: 25
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold'
  },
  table: {
    display: 'table',
    width: 'auto',
    borderRadius: 4
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  basic: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 10,
    textAlign: 'center',
    color: '#aaa'
  }
})

// PDF Component
export const PrescriptionPDF = ({
  doctorName,
  customerAddress,
  products,
  orderId,
  doctorAddress,
  customerDateOfBirth
}) => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Letterhead */}
        <View style={styles.letterhead}>
          <Image
            src={
              'https://cdn.prod.website-files.com/682d91a374443b922e44b293/68405da6de445d551be98eaf_6840337f1d503fea2fca2b5b_GETKONG_v_final%20(2).png'
            }
            style={{ width: 100, marginBottom: 8 }}
          />
          <Text
            style={styles.title}
          >{`${customerAddress?.street}, ${customerAddress?.postalCode} ${customerAddress?.city}`}</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.section}>
          <View style={styles.basic}>
            <Text>
              <Text style={styles.label}>Rezeptnummer:</Text> {orderId}
            </Text>
            <Text>
              <Text style={styles.label}>Arzt:</Text> {doctorName}
            </Text>
            <Text>
              {!doctorAddress?.address && <Text>Adresse: </Text>}
              {doctorAddress?.address || 'k. A.'}
            </Text>

            <Text>
              {!doctorAddress?.city && <Text>Stadt: </Text>}
              {doctorAddress?.city || 'k. A.'}
            </Text>

            <Text>
              {!doctorAddress?.postalCode && <Text>Postleitzahl: </Text>}
              {doctorAddress?.postalCode || 'k. A.'}
            </Text>
            {/* commentnted 09.10.25 based on GETKONG request  */}
            {/* <Text>
              {!doctorAddress?.phone && <Text>Telefon: </Text>}
              {doctorAddress?.phone || 'k. A.'}
            </Text> */}
          </View>
        </View>

        <View style={{ marginTop: 40, textAlign: 'left' }}>
          <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 5 }}>__________________________</Text>
          <Text style={styles.label}>Unterschrift</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={{ ...styles.label, marginBottom: 6, fontWeight: 'bold' }}>Patienteninformationen:</Text>
          <Text>{`${customerAddress?.firstName} ${customerAddress?.lastName}`}</Text>
          <Text>{customerAddress?.email}</Text>
          <Text>
            {!doctorAddress?.dateOfBirth && <Text>Geburtsdatum: </Text>}
            {customerDateOfBirth || 'k. A.'}
          </Text>
          <Text>{`${customerAddress?.street},${customerAddress?.postalCode} ${customerAddress?.city}`} </Text>
          <Text>{`${customerAddress?.phone}`} </Text>
        </View>

        {/* Product Table */}
        <View style={styles.section}>
          <View>
            {products.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text>
                  {`${i + 1}: ${item.quantity}g`} {item.name} unzerkleinert, verdampfen und inhalieren, bis zu 2x
                  täglich ED: 0.25g
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
