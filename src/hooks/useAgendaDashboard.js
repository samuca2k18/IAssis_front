import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agendaApi, dashboardApi } from '../api'

export function useAgenda(params = {}) {
    return useQuery({
        queryKey: ['agenda', params],
        queryFn: () => agendaApi.listar(params),
    })
}

export function useCreateEvento() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: agendaApi.criar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agenda'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useConcluirEvento() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: agendaApi.concluir,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agenda'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useDeleteEvento() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: agendaApi.deletar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agenda'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardApi.get,
    })
}
