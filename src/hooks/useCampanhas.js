import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campanhasApi } from '../api'

export function useCampanhas() {
    return useQuery({
        queryKey: ['campanhas'],
        queryFn: campanhasApi.listar,
    })
}

export function useCreateCampanha() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: campanhasApi.criar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campanhas'] })
        },
    })
}

export function useUpdateCampanha() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => campanhasApi.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campanhas'] })
        },
    })
}

export function useDeleteCampanha() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: campanhasApi.deletar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campanhas'] })
        },
    })
}
