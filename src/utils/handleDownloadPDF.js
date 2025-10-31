import { toast } from 'react-hot-toast'

const handleDownloadPDF = async (selector, filename = 'document.pdf', onComplete, isInvoice, t) => {
  const html2pdf = await require('html2pdf.js')
  const element = document.querySelector(selector)

  if (!element) {
    console.error('Element not found for selector:', selector)
    toast.error(t('elementNotFoundForPdf'))
    return
  }
  const originalDisplay = element?.style?.display
  element.style.display = 'block'

  var opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: isInvoice ? 'Invoice.pdf' : 'Quote.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      scrollY: 0,
      ignoreElements: function (element) {
        return false
      }
    },
    jsPDF: { unit: 'in', format: [9, 12], orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }

  // Show a toast promise for better user experience
  const downloadPromise = new Promise((resolve, reject) => {
    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then(pdf => {
        const totalPages = pdf.internal.getNumberOfPages()
        const pageHeight = pdf.internal.pageSize.getHeight()

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.setTextColor(128)
          pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() / 2, pageHeight - 0.5, {
            align: 'center'
          })
        }
      })
      .save()
      .then(() => {
        resolve(t('pdfDownloadCompleted'))
        if (onComplete) onComplete() // Execute callback after download
      })
      .catch(error => {
        reject('Error generating PDF')
        console.error('Error generating PDF:', error)
      })
      .finally(() => {
        element.style.display = originalDisplay // Restore original display state
      })
  })

  toast.promise(downloadPromise, {
    loading: t('generatingPdf'),
    success: t('pdfDownloadedSuccessfully')
  })
}

export default handleDownloadPDF
