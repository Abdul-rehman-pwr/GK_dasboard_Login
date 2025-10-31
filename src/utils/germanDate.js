import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export function formatToGermanDate(inputDate) {
  try {
    const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate
    return format(date, 'dd.MM.yyyy', { locale: de })
  } catch (error) {
    console.error('Invalid date:', inputDate)
    return ''
  }
}
