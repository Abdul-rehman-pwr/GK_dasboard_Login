import { userAxiosInstance } from '@/utils/axios/axiosInstance'

const companyService = {
  getCompanyDetail: () => userAxiosInstance.post(`/companyDetail/getCompanyDetail`),
  createCompany: data => userAxiosInstance.post(`/companyDetail/create`, data),
  updateCompany: data => userAxiosInstance.put(`/companyDetail/update`, data),
  deleteCompany: () => userAxiosInstance.delete(`/companyDetail/delete`)
}

export default companyService
