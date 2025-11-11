export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
}

export interface FilterParams {
  search?: string
  state?: string
  date_from?: string
  date_to?: string
  [key: string]: any
}
