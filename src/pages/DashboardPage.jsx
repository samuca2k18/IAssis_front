import { useState, useEffect } from 'react';
import { dashboardApi } from '../api';

const STATUS_MAP = {
    novo: { label: 'Novo', color: 'badge-warning', icon: '🟡' },
    orcamento_enviado: { label: 'Orçamento Enviado', color: 'badge-info', icon: '🔵' },
    negociacao: { label: 'Negociação', color: 'badge-purple', icon: '🟠' },
    fechado: { label: 'Fechado', color: 'badge-success', icon: '🟢' },
    perdido: { label: 'Perdido', color: 'badge-danger', icon: '🔴' },
};

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardApi.get()
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-spinner" />;

    if (!data) {
        return (
            <>
                <div className="page-header"><h2>Dashboard</h2><p>Visão geral do CRM</p></div>
                <div className="page-content">
                    <div className="empty-state">
                        <div className="icon">⚠️</div>
                        <h3>Não foi possível carregar o dashboard</h3>
                        <p>Verifique se o backend está rodando em http://localhost:8000</p>
                    </div>
                </div>
            </>
        );
    }

    const maxStatus = Math.max(...Object.values(data.por_status || {}), 1);
    const maxOrigem = Math.max(...Object.values(data.leads_por_origem || {}), 1);

    return (
        <>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Visão geral do CRM da Assis Pianos</p>
            </div>
            <div className="page-content">
                <div className="metric-grid">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>👤</div>
                        <div className="metric-info">
                            <h3>{data.total_clientes}</h3>
                            <span>Clientes</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>🎯</div>
                        <div className="metric-info">
                            <h3>{data.total_leads}</h3>
                            <span>Leads</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>🎹</div>
                        <div className="metric-info">
                            <h3>{data.total_negocios}</h3>
                            <span>Negócios</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>💰</div>
                        <div className="metric-info">
                            <h3>R$ {(data.receita_fechada || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                            <span>Receita Fechada</span>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="card">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Funil de Vendas</h3>
                        <div className="stat-bar-list">
                            {Object.entries(data.por_status || {}).map(([status, count]) => (
                                <div className="stat-bar-item" key={status}>
                                    <span className="stat-bar-label">
                                        {STATUS_MAP[status]?.icon || '⚪'} {STATUS_MAP[status]?.label || status}
                                    </span>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill" style={{ width: `${(count / maxStatus) * 100}%` }} />
                                    </div>
                                    <span className="stat-bar-value">{count}</span>
                                </div>
                            ))}
                            {Object.keys(data.por_status || {}).length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum negócio ainda</p>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Leads por Origem</h3>
                        <div className="stat-bar-list">
                            {Object.entries(data.leads_por_origem || {}).map(([origem, count]) => (
                                <div className="stat-bar-item" key={origem}>
                                    <span className="stat-bar-label">{origem}</span>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill" style={{ width: `${(count / maxOrigem) * 100}%` }} />
                                    </div>
                                    <span className="stat-bar-value">{count}</span>
                                </div>
                            ))}
                            {Object.keys(data.leads_por_origem || {}).length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum lead ainda</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="metric-grid">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>📅</div>
                        <div className="metric-info">
                            <h3>{data.proximos_eventos}</h3>
                            <span>Próximos Eventos</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
