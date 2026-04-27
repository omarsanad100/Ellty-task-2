import { httpClient } from './http-client'

export interface AuthUser {
  id: string
  username: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface AuthPayload {
  username: string
  password: string
}

export const loginApi = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await httpClient.post<AuthResponse>('/login', payload)
  return data
}

export const registerApi = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await httpClient.post<AuthResponse>('/register', payload)
  return data
}
