import { useState } from 'react';
import { documentosApi } from '../api';
import { useNegocios } from '../hooks/useNegocios';
import { useClientes } from '../hooks/useClientes';
import { useDocumentos } from '../hooks/useDocumentos';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import OrcamentoModal from './documentos/OrcamentoModal';
import ContratoLocacaoModal from './documentos/ContratoLocacaoModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Plus, FileSignature } from 'lucide-react';

const TIPO_LABEL = {
    orcamento: { label: 'Orçamento', variant: 'accent', icon: '📋' },
    contrato_locacao: { label: 'Contrato Locação', variant: 'default', icon: '📜' },
    recibo: { label: 'Recibo', variant: 'success', icon: '🧾' },
    proposta: { label: 'Proposta', variant: 'info', icon: '📝' },
};

export default function DocumentosPage() {
    const { data: negocios = [] } = useNegocios();
    const { data: clientes = [] } = useClientes();
    const { data: docs = [], isLoading: loading } = useDocumentos();

    const [orcModal, setOrcModal] = useState(false);
    const [contModal, setContModal] = useState(false);

    const openOrcamento = () => setOrcModal(true);
    const openContrato = () => setContModal(true);

    const downloadUrl = (doc) => {
        if (doc.tipo === 'orcamento') return documentosApi.downloadOrcamentoPdf(doc.id);
        if (doc.tipo === 'contrato_locacao') return documentosApi.downloadContratoPdf(doc.id);
        return null;
    };

    const getNegocioCliente = (negocioId) => {
        const n = negocios.find((x) => x.id === negocioId);
        if (!n) return `Negócio #${negocioId}`;
        const c = clientes.find((x) => x.id === n.cliente_id);
        return c ? c.nome : `Cliente #${n.cliente_id}`;
    };

    return (
        <>
            <PageHeader
                title="Documentos"
                description="Orçamentos e contratos"
                action={
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={openOrcamento} className="gap-2">
                            <Plus className="h-4 w-4" /> Orçamento
                        </Button>
                        <Button variant="secondary" onClick={openContrato} className="gap-2">
                            <FileSignature className="h-4 w-4" /> Contrato Locação
                        </Button>
                    </div>
                }
            />

            <div className="px-8 pb-8">
                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    </div>
                ) : docs.length === 0 ? (
                    <EmptyState
                        icon={<FileText className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Nenhum documento gerado"
                        description="Gere um orçamento ou contrato para começar"
                    />
                ) : (
                    <div className="rounded-md border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {docs.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-mono text-muted-foreground">#{d.id}</TableCell>
                                        <TableCell>
                                            <Badge variant={TIPO_LABEL[d.tipo]?.variant || 'outline'} className="gap-1.5 flex w-fit">
                                                <span className="text-xs">{TIPO_LABEL[d.tipo]?.icon}</span>
                                                {TIPO_LABEL[d.tipo]?.label || d.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{getNegocioCliente(d.negocio_id)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(d.created_at).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {downloadUrl(d) && (
                                                <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 hover:bg-primary/10 hover:text-primary">
                                                    <a href={downloadUrl(d)} target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-3.5 w-3.5" /> PDF
                                                    </a>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <OrcamentoModal
                open={orcModal}
                onClose={() => setOrcModal(false)}
                negocios={negocios}
                clientes={clientes}
            />

            <ContratoLocacaoModal
                open={contModal}
                onClose={() => setContModal(false)}
                negocios={negocios}
                clientes={clientes}
            />
        </>
    );
}
