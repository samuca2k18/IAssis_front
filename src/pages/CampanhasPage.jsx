import { useState } from 'react';
import { useCampanhas, useDeleteCampanha } from '../hooks/useCampanhas';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import CampanhaFormModal from './campanhas/CampanhaFormModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Pencil, Trash2, Plus } from 'lucide-react';

const STATUS_BADGE = {
    ativa: { label: 'Ativa', variant: 'success', icon: '🟢' },
    pausada: { label: 'Pausada', variant: 'warning', icon: '⏸️' },
    encerrada: { label: 'Encerrada', variant: 'destructive', icon: '🔴' },
};

export default function CampanhasPage() {
    const { data: campanhas = [], isLoading: loading } = useCampanhas();
    const deleteMutation = useDeleteCampanha();

    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const openNew = () => { setEditing(null); setModal(true); };
    const openEdit = (c) => {
        setEditing(c);
        setModal(true);
    };

    const remove = (id) => {
        if (!confirm('Excluir esta campanha?')) return;
        deleteMutation.mutate(id);
    };

    const fmt = (v) => v != null ? `R$ ${parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—';

    return (
        <>
            <PageHeader
                title="Campanhas"
                description="Gestão de marketing"
                action={
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="h-4 w-4" /> Nova Campanha
                    </Button>
                }
            />

            <div className="px-8 pb-8">
                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    </div>
                ) : campanhas.length === 0 ? (
                    <EmptyState
                        icon={<Megaphone className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Nenhuma campanha cadastrada"
                        description="Crie sua primeira campanha de marketing"
                    />
                ) : (
                    <div className="rounded-md border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Plataforma</TableHead>
                                    <TableHead>Investimento</TableHead>
                                    <TableHead className="text-center">Leads</TableHead>
                                    <TableHead className="text-center">Vendas</TableHead>
                                    <TableHead>Receita</TableHead>
                                    <TableHead>CPL</TableHead>
                                    <TableHead>ROI</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campanhas.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.nome}</TableCell>
                                        <TableCell>{c.plataforma}</TableCell>
                                        <TableCell>{fmt(c.investimento)}</TableCell>
                                        <TableCell className="text-center">{c.leads_gerados}</TableCell>
                                        <TableCell className="text-center">{c.vendas}</TableCell>
                                        <TableCell className="text-emerald-500 font-medium">{fmt(c.receita)}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.custo_por_lead != null ? fmt(c.custo_por_lead) : '—'}</TableCell>
                                        <TableCell>
                                            {c.roi_percentual != null ? (
                                                <span className={`font-semibold ${c.roi_percentual >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {c.roi_percentual.toFixed(1)}%
                                                </span>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_BADGE[c.status]?.variant || 'outline'} className="gap-1.5 flex w-fit">
                                                <span>{STATUS_BADGE[c.status]?.icon}</span>
                                                {STATUS_BADGE[c.status]?.label || c.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => openEdit(c)} className="h-8 px-2">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => remove(c.id)} className="h-8 px-2">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <CampanhaFormModal
                open={modal}
                onClose={() => setModal(false)}
                editing={editing}
            />
        </>
    );
}
