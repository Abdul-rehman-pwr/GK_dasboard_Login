import otherService from '@/services/otherService'

export const uploadFile = async file => {
  try {
    const response = await otherService.fileUpload(file)
    if (response?.data?.length > 0) {
      const imageURL = response.data[0]
      return imageURL
    } else {
      toast.error('Failed to upload the pdf.')
      return null
    }
  } catch (err) {
    toast.error(err?.message || 'An error occurred while uploading the image.')
    return null
  }
}
