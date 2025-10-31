export const generatePDFBlob = async selector => {
  const html2pdfModule = await import('html2pdf.js')
  const html2pdf = html2pdfModule.default

  const element = document.querySelector(selector)

  if (!element) {
    console.error('Element not found for selector:', selector)
    toast.error(t('elementNotFoundForPdf'))
    return
  }

  var opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: 'invoice.pdf',
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

  try {
    const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob')

    // Convert Blob to File with proper filename and MIME type
    const pdfFile = new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' })
    return pdfFile
  } catch (error) {
    console.error('❌ Error generating PDF:', error)
    toast.error('An error occurred while generating the PDF.')
    return null
  }
}
