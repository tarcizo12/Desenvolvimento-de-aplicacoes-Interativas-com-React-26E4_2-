import { createContext } from 'react'

export interface AuthContextValue {
  authenticated: boolean
  displayName: string
  login: (displayName: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
