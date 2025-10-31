import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const clientService = {
  update: (clientId, data) => coreAxiosInstance.put(`/client/update?clientId=${clientId}`, data),
  getAllClients: (pageNo = 0, pageSize = 10, filters = []) =>
    coreAxiosInstance.post(`/client/getAllClients?page=${pageNo}&size=${pageSize}`, filters),
  create: data => coreAxiosInstance.post(`/client/create`, data),
  getByClientId: clientId => coreAxiosInstance.get(`/client/getByClientId?clientId=${clientId}`),
  deleteClient: clientId => coreAxiosInstance.delete(`/client/delete?clientId=${clientId}`),
  getClientStats: () => coreAxiosInstance.get(`stats/client`),
  gethomeStats: () => coreAxiosInstance.get(`stats/dashboard`)
}

export default clientService
