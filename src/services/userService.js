import { coreAxiosInstance, userAxiosInstance, getKongAxiosInstance } from '@/utils/axios/axiosInstance'

const userService = {
  addUser: data => getKongAxiosInstance.post(`/users/addUser`, data),
  register: data => userAxiosInstance.post(`/users/signUp`, data),
  forgotPassword: data => userAxiosInstance.get(`/users/resetPassword?email=${data?.email}`),
  resetPassword: data => userAxiosInstance.post(`/users/update-password`, data),
  loginWithPasscode: data => userAxiosInstance.post(`/users/loginWithPasscode`, data),
  resendLoginPasscode: data => userAxiosInstance.post(`/users/resendLoginPasscode?email=${data?.email}`),
  updateUser: data => userAxiosInstance.put(`/users/updateUser/${data?.userId}`, data),
  refreshToken: refreshToken => userAxiosInstance.get(`users/token/refresh?refreshToken=${refreshToken}`),
  addTax: data => userAxiosInstance.post(`/users/addOrUpdateTaxDetail`, data),
  getUserByToken: data => userAxiosInstance.get(`/users/getUserByToken`, data)
}

export default userService
