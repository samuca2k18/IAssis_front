import { useState, useEffect } from 'react';
import { agendaApi, clientesApi } from '../api';
import Modal from '../components/Modal';

const TIPO_BADGE = {
    entrega: { label: '📦 Entrega', cls: 'badge-info' },
    evento: { label: '🎵 Evento', cls: 'badge-purple' },
    manutencao: { label: '🔧 Manutenção', cls: 'badge-warning' },
    afinacao: { label: '🎹 Afinação', cls: 'badge-accent' },
    followup: { label: '📞 Follow-up', cls: 'badge-success' },
    outro: { label: '📌 Outro', cls: 'badge-neutral' },
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const EMPTY = { titulo: '', descricao: '', data_hora: '', tipo: 'outro', cliente_id: '' };

export default function AgendaPage() {
    const [eventos, setEventos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [filterPendentes, setFilterPendentes] = useState(false);
    const [filterTipo, setFilterTipo] = useState('');

    const load = () => {
        setLoading(true);
        Promise.all([
            agendaApi.listar({ apenas_pendentes: filterPendentes || undefined, tipo: filterTipo || undefined }),
            clientesApi.listar(),
        ]).then(([e, c]) => { setEventos(e); setClientes(c); }).finally(() => setLoading(false));
    };

    useEffect(load, [filterPendentes, filterTipo]);

    const openNew = () => { setForm(EMPTY); setModal(true); };

    const save = async () => {
        if (!form.titulo.trim()) return alert('Título é obrigatório');
        if (!form.data_hora) return alert('Data e hora são obrigatórias');
        const data = { ...form };
        // Garantir formato ISO completo (datetime-local não inclui segundos)
        if (data.data_hora && data.data_hora.length === 16) {
            data.data_hora = data.data_hora + ':00';
        }
        if (!data.descricao) delete data.descricao;
        if (data.cliente_id) data.cliente_id = parseInt(data.cliente_id);
        else delete data.cliente_id;
        try {
            await agendaApi.criar(data);
            setModal(false);
            load();
        } catch (e) {
            alert('Erro: ' + e.message);
        }
    };

    const concluir = async (id) => {
        await agendaApi.concluir(id);
        load();
    };

    const remove = async (id) => {
        if (!confirm('Excluir este evento?')) return;
        await agendaApi.deletar(id);
        load();
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const getClienteNome = (id) => {
        if (!id) return null;
        return clientes.find((c) => c.id === id)?.nome || `#${id}`;
    };

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Agenda</h2>
                        <p>Eventos e compromissos</p>
                    </div>
                    <button className="btn btn-primary" onClick={openNew}>+ Novo Evento</button>
                </div>
            </div>
            <div className="page-content">
                <div className="filters-bar">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={filterPendentes} onChange={(e) => setFilterPendentes(e.target.checked)} />
                        Apenas pendentes
                    </label>
                    <select className="form-control" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
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
                    <div className="loading-spinner" />
                ) : eventos.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📅</div>
                        <h3>Nenhum evento encontrado</h3>
                        <p>Crie um novo evento ou ajuste os filtros</p>
                    </div>
                ) : (
                    <div className="event-list">
                        {eventos.map((ev) => {
                            const dt = new Date(ev.data_hora);
                            const badge = TIPO_BADGE[ev.tipo] || TIPO_BADGE.outro;
                            const clienteNome = getClienteNome(ev.cliente_id);
                            return (
                                <div className={`event-item${ev.concluido ? ' done' : ''}`} key={ev.id}>
                                    <div className="event-date">
                                        <div className="day">{dt.getDate()}</div>
                                        <div className="month">{MESES[dt.getMonth()]}</div>
                                    </div>
                                    <div className="event-info">
                                        <h4>{ev.titulo}</h4>
                                        <p>
                                            <span className={`badge ${badge.cls}`} style={{ marginRight: 8 }}>{badge.label}</span>
                                            {clienteNome && <span style={{ marginRight: 8 }}>👤 {clienteNome}</span>}
                                            {dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {ev.descricao && <p style={{ marginTop: 4 }}>{ev.descricao}</p>}
                                    </div>
                                    <div className="event-actions">
                                        {!ev.concluido && (
                                            <button className="btn btn-success btn-sm" onClick={() => concluir(ev.id)}>✅ Concluir</button>
                                        )}
                                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(ev.id)}>🗑️</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title="Novo Evento"
                footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={save}>Salvar</button></>}
            >
                <div className="form-group">
                    <label>Título *</label>
                    <input className="form-control" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Afinação Piano - João" />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Data e Hora *</label>
                        <input className="form-control" type="datetime-local" value={form.data_hora} onChange={(e) => set('data_hora', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select className="form-control" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                            <option value="entrega">📦 Entrega</option>
                            <option value="evento">🎵 Evento</option>
                            <option value="manutencao">🔧 Manutenção</option>
                            <option value="afinacao">🎹 Afinação</option>
                            <option value="followup">📞 Follow-up</option>
                            <option value="outro">📌 Outro</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Cliente (opcional)</label>
                    <select className="form-control" value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)}>
                        <option value="">Nenhum</option>
                        {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea className="form-control" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Detalhes do evento" />
                </div>
            </Modal>
        </>
    );
}
