import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { LoginForm } from '@/pages/Auth/Login'
import { api } from '@/api/api'
import makeAuthenticatedRequest from '@/api/AuthenticatedRequest'

export interface User {
  userId: string
  username: string
  email: string
}

export interface AuthContext {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  error: string | null
  refresh: () => Promise<string | null>
  login: (data: LoginForm) => Promise<void>
  logout: () => Promise<void>
}
interface LoginResponse extends User {
  accessToken: string
}

interface RefreshTokenResponse {
  accessToken: string
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [{ user, token, isAuthenticated, error }, setState] = useState<{
    user: User | null
    isAuthenticated: boolean
    token: string | null
    error: string | null
  }>({ user: null, isAuthenticated: false, token: null, error: null })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = await refresh()
      console.log('AccessToken:', accessToken)
      if (!accessToken) return
      try {
        const { data } = await api.get<User>('/user-details', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setState((prev) => {
          return {
            ...prev,
            user: {
              ...data,
            },
            isAuthenticated: true,
            error: null,
          }
        })
        console.log('Auth complete')
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
      setIsLoading(false)
    }
    fetchUser()
  }, [])

  const login = useCallback(async (data: LoginForm) => {
    const response = await api.post<LoginResponse>('/auth/login', data)
    setState({
      user: {
        username: response.data.username,
        userId: response.data.userId,
        email: response.data.email,
      },
      isAuthenticated: true,
      token: response.data.accessToken,
      error: null,
    })
  }, [])
  // TODO: ERRORS
  const logout = useCallback(async () => {
    if (!token) return
    try {
      await api.get('/auth/logout')
    } catch (e) {
      console.log(e)
    } finally {
      setState({ user: null, isAuthenticated: false, token: null, error: null })
    }
  }, [token])

  const refresh: () => Promise<string | null> = useCallback(async () => {
    try {
      const response =
        await api.get<RefreshTokenResponse>(`/auth/refresh-token`)
      setState((prev) => {
        return { ...prev, token: response.data.accessToken }
      })
      return response.data.accessToken
    } catch (e) {
      setState({
        user: null,
        isAuthenticated: false,
        token: null,
        error: null,
      })
      return null
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        error,
        refresh,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth is being called outside of AuthProvider')
  return context
}
