import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'


const makeAuthenticatedRequest = (
  api: AxiosInstance,
  token: string,
  refresh: () => Promise<string | null>,
) => {
  api.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const prevRequest = error.config as InternalAxiosRequestConfig<any> & {
        sent?: boolean
      }
      if (error.response?.status === 401 && !prevRequest.sent) {
        prevRequest.sent = true
        const newAccessToken = await refresh()
        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(prevRequest)
      }
      return Promise.reject(error)
    },
  )
  return api
}

export default makeAuthenticatedRequest
