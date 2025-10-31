import { coreAxiosInstance } from '@/utils/axios/axiosInstance'
import axios from 'axios'

const pharmacyServices = {
  getPharmacies: async payload => {
    const { size = '', page = '', values: body = [], sort = [], source } = payload || {}
    const queryParams = new URLSearchParams()
    if (size) queryParams.append('size', size)
    if (page || page === 0) queryParams.append('page', page)
    if (source) queryParams.append('source', source)
    const response = await coreAxiosInstance.post(
      `/pharmacy/getAll?${queryParams.toString()}&sort=${sort.join('&sort=')}`,
      body
    )
    return response.data
  },
  getWorkingHours: async payload => {
    const { pharmacyId = '', source = 'custom' } = payload || {}
    const queryParams = new URLSearchParams()
    if (pharmacyId) queryParams.append('pharmacyId', pharmacyId)
    queryParams.append('source', source)
    const response = await coreAxiosInstance.get(`/pharmacy/getPharmacyTimingById?${queryParams.toString()}`)
    return response.data
  },
  getPharmacyById: async (id, source = 'custom') => {
    const response = await coreAxiosInstance.get(`/pharmacy/getById?pharmacyId=${id}&source=${source}`)
    return response.data
  },
  updatePharmacy: async (id, payload) => {
    const response = await coreAxiosInstance.put(`/pharmacy/update?pharmacyId=${id}`, payload)
    return response.data
  },
  deletePharmacy: async id => {
    const response = await coreAxiosInstance.delete(`/pharmacy/delete?pharmacyId=${id}`)
    return response.data
  },

  connectAdyen: async (id, source = 'custom', redirectUrl) => {
    const data = {
      pharmacyId: id,
      source,
      redirectUrl
    }
    const response = await coreAxiosInstance.post(`/adyen/adyenPharmacyOnboarding`, data)
    return response.data
  },

  addPharmacy: async payload => {
    const response = await coreAxiosInstance.post('/pharmacy/add', payload)
    return response.data
  },
  createWorkingHour: async payload => {
    const response = await coreAxiosInstance.post('/pharmacy/addOrUpdatePharmacyTiming', payload)
    return response.data
  },
  deleteWorkingHour: async id => {
    const response = await coreAxiosInstance.delete(`/pharmacy/deletePharmacyTimingById?id=${id}`)
    return response.data
  },
  getCountries: async () => {
    const response = await axios.get(`https://restcountries.com/v3.1/all?fields=name,cca2,region`)
    return response.data
  }
}

export default pharmacyServices
