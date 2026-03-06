import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientesApi } from '../api'

export function useClientes() {
    return useQuery({
        queryKey: ['clientes'],
        queryFn: clientesApi.listar,
    })
}

export function useCreateCliente() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: clientesApi.criar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useUpdateCliente() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => clientesApi.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
        },
    })
}

export function useDeleteCliente() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: clientesApi.deletar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
