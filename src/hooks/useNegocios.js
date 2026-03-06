import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { negociosApi } from '../api'

export function useNegocios(params = {}) {
    return useQuery({
        queryKey: ['negocios', params],
        queryFn: () => negociosApi.listar(params),
    })
}

export function useCreateNegocio() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: negociosApi.criar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negocios'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useUpdateNegocioStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }) => negociosApi.atualizarStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negocios'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useDeleteNegocio() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: negociosApi.deletar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negocios'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
