import { pdf } from '@react-pdf/renderer'
import { InvoicePDF } from './invoice'
import { formatToGermanDate } from '@/utils/germanDate'

export default function DownloadInvoiceButton({ orderDetail, customerDateOfBirth }) {
  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = (
        <InvoicePDF
          orderId={orderDetail?.id}
          customerAddress={orderDetail?.customerAddress}
          products={orderDetail?.products}
          billing={orderDetail?.billing}
          orderDetail={orderDetail}
          pharmacyName={orderDetail.products[0]?.pharmacyName}
          pharmacyStreet={orderDetail.products[0]?.pharmacyStreet}
          pharmacyCity={orderDetail.products[0]?.pharmacyCity}
          pharmacyPlz={orderDetail.products[0]?.pharmacyPlz}
          pharmacyVatId={orderDetail.products[0]?.vatId}
          customerDateOfBirth={customerDateOfBirth ? formatToGermanDate(customerDateOfBirth) : '01.01.1980'}
          couponName={orderDetail?.couponName}
          discount={orderDetail?.billing?.discount}
        />
      )

      // generate blob
      const blob = await pdf(pdfDoc).toBlob()

      // create a temporary download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderDetail.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <button onClick={handleDownloadPDF} className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'>
      Download Invoice
    </button>
  )
}
