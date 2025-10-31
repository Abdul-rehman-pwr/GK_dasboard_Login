import { coreAxiosInstance } from '@/utils/axios/axiosInstance'

const pharmacyAdminServices = {
  getAllPharmacyAdminsWithIdAndNames: async () => {
    const response = await coreAxiosInstance.post(`/users/getAllPharmacyAdminUsersWithIdAndName`)
    return response.data
  }
}

export default pharmacyAdminServices
