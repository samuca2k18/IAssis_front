import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentosApi } from '../api'

export function useDocumentos() {
    return useQuery({
        queryKey: ['documentos'],
        queryFn: documentosApi.listar,
    })
}

export function useDocumentosPorNegocio(negocioId) {
    return useQuery({
        queryKey: ['documentos', 'negocio', negocioId],
        queryFn: () => documentosApi.listarPorNegocio(negocioId),
        enabled: !!negocioId,
    })
}

export function useGerarOrcamento() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: documentosApi.gerarOrcamento,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['documentos'] })
            queryClient.invalidateQueries({ queryKey: ['negocios'] }) // Atualiza status e valor
            if (variables.negocio_id) {
                queryClient.invalidateQueries({ queryKey: ['documentos', 'negocio', variables.negocio_id] })
            }
        },
    })
}

export function useGerarContratoLocacao() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: documentosApi.gerarContratoLocacao,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['documentos'] })
            queryClient.invalidateQueries({ queryKey: ['negocios'] }) // Atualiza valor e status
            if (variables.negocio_id) {
                queryClient.invalidateQueries({ queryKey: ['documentos', 'negocio', variables.negocio_id] })
            }
        },
    })
}
