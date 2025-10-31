'use client'
import { getLocalUser } from '@/utils/auth'
import { ROLE_POLICIES } from '@/utils/rolePolicies'
import { useEffect, useState } from 'react'

export function useHasPermission(permission) {
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    const user = getLocalUser()
    const userType = user?.accountTypeId

    if (!userType) {
      setHasPermission(false)
      return
    }

    const userPermissions = ROLE_POLICIES[userType] || []
    setHasPermission(userPermissions.includes(permission))
  }, [permission])

  return hasPermission
}
