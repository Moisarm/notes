import api from "./api";
import type { ApiResponse, Note, PaginatedResponse } from "../types";

interface NoteFilters {
  is_archived?: boolean;
  tag_id?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag_ids?: string[];
}

interface UpdateNoteData {
  id: string;
  title?: string;
  content?: string;
  tag_ids?: string[];
}

export const noteService = {
  getAll: async (
    filters: NoteFilters = {},
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Note>> => {
    const params = new URLSearchParams();

    if (filters.is_archived !== undefined) {
      params.append("archived", filters.is_archived.toString());
    }
    if (filters.tag_id) {
      params.append("tag_id", filters.tag_id);
    }
    if (pagination.page) {
      params.append("page", pagination.page.toString());
    }
    if (pagination.limit) {
      params.append("limit", pagination.limit.toString());
    }

    const response = await api.get(`/note?${params.toString()}`);
    return response.data;
  },

  create: async (data: CreateNoteData): Promise<ApiResponse<Note>> => {
    const response = await api.post("/note", data);
    return response.data;
  },

  update: async (data: UpdateNoteData): Promise<ApiResponse<Note>> => {
    const response = await api.put(`/note/${data.id}`, data);
    return response.data;
  },

  toggleArchive: async (id: string): Promise<ApiResponse<Note>> => {
    const response = await api.patch(`/note/${id}/archive`);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/note/${id}`);
    return response.data;
  },
};
