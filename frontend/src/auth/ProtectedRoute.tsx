import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../store/hooks'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const authenticated = useAppSelector((state) => state.auth.displayName.length > 0)
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
