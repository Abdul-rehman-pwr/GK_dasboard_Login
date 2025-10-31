import { getKongAxiosInstance } from '@/utils/axios/axiosInstance'

const productService = {
  createProduct: (data, source) => getKongAxiosInstance.post(`/product/add${source ? `?source=${source}` : ''}`, data),

  updateProduct: (id, data, source) =>
    getKongAxiosInstance.put(`/product/update?id=${id}${source ? `&source=${source}` : ''}`, data),

  deleteProduct: (id, source) =>
    getKongAxiosInstance.delete(`/product/delete?id=${id}${source ? `&source=${source}` : ''}`),

  getProduct: (id, source) => getKongAxiosInstance.get(`/product/getById?id=${id}${source ? `&source=${source}` : ''}`),

  getProducts: ({ page, size, source, body, sort = [] }) =>
    getKongAxiosInstance.post(
      `/product/getAll?page=${page}&size=${size}&source=${source}&sort=${sort.join('&sort=')}`,
      body
    ),

  uploadProducts: (files, source) => {
    const formData = new FormData()
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file)
      })
    } else {
      formData.append('files', files)
    }

    return getKongAxiosInstance.post(`/product/uploadProducts${source ? `?source=${source}` : ''}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 645000
    })
  }
}

export default productService
