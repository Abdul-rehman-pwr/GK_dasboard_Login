const authConfig = {
  meEndpoint: '/auth/me',
  loginEndpoint: 'https://weaid-user-management-dev.internal.i-ways-network.org/users/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export default authConfig
