import invoiceService from '@/services/invoiceService'
import toast from 'react-hot-toast'

export const handleGenerateXML = async (id, isCancellation) => {
  try {
    const result = await invoiceService.generateXML(id, isCancellation)
    if (result) {
      const blob = new Blob([result.data], { type: 'application/xml' })
      const file = new File([blob], `Invoice-${id}.xml`, { type: 'application/xml' })

      return file
    }
  } catch (error) {
    console.error('Error generating XML:', error)
    toast.error('Failed to generate XML')
  }
}
