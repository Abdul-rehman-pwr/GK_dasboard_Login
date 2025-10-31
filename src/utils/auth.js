import { USERTYPES } from '@/configs/app'

export const getLocalUser = () => {
  try {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Failed to parse local user data:', error)
    return null
  }
}

export const isAdminUser = () => {
  const user = getLocalUser()
  return user?.accountTypeId === USERTYPES.admin
}
