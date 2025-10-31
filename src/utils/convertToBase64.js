export const convertImageToBase64 = async url => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}
