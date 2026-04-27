import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOperationApi, createRootApi, getTreeApi } from '../api/posts.api'
import { queryKeys } from './query-keys'

export const useTreeQuery = () => {
  return useQuery({
    queryKey: queryKeys.tree,
    queryFn: getTreeApi
  })
}

export const useCreateRootMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRootApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tree })
    }
  })
}

export const useCreateOperationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOperationApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tree })
    }
  })
}
