import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagService } from '../services/tagService'

export function useTags(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => tagService.getAll(params),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tagService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tagService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
