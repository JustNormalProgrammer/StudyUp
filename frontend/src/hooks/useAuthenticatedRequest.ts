import { useEffect } from 'react'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuth } from '@/contexts/AuthProvider'
import { api } from '@/api/api'

const useAuthenticatedRequest = () => {
  const { token, refresh } = useAuth()

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
        const prevRequest = error.config as InternalAxiosRequestConfig<any> & { sent?: boolean }
        if (error.response?.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return api(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.request.eject(requestIntercept)
      api.interceptors.response.eject(responseIntercept)
    }
  }, [token, refresh])

  return api
}

export default useAuthenticatedRequest
