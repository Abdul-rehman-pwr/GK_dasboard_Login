import { getKongAxiosInstance } from '@/utils/axios/axiosInstance'

const orderService = {
  getEligibilityForm: data => getKongAxiosInstance.get(`/order/getAnswerBySessionId?sessionId=${data?.heyFlowId}`),
  getAllOrders: payload => {
    const { page, size, filters = [], sort = ['doctorApprovalStatus,desc'] } = payload
    return getKongAxiosInstance.post(
      `/order/getAllOrders?page=${page}&size=${size}&sort=${sort.join('&sort=')}`,
      filters
    )
  },
  getOrderById: id => getKongAxiosInstance.get(`/order/getOrderById?orderId=${id}`)
}

export default orderService
