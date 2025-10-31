import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const cancellationInvoiceService = {
  createCancellationInvoice: data => coreAxiosInstance.post(`/creditNote/create`, data),
  getCancelInvoiceId: () => coreAxiosInstance.get(`/creditNote/generateUniqueCreditNoteId`),
  updateCancelInvoice: (id, data) => coreAxiosInstance.put(`/creditNote/update?invoiceId=${id}`, data)

  // getAllInvoices: (pageNo = 0, pageSize = 10, filters) => {
  //   const updatedFilters = filters.map(f => {
  //     if (f.fieldName === 'name' || f.fieldName === 'legalName') {
  //       return {
  //         fieldName: 'keyword',
  //         fieldValue: f.fieldValue,
  //         searchOperator: 'LIKE'
  //       }
  //     }
  //     return f
  //   })
  //   return coreAxiosInstance.post(`/invoice/getAllInvoices?page=${pageNo}&size=${pageSize}`, updatedFilters)
  // },
  // getPresentInvoices: (pageNo = 0, pageSize = 10, filters) => {
  //   const updatedFilters = filters.map(f => {
  //     if (f.fieldName === 'name' || f.fieldName === 'legalName') {
  //       return {
  //         fieldName: 'keyword',
  //         fieldValue: f.fieldValue,
  //         searchOperator: 'LIKE'
  //       }
  //     }
  //     return f
  //   })
  //   return coreAxiosInstance.post(`/sent-invoice/getAllInvoices?page=${pageNo}&size=${pageSize}`, updatedFilters)
  // },
}

export default cancellationInvoiceService
