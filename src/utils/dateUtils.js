// dateUtils.js
export const getFormattedDate = (date = new Date()) => {
  const validDate = date instanceof Date ? date : new Date(date) // Ensure date is valid
  return validDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getFormattedTime = (date = new Date()) => {
  const validDate = date instanceof Date ? date : new Date(date)
  return validDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const addEpochDate = dateString => {
  const date = new Date(dateString)
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime()
}
