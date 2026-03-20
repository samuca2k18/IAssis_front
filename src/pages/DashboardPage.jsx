import { useDashboard } from '../hooks/useAgendaDashboard';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Piano, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

const STATUS_MAP = {
    novo: { label: 'Novo', variant: 'warning', icon: '🟡' },
    orcamento_enviado: { label: 'Orçamento Enviado', variant: 'info', icon: '🔵' },
    negociacao: { label: 'Negociação', variant: 'default', icon: '🟠' },
    fechado: { label: 'Fechado', variant: 'success', icon: '🟢' },
    perdido: { label: 'Perdido', variant: 'destructive', icon: '🔴' },
};

export default function DashboardPage() {
    const { data, isLoading: loading } = useDashboard();

    if (loading) return (
        <div className="flex items-center justify-center p-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        </div>
    );

    if (!data) {
        return (
            <>
                <PageHeader title="Dashboard" description="Visão geral do CRM" />
                <div className="px-8 pb-8">
                    <EmptyState
                        icon={<AlertTriangle className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Não foi possível carregar o dashboard"
                        description={`Verifique se o backend remoto está rodando em ${import.meta.env.VITE_API_URL || 'http://147.15.19.110:8000'}`}
                    />
                </div>
            </>
        );
    }

    const maxStatus = Math.max(...Object.values(data.por_status || {}), 1);
    const maxOrigem = Math.max(...Object.values(data.leads_por_origem || {}), 1);

    return (
        <>
            <PageHeader title="Dashboard" description="Visão geral do CRM da Assis Pianos" />

            <div className="px-8 pb-8 space-y-6">

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{data.total_clientes}</h3>
                                <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <Target className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{data.total_leads}</h3>
                                <p className="text-sm font-medium text-muted-foreground">Leads</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                                <Piano className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{data.total_negocios}</h3>
                                <p className="text-sm font-medium text-muted-foreground">Negócios</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    <span className="text-sm font-normal text-muted-foreground mr-1">R$</span>
                                    {(data.receita_fechada || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground">Receita Fechada</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">Funil de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(data.por_status || {}).map(([status, count]) => (
                                    <div className="flex items-center gap-4" key={status}>
                                        <div className="w-32 text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <span>{STATUS_MAP[status]?.icon || '⚪'}</span>
                                            {STATUS_MAP[status]?.label || status}
                                        </div>
                                        <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-[#e8c94c] transition-all duration-500 rounded-full"
                                                style={{ width: `${(count / maxStatus) * 100}%` }}
                                            />
                                        </div>
                                        <div className="w-8 text-right text-sm font-bold">{count}</div>
                                    </div>
                                ))}
                                {Object.keys(data.por_status || {}).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum negócio ainda</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">Leads por Origem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(data.leads_por_origem || {}).map(([origem, count]) => (
                                    <div className="flex items-center gap-4" key={origem}>
                                        <div className="w-32 text-sm font-medium text-muted-foreground truncate" title={origem}>
                                            {origem}
                                        </div>
                                        <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 rounded-full"
                                                style={{ width: `${(count / maxOrigem) * 100}%` }}
                                            />
                                        </div>
                                        <div className="w-8 text-right text-sm font-bold">{count}</div>
                                    </div>
                                ))}
                                {Object.keys(data.leads_por_origem || {}).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead ainda</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{data.proximos_eventos}</h3>
                                <p className="text-sm font-medium text-muted-foreground">Próximos Eventos</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </>
    );
}
