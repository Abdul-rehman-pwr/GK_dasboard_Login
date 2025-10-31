import { getKongAxiosInstance } from '@/utils/axios/axiosInstance'

const signService = {
  authorizeVerimiUser: stateId =>
    getKongAxiosInstance.get(`/verimi/authorizeVerimiUser?stateId=${stateId}`, {
      withCredentials: true
    }),
  updateOrderStatus: data => getKongAxiosInstance.put(`/order/updateOrderStatus?orderId=${data.orderId}`, data),
  updateSigningStatus: data => getKongAxiosInstance.put(`/order/updateSigningStatus?orderId=${data.orderId}`, data),
  downloadPDF: orderId => getKongAxiosInstance.get(`/order/getSignedDocument?orderId=${orderId}`),
  setAuthorizationPending: data => getKongAxiosInstance.put(`/verimi/setAuthorizationPending`, data)
}

export default signService
