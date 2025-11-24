import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { LoginResponse } from '@/pages/Auth/Login'
import { api } from '@/api/api'

export interface User {
  userId: string
  username: string
  email: string
}
export interface RefreshTokenResponse {
  accessToken: string
}

export interface AuthContext {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginResponse) => void
  logout: () => void
  updateToken: (updatedToken: string) => void
}


const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [{ user, token, isAuthenticated }, setState] = useState<{
    user: User | null
    isAuthenticated: boolean
    token: string | null
  }>({ user: null, isAuthenticated: false, token: null})
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback((data: LoginResponse) => {
    setState({
      user: {
        username: data.username,
        userId: data.userId,
        email: data.email,
      },
      isAuthenticated: true,
      token: data.accessToken,
    })
    return
  }, [])
  // TODO: ERRORS
  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, token: null })
    return
  }, [])

  const updateToken = useCallback((updatedToken: string) => {
    setState((prev) => {
      return { ...prev, token: updatedToken }
    })
    return
  }, [])

  // LOADING STATE TODO
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data: {accessToken}} = await api.get<RefreshTokenResponse>('/auth/refresh-token')
        const { data } = await api.get<User>('/user-details', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setState(
          {
            user: {
              ...data,
            },
            isAuthenticated: true,
            token: accessToken,
          }
        )
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        updateToken,
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
