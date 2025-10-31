import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const quoteService = {
  updateQuote: (id, data) => coreAxiosInstance.put(`/quote/update?quoteId=${id}`, data),
  getAllQuotes: (pageNo = 0, pageSize = 10, filters) => {
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

    return coreAxiosInstance.post(`/quote/getAllQuotes?page=${pageNo}&size=${pageSize}`, updatedFilters)
  },
  getQuoteId: () => coreAxiosInstance.get(`/quote/generateUniqueQuoteId`),
  addQuote: data => coreAxiosInstance.post(`/quote/create`, data),
  getByQuoteId: id => coreAxiosInstance.get(`/quote/getByQuoteId?quoteId=${id}`),
  deleteQuote: id => coreAxiosInstance.delete(`/quote/delete?quoteId=${id}`),
  convertQuoteToInvoice: id => coreAxiosInstance.post(`/quote/convertQuoteToInvoice?quoteId=${id}`),
  markQuoteAsApprovedOrRejected: (id, status) =>
    coreAxiosInstance.put(`/quote/markQuoteAsApprovedOrRejected?quoteId=${id}`, { quoteStatus: status }),
  // sendEmail: (email, quoteFileLink) =>
  //   coreAxiosInstance.post(`/quote/sendEmail?email=${email}`, { fileUrl: quoteFileLink })

  sendEmail: payload => coreAxiosInstance.post(`/quote/sendEmail`, payload)
}

export default quoteService
