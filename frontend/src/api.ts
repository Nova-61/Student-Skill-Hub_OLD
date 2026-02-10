import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000/api/",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  config.headers = config.headers || {}
  if (token && typeof token === "string" && token.length > 10) {
    config.headers.Authorization = `Bearer ${token.trim()}`
  }
  return config
})
// Response interceptor: on 401 try refresh token once and retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    const status = error.response?.status

    // don't try to refresh if this request was the refresh call itself
    const isRefreshCall = originalRequest.url?.includes("users/refresh") || originalRequest._skipRefresh

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true
      const refresh = localStorage.getItem("refresh")
      if (refresh) {
          try {
          // call refresh without triggering this interceptor (use axios directly)
          // use the same baseURL as the api instance to avoid relative-path issues
          const refreshUrl = (api.defaults.baseURL || "") + "users/refresh/"
          const resp = await axios.post(refreshUrl, { refresh }, { headers: { "Content-Type": "application/json" } })
          const newAccess = resp.data.access
          if (newAccess) {
            localStorage.setItem("access", newAccess)
            // update header and retry original request using api instance
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newAccess}`
            // ensure baseURL is set when retrying through api
            try {
              return await api.request(originalRequest)
            } catch (retryErr) {
              return Promise.reject(retryErr)
            }
          }
        } catch (e) {
          // refresh failed - clear storage and reject
          localStorage.removeItem("access")
          localStorage.removeItem("refresh")
          localStorage.removeItem("user_email")
          return Promise.reject(error)
        }
      }
    }

    return Promise.reject(error)
  }
)
