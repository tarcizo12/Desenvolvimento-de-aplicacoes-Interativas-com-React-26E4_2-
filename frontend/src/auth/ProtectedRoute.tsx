import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import useAuth from './useAuth'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated } = useAuth()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
