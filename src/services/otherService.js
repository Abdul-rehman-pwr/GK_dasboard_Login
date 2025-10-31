import { coreAxiosInstance, getKongAxiosInstance } from '@/utils/axios/axiosInstance'

const otherService = {
  fileUpload: (files) => {
    const formData = new FormData()
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append(`files`, file)
      })
    } else {
      formData.append('files', files)
    }

    return getKongAxiosInstance.post(`/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 645000
    })
  }
}

export default otherService
