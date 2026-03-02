import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { noteService } from '../services/noteService'

interface UseNotesParams {
  is_archived?: boolean
  tag_id?: string
  page?: number
  limit?: number
}

export function useNotes(params: UseNotesParams = {}) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => noteService.getAll(
      { is_archived: params.is_archived, tag_id: params.tag_id },
      { page: params.page, limit: params.limit }
    ),
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: noteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: noteService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useToggleArchiveNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: noteService.toggleArchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: noteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
