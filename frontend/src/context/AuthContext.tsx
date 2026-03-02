import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authService.me()
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password })
    if (response.data?.user) {
      setUser(response.data.user)
    }
  }

  const register = async (username: string, password: string) => {
    const response = await authService.register({ username, password })
    if (response.data?.user) {
      setUser(response.data.user)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
