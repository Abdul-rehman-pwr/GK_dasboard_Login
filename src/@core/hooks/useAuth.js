import { useContext } from 'react'

import { AuthContext } from '@/@core/contexts/AuthContext'

export const useAuth = () => useContext(AuthContext)
