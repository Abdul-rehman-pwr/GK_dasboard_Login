import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const invoiceService = {
  updateInvoice: (id, data) => coreAxiosInstance.put(`/invoice/update?invoiceId=${id}`, data),
  getAllInvoices: (pageNo = 0, pageSize = 10, filters) => {
    const updatedFilters = filters.map(f => {
      if (f.fieldName === 'name' || f.fieldName === 'legalName') {
        return {
          fieldName: 'keyword',
          fieldValue: f.fieldValue,
          searchOperator: 'LIKE'
        }
      }
      return f
    })
    return coreAxiosInstance.post(`/invoice/getAllInvoices?page=${pageNo}&size=${pageSize}`, updatedFilters)
  },
  getPresentInvoices: (pageNo = 0, pageSize = 10, filters) => {
    const updatedFilters = filters.map(f => {
      if (f.fieldName === 'name' || f.fieldName === 'legalName') {
        return {
          fieldName: 'keyword',
          fieldValue: f.fieldValue,
          searchOperator: 'LIKE'
        }
      }
      return f
    })
    return coreAxiosInstance.post(`/sent-invoice/getAllInvoices?page=${pageNo}&size=${pageSize}`, updatedFilters)
  },
  getRecurringInvoices: (pageNo = 0, pageSize = 10, filters) => {
    const updatedFilters = filters.map(f => {
      if (f.fieldName === 'name' || f.fieldName === 'legalName') {
        return {
          fieldName: 'keyword',
          fieldValue: f.fieldValue,
          searchOperator: 'LIKE'
        }
      }
      return f
    })
    return coreAxiosInstance.post(
      `/recurringInvoice/getAll?page=${pageNo}&size=${pageSize}&sort=invoiceId,desc`,
      updatedFilters
    )
  },
  getInvoiceId: () => coreAxiosInstance.get(`/invoice/generateUniqueInvoiceId`),
  addInvoice: data => coreAxiosInstance.post(`/invoice/create`, data),
  getByInvoiceId: (id, invocieUserType) =>
    coreAxiosInstance.get(`/invoice/getByInvoiceId?invoiceId=${id}&userInvoiceType=${invocieUserType}`),
  getBySentInvoiceId: (id, invocieUserType) => coreAxiosInstance.get(`/sent-invoice/getByInvoiceId?invoiceId=${id}`),
  deleteInvoice: (id, invocieUserType) =>
    coreAxiosInstance.delete(`/invoice/delete?invoiceId=${id}&userInvoiceType=${invocieUserType}`),
  lockInvoice: id => coreAxiosInstance.get(`/sent-invoice/lockInvoiceById?invoiceId=${id}`),
  updateInvoiceStatus: (data, userInvoiceType) =>
    coreAxiosInstance.put(`/invoice/updateInvoiceStatus?userInvoiceType=${userInvoiceType}`, data),
  deleteRecurrenceInvoice: id => coreAxiosInstance.delete(`/recurringInvoice/delete?recurringInvoiceId=${id}`),
  pauseOrResumeRecurringInvoice: (id, isPaused, recurringId) =>
    coreAxiosInstance.put(
      `/recurringInvoice/pauseOrResume?invoiceId=${id}&isPaused=${isPaused}&recurringId=${recurringId}`
    ),
  getRecurringInvoiceById: id =>
    coreAxiosInstance.get(`/recurringInvoice/getById?recurringConfigurationId=${id}&userInvoiceType=INVOICE`),
  updateRecurrenceInvoiceSettings: (id, body) =>
    coreAxiosInstance.put(`/recurringInvoice/update?recurringInvoiceId=${id}`, body),
  // sendEmail: (invoiceId, email, invoiceFileLink) =>
  //   coreAxiosInstance.post(`/invoice/sendEmail?email=${email}&invoiceId=${invoiceId}`, { fileUrl: invoiceFileLink }),

  sendEmail: (payload, userInvoiceType, isSentTestEmail) =>
    coreAxiosInstance.post(
      `/invoice/sentInvoice?userInvoiceType=${userInvoiceType}&isSentTestEmail=${isSentTestEmail}`,
      payload
    ),

  generateXML: (invoiceId, userInvoiceType) =>
    coreAxiosInstance.get(`/invoice/generate-xml?invoiceId=${invoiceId}&userInvoiceType=${userInvoiceType}`, {
      responseType: 'blob'
    })
}

export default invoiceService
