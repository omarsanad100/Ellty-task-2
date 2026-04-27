import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

httpClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
