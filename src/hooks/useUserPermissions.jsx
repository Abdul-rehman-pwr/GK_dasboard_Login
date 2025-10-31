'use client'
import { useEffect, useState } from 'react'
import { ROLE_POLICIES } from '@/utils/rolePolicies'
import { getLocalUser } from '@/utils/auth'

export function useUserPermissions() {

  const [permissions, setPermissions] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getLocalUser()
    if (user) {
      const userPermissions = ROLE_POLICIES[user.accountTypeId] || []
      setPermissions(new Set(userPermissions))
    }
    setLoading(false)
  }, [])

  return { permissions, loading }
}
