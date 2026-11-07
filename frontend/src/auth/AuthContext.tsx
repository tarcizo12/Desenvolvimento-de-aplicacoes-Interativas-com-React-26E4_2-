import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

const STORAGE_KEY = 'estoque-demo-user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [displayName, setDisplayName] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) ?? '',
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated: displayName.length > 0,
      displayName,
      login: (name) => {
        const normalizedName = name.trim()
        sessionStorage.setItem(STORAGE_KEY, normalizedName)
        setDisplayName(normalizedName)
      },
      logout: () => {
        sessionStorage.removeItem(STORAGE_KEY)
        setDisplayName('')
      },
    }),
    [displayName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
