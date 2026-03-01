export interface pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
