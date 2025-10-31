export const convertUrlToFile = async url => {
  if (!url) return null

  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const filename = url.split('/').pop()

    const file = new File([blob], filename, { type: blob.type })
    file.path = url

    return file
  } catch (error) {
    console.error('Error converting URL to File:', error)
    return null
  }
}
