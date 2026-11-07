import { useContext } from 'react'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  return context
}

export default useAuth
