export interface pagination {
  page: number;
  limit: number;
}

export interface paginated_result {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}
