import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '../api'

export function useLeads(params = {}) {
    return useQuery({
        queryKey: ['leads', params],
        queryFn: () => leadsApi.listar(params),
    })
}

export function useCreateLead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: leadsApi.criar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useUpdateLeadStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => leadsApi.atualizarStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] })
        },
    })
}

export function useConvertLead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, clienteData }) => leadsApi.converter(id, clienteData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] })
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useDeleteLead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: leadsApi.deletar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
