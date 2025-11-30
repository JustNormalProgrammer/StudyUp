import { useEffect } from 'react'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { RefreshTokenResponse } from '@/contexts/AuthProvider'
import { useAuth } from '@/contexts/AuthProvider'
import { api } from '@/api/api'

const useAuthenticatedRequest = () => {
  const { token, updateToken } = useAuth()

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config as InternalAxiosRequestConfig<any> & {
          sent?: boolean
        }
        if (error.response?.status !== 401 || !prevRequest.sent)
          return Promise.reject(error)
        prevRequest.sent = true
        try {
          const {
            data: { accessToken },
          } = await api.get<RefreshTokenResponse>('/auth/refresh-token')
          prevRequest.headers['Authorization'] = `Bearer ${accessToken}`
          updateToken(accessToken)
          return api(prevRequest)
        } catch (refreshError) {
          console.log(refreshError)
          return Promise.reject(error)
        }
      },
    )

    return () => {
      api.interceptors.request.eject(requestIntercept)
      api.interceptors.response.eject(responseIntercept)
    }
  }, [token, updateToken])

  return api
}

export default useAuthenticatedRequest
