export interface User {
  id?: string
  user_id: string
  username: string
}

export interface Tag {
  id: string
  name: string
  created_at: string
}

export interface Note {
  id: string
  title: string
  content: string
  is_archived: boolean
  created_at: string
  updated_at: string
  user_id: string
  tags?: Tag[]
}

export interface PaginatedResponse<T> {
  status: number
  message?: string
  data?: {
    items: T[]
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface ApiResponse<T> {
  status: number
  message?: string
  data?: T
  error?: string
}
