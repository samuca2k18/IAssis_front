import { useState } from 'react';
import { useLeads, useUpdateLeadStatus, useDeleteLead } from '../hooks/useLeads';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LeadFormModal from './leads/LeadFormModal';
import LeadConvertModal from './leads/LeadConvertModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, RefreshCcw, Trash2, Plus } from 'lucide-react';

const TEMP_BADGE = {
    quente: { label: 'Quente', variant: 'destructive', icon: '🔴' },
    morno: { label: 'Morno', variant: 'warning', icon: '🟡' },
    frio: { label: 'Frio', variant: 'info', icon: '🔵' },
};

const STATUS_BADGE = {
    novo: { label: 'Novo', variant: 'secondary' },
    contatado: { label: 'Contatado', variant: 'info' },
    orcamento: { label: 'Orçamento', variant: 'default' },
    negociacao: { label: 'Negociação', variant: 'warning' },
    convertido: { label: 'Convertido', variant: 'success' },
    perdido: { label: 'Perdido', variant: 'destructive' },
};

export default function LeadsPage() {
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTemp, setFilterTemp] = useState('');

    const { data: leads = [], isLoading: loading } = useLeads({
        status: filterStatus || undefined,
        temperatura: filterTemp || undefined
    });
    const updateStatusMutation = useUpdateLeadStatus();
    const deleteMutation = useDeleteLead();

    const [modal, setModal] = useState(false);
    const [convertModal, setConvertModal] = useState(null);

    const openNew = () => setModal(true);

    const updateStatus = (id, status, temperatura) => {
        updateStatusMutation.mutate({ id, data: { status, temperatura } });
    };

    const openConvert = (lead) => setConvertModal(lead);

    const remove = (id) => {
        if (!confirm('Excluir este lead?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <>
            <PageHeader
                title="Leads"
                description="Funil de marketing"
                action={
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="h-4 w-4" /> Novo Lead
                    </Button>
                }
            />

            <div className="px-8 pb-8">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <select
                        className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Todos os status</option>
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="orcamento">Orçamento</option>
                        <option value="negociacao">Negociação</option>
                        <option value="convertido">Convertido</option>
                        <option value="perdido">Perdido</option>
                    </select>
                    <select
                        className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterTemp}
                        onChange={(e) => setFilterTemp(e.target.value)}
                    >
                        <option value="">Todas temperaturas</option>
                        <option value="quente">🔴 Quente</option>
                        <option value="morno">🟡 Morno</option>
                        <option value="frio">🔵 Frio</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    </div>
                ) : leads.length === 0 ? (
                    <EmptyState
                        icon={<Target className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Nenhum lead encontrado"
                        description="Crie um novo lead ou ajuste os filtros"
                    />
                ) : (
                    <div className="rounded-md border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Origem</TableHead>
                                    <TableHead>Interesse</TableHead>
                                    <TableHead>Temperatura</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((l) => (
                                    <TableRow key={l.id}>
                                        <TableCell className="font-medium">{l.nome}</TableCell>
                                        <TableCell>{l.telefone || '—'}</TableCell>
                                        <TableCell>{l.origem || '—'}</TableCell>
                                        <TableCell>{l.interesse || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={TEMP_BADGE[l.temperatura]?.variant || 'outline'} className="gap-1.5 flex w-fit">
                                                <span>{TEMP_BADGE[l.temperatura]?.icon}</span>
                                                {TEMP_BADGE[l.temperatura]?.label || l.temperatura}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_BADGE[l.status]?.variant || 'outline'}>
                                                {STATUS_BADGE[l.status]?.label || l.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 flex-wrap min-w-[320px]">
                                                <select
                                                    className="flex h-8 w-[140px] items-center justify-between rounded-md border border-input bg-background/50 px-3 py-1 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                                                    value={l.status}
                                                    onChange={(e) => updateStatus(l.id, e.target.value)}
                                                >
                                                    <option value="novo">Novo</option>
                                                    <option value="contatado">Contatado</option>
                                                    <option value="orcamento">Orçamento</option>
                                                    <option value="negociacao">Negociação</option>
                                                    <option value="convertido">Convertido</option>
                                                    <option value="perdido">Perdido</option>
                                                </select>
                                                {l.status !== 'convertido' && (
                                                    <Button variant="default" size="sm" onClick={() => openConvert(l)} className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                                                        <RefreshCcw className="h-3.5 w-3.5" /> Converter
                                                    </Button>
                                                )}
                                                <Button variant="destructive" size="sm" onClick={() => remove(l.id)} className="h-8 px-2">
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

            <LeadFormModal open={modal} onClose={() => setModal(false)} />
            <LeadConvertModal lead={convertModal} onClose={() => setConvertModal(null)} />
        </>
    );
}
