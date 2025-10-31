import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const templateService = {
  getTemplates: () => coreAxiosInstance.post(`/template/getAllTemplates`)
}

export default templateService
