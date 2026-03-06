import { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import { useNegocios, useUpdateNegocioStatus, useDeleteNegocio } from '../hooks/useNegocios';
import PageHeader from '../components/ui/PageHeader';
import NegocioFormModal from './negocios/NegocioFormModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Piano, Handshake, Wrench } from 'lucide-react';

const COLUMNS = [
    { key: 'novo', label: 'Novo', icon: '🟡', bg: 'bg-secondary/40', border: 'border-yellow-500/30' },
    { key: 'orcamento_enviado', label: 'Orçamento Enviado', icon: '🔵', bg: 'bg-secondary/40', border: 'border-blue-500/30' },
    { key: 'negociacao', label: 'Negociação', icon: '🟠', bg: 'bg-secondary/40', border: 'border-orange-500/30' },
    { key: 'fechado', label: 'Fechado', icon: '🟢', bg: 'bg-emerald-500/5', border: 'border-emerald-500/30' },
    { key: 'perdido', label: 'Perdido', icon: '🔴', bg: 'bg-red-500/5', border: 'border-red-500/30' },
];

const TIPO_LABEL = {
    venda: { label: 'Venda', icon: <Piano className="h-3 w-3" /> },
    locacao: { label: 'Locação', icon: <Handshake className="h-3 w-3" /> },
    manutencao: { label: 'Manutenção', icon: <Wrench className="h-3 w-3" /> }
};

export default function NegociosPage() {
    const { data: clientes = [] } = useClientes();
    const { data: negocios = [], isLoading: loading } = useNegocios();

    const updateStatusMutation = useUpdateNegocioStatus();
    const deleteMutation = useDeleteNegocio();

    const [modal, setModal] = useState(false);

    const openNew = () => setModal(true);

    const changeStatus = (id, status) => {
        updateStatusMutation.mutate({ id, status });
    };

    const remove = (id) => {
        if (!confirm('Excluir este negócio?')) return;
        deleteMutation.mutate(id);
    };

    const getClienteNome = (id) => clientes.find((c) => c.id === id)?.nome || `#${id}`;

    if (loading) return (
        <>
            <PageHeader title="Negócios" description="Funil de vendas" />
            <div className="flex items-center justify-center p-24">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            </div>
        </>
    );

    return (
        <>
            <PageHeader
                title="Negócios"
                description="Funil de vendas e locações"
                action={
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="h-4 w-4" /> Novo Negócio
                    </Button>
                }
            />

            <div className="px-8 pb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {COLUMNS.map((col) => {
                        const items = negocios.filter((n) => n.status === col.key);
                        return (
                            <div
                                className={`flex flex-col min-w-[280px] w-[320px] rounded-xl border border-border bg-card shadow-sm snap-start shrink-0 overflow-hidden ${col.bg}`}
                                key={col.key}
                            >
                                <div className={`px-4 py-3 border-b flex items-center justify-between bg-card ${col.border}`}>
                                    <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
                                        <span>{col.icon}</span> {col.label}
                                    </h4>
                                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 h-5 text-xs font-semibold">
                                        {items.length}
                                    </Badge>
                                </div>

                                <div className="flex-1 p-3 flex flex-col gap-3 min-h-[150px] max-h-[calc(100vh-250px)] overflow-y-auto">
                                    {items.length === 0 ? (
                                        <div className="flex items-center justify-center h-full min-h-[100px] border-2 border-dashed border-border rounded-lg bg-background/50">
                                            <p className="text-xs font-medium text-muted-foreground">Vazio</p>
                                        </div>
                                    ) : (
                                        items.map((n) => (
                                            <div
                                                className="group bg-background border border-border hover:border-primary/50 rounded-lg p-4 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing flex flex-col"
                                                key={n.id}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h5 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                                                        {getClienteNome(n.cliente_id)}
                                                    </h5>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge variant="secondary" className="flex items-center gap-1.5 text-[10px] px-1.5 py-0 h-5 font-medium bg-secondary text-secondary-foreground border border-border">
                                                        {TIPO_LABEL[n.tipo]?.icon}
                                                        {TIPO_LABEL[n.tipo]?.label || n.tipo}
                                                    </Badge>

                                                    {n.valor && (
                                                        <span className="text-xs font-bold text-emerald-500">
                                                            R$ {parseFloat(n.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    )}
                                                </div>

                                                {n.observacoes && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 bg-muted/50 p-2 rounded-md border border-border/50">
                                                        {n.observacoes}
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-3">
                                                    <select
                                                        className="h-7 text-xs rounded-md border border-input bg-background/50 px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-ring"
                                                        value={n.status}
                                                        onChange={(e) => changeStatus(n.id, e.target.value)}
                                                    >
                                                        {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                                                    </select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => remove(n.id)}
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <NegocioFormModal
                open={modal}
                onClose={() => setModal(false)}
                clientes={clientes}
            />
        </>
    );
}
