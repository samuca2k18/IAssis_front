import { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import { useAgenda, useConcluirEvento, useDeleteEvento } from '../hooks/useAgendaDashboard';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import EventoFormModal from './agenda/EventoFormModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Package, Music, Wrench, Piano, PhoneCall, MapPin, CheckCircle2, Trash2, Plus, User } from 'lucide-react';

const TIPO_BADGE = {
    entrega: { label: 'Entrega', variant: 'info', icon: <Package className="h-3.5 w-3.5" /> },
    evento: { label: 'Evento', variant: 'purple', icon: <Music className="h-3.5 w-3.5" /> },
    manutencao: { label: 'Manutenção', variant: 'warning', icon: <Wrench className="h-3.5 w-3.5" /> },
    afinacao: { label: 'Afinação', variant: 'accent', icon: <Piano className="h-3.5 w-3.5" /> },
    followup: { label: 'Follow-up', variant: 'success', icon: <PhoneCall className="h-3.5 w-3.5" /> },
    outro: { label: 'Outro', variant: 'secondary', icon: <MapPin className="h-3.5 w-3.5" /> },
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function AgendaPage() {
    const [filterPendentes, setFilterPendentes] = useState(false);
    const [filterTipo, setFilterTipo] = useState('');

    const { data: clientes = [] } = useClientes();
    const { data: eventos = [], isLoading: loading } = useAgenda({
        apenas_pendentes: filterPendentes || undefined,
        tipo: filterTipo || undefined
    });

    const concluirMutation = useConcluirEvento();
    const deleteMutation = useDeleteEvento();

    const [modal, setModal] = useState(false);

    const openNew = () => setModal(true);

    const concluir = (id) => {
        concluirMutation.mutate(id);
    };

    const remove = (id) => {
        if (!confirm('Excluir este evento?')) return;
        deleteMutation.mutate(id);
    };

    const getClienteNome = (id) => {
        if (!id) return null;
        return clientes.find((c) => c.id === id)?.nome || `#${id}`;
    };

    return (
        <>
            <PageHeader
                title="Agenda"
                description="Eventos e compromissos"
                action={
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="h-4 w-4" /> Novo Evento
                    </Button>
                }
            />

            <div className="px-8 pb-8">
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <input
                            type="checkbox"
                            className="rounded border-input bg-background text-primary shadow-sm focus:ring-primary focus:ring-offset-background h-4 w-4"
                            checked={filterPendentes}
                            onChange={(e) => setFilterPendentes(e.target.checked)}
                        />
                        Apenas pendentes
                    </label>

                    <select
                        className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="entrega">📦 Entrega</option>
                        <option value="evento">🎵 Evento</option>
                        <option value="manutencao">🔧 Manutenção</option>
                        <option value="afinacao">🎹 Afinação</option>
                        <option value="followup">📞 Follow-up</option>
                        <option value="outro">📌 Outro</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    </div>
                ) : eventos.length === 0 ? (
                    <EmptyState
                        icon={<CalendarIcon className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Nenhum evento encontrado"
                        description="Crie um novo evento ou ajuste os filtros"
                    />
                ) : (
                    <div className="flex flex-col gap-3">
                        {eventos.map((ev) => {
                            const dt = new Date(ev.data_hora);
                            const badge = TIPO_BADGE[ev.tipo] || TIPO_BADGE.outro;
                            const clienteNome = getClienteNome(ev.cliente_id);

                            return (
                                <div
                                    className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-card transition-colors hover:border-primary/50 ${ev.concluido ? 'opacity-50 grayscale-[0.5]' : ''}`}
                                    key={ev.id}
                                >
                                    <div className="flex flex-col items-center justify-center min-w-[60px] text-center border-r border-border pr-4">
                                        <div className="text-2xl font-black leading-none text-primary mb-1">{dt.getDate()}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{MESES[dt.getMonth()]}</div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-semibold mb-1 truncate">{ev.titulo}</h4>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <Badge variant={badge.variant === 'accent' || badge.variant === 'purple' || badge.variant === 'info' ? 'outline' : badge.variant} className={`gap-1 -ml-1 ${badge.variant === 'accent' ? 'bg-primary/10 text-primary border-primary/20' : badge.variant === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : badge.variant === 'purple' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : ''}`}>
                                                {badge.icon}
                                                {badge.label}
                                            </Badge>

                                            {clienteNome && (
                                                <span className="flex items-center gap-1 font-medium">
                                                    <User className="h-3.5 w-3.5" />
                                                    {clienteNome}
                                                </span>
                                            )}

                                            <span className="flex items-center gap-1 font-mono text-xs">
                                                {dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {ev.descricao && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{ev.descricao}</p>}
                                    </div>

                                    <div className="flex items-center gap-2 pl-4">
                                        {!ev.concluido && (
                                            <Button variant="default" size="sm" onClick={() => concluir(ev.id)} className="gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                                                <CheckCircle2 className="h-4 w-4" /> Concluir
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => remove(ev.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <EventoFormModal
                open={modal}
                onClose={() => setModal(false)}
                clientes={clientes}
            />
        </>
    );
}
