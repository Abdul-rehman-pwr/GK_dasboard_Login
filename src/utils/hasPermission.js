import { ROLE_POLICIES } from './rolePolicies'

export function hasPermission(userType, permission) {
  const userPermissions = ROLE_POLICIES[userType] || []
  return userPermissions.includes(permission)
}
