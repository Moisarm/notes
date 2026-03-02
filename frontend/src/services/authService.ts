import api from './api'
import type { ApiResponse, User } from '../types'

interface LoginData {
  username: string
  password: string
}

interface RegisterData {
  username: string
  password: string
}

export const authService = {
  login: async (data: LoginData): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  me: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
