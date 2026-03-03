import { useState, useEffect } from 'react';
import { campanhasApi } from '../api';
import Modal from '../components/Modal';

const STATUS_BADGE = {
    ativa: { label: '🟢 Ativa', cls: 'badge-success' },
    pausada: { label: '⏸️ Pausada', cls: 'badge-warning' },
    encerrada: { label: '🔴 Encerrada', cls: 'badge-danger' },
};

const EMPTY = { nome: '', plataforma: '', investimento: '0', leads_gerados: '0', vendas: '0', receita: '0', status: 'ativa', observacoes: '' };

export default function CampanhasPage() {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const load = () => {
        setLoading(true);
        campanhasApi.listar().then(setCampanhas).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (c) => {
        setEditing(c);
        setForm({
            nome: c.nome, plataforma: c.plataforma,
            investimento: String(c.investimento), leads_gerados: String(c.leads_gerados),
            vendas: String(c.vendas), receita: String(c.receita), status: c.status,
            observacoes: c.observacoes || '',
        });
        setModal(true);
    };

    const save = async () => {
        const data = {
            ...form,
            investimento: parseFloat(form.investimento) || 0,
            leads_gerados: parseInt(form.leads_gerados) || 0,
            vendas: parseInt(form.vendas) || 0,
            receita: parseFloat(form.receita) || 0,
        };
        if (!data.observacoes) delete data.observacoes;

        if (editing) {
            await campanhasApi.atualizar(editing.id, {
                investimento: data.investimento, leads_gerados: data.leads_gerados,
                vendas: data.vendas, receita: data.receita, status: data.status,
                observacoes: data.observacoes,
            });
        } else {
            await campanhasApi.criar(data);
        }
        setModal(false);
        load();
    };

    const remove = async (id) => {
        if (!confirm('Excluir esta campanha?')) return;
        await campanhasApi.deletar(id);
        load();
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const fmt = (v) => v != null ? `R$ ${parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—';

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Campanhas</h2>
                        <p>Gestão de marketing</p>
                    </div>
                    <button className="btn btn-primary" onClick={openNew}>+ Nova Campanha</button>
                </div>
            </div>
            <div className="page-content">
                {loading ? (
                    <div className="loading-spinner" />
                ) : campanhas.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📢</div>
                        <h3>Nenhuma campanha cadastrada</h3>
                        <p>Crie sua primeira campanha de marketing</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Plataforma</th>
                                    <th>Investimento</th>
                                    <th>Leads</th>
                                    <th>Vendas</th>
                                    <th>Receita</th>
                                    <th>CPL</th>
                                    <th>ROI</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campanhas.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 600 }}>{c.nome}</td>
                                        <td>{c.plataforma}</td>
                                        <td>{fmt(c.investimento)}</td>
                                        <td>{c.leads_gerados}</td>
                                        <td>{c.vendas}</td>
                                        <td style={{ color: 'var(--success)' }}>{fmt(c.receita)}</td>
                                        <td>{c.custo_por_lead != null ? fmt(c.custo_por_lead) : '—'}</td>
                                        <td>
                                            {c.roi_percentual != null ? (
                                                <span style={{ color: c.roi_percentual >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                                                    {c.roi_percentual.toFixed(1)}%
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td><span className={`badge ${STATUS_BADGE[c.status]?.cls || 'badge-neutral'}`}>{STATUS_BADGE[c.status]?.label || c.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title={editing ? 'Editar Campanha' : 'Nova Campanha'}
                footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={save}>Salvar</button></>}
            >
                <div className="form-row">
                    <div className="form-group">
                        <label>Nome *</label>
                        <input className="form-control" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Black Friday Pianos" disabled={!!editing} />
                    </div>
                    <div className="form-group">
                        <label>Plataforma *</label>
                        <select className="form-control" value={form.plataforma} onChange={(e) => set('plataforma', e.target.value)} disabled={!!editing}>
                            <option value="">Selecione...</option>
                            <option value="Meta">Meta</option>
                            <option value="Google">Google</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Investimento (R$)</label><input className="form-control" type="number" value={form.investimento} onChange={(e) => set('investimento', e.target.value)} /></div>
                    <div className="form-group"><label>Leads Gerados</label><input className="form-control" type="number" value={form.leads_gerados} onChange={(e) => set('leads_gerados', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Vendas</label><input className="form-control" type="number" value={form.vendas} onChange={(e) => set('vendas', e.target.value)} /></div>
                    <div className="form-group"><label>Receita (R$)</label><input className="form-control" type="number" value={form.receita} onChange={(e) => set('receita', e.target.value)} /></div>
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={form.status} onChange={(e) => set('status', e.target.value)}>
                        <option value="ativa">Ativa</option>
                        <option value="pausada">Pausada</option>
                        <option value="encerrada">Encerrada</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Observações</label>
                    <textarea className="form-control" value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} />
                </div>
            </Modal>
        </>
    );
}
