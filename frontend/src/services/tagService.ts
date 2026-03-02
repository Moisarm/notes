import api from "./api";
import type { ApiResponse, Tag, PaginatedResponse } from "../types";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const tagService = {
  getAll: async (
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Tag>> => {
    const params = new URLSearchParams();

    if (pagination.page) {
      params.append("page", pagination.page.toString());
    }
    if (pagination.limit) {
      params.append("limit", pagination.limit.toString());
    }

    const response = await api.get(`/tag?${params.toString()}`);
    return response.data;
  },

  create: async (name: string): Promise<ApiResponse<Tag>> => {
    const response = await api.post("/tag", { name });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/tag/${id}`);
    return response.data;
  },
};
