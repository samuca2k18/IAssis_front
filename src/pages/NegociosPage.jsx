import { useState, useEffect } from 'react';
import { negociosApi, clientesApi } from '../api';
import Modal from '../components/Modal';

const COLUMNS = [
    { key: 'novo', label: 'Novo', icon: '🟡' },
    { key: 'orcamento_enviado', label: 'Orçamento Enviado', icon: '🔵' },
    { key: 'negociacao', label: 'Negociação', icon: '🟠' },
    { key: 'fechado', label: 'Fechado', icon: '🟢' },
    { key: 'perdido', label: 'Perdido', icon: '🔴' },
];

const TIPO_LABEL = { venda: '💰 Venda', locacao: '🏠 Locação', manutencao: '🔧 Manutenção' };

const EMPTY = { cliente_id: '', tipo: 'manutencao', valor: '', observacoes: '', descricao_piano: '', local_evento: '' };

export default function NegociosPage() {
    const [negocios, setNegocios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);

    const load = () => {
        setLoading(true);
        Promise.all([negociosApi.listar(), clientesApi.listar()])
            .then(([n, c]) => { setNegocios(n); setClientes(c); })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openNew = () => { setForm(EMPTY); setModal(true); };

    const save = async () => {
        const data = { ...form, cliente_id: parseInt(form.cliente_id) };
        if (data.valor) data.valor = parseFloat(data.valor);
        else delete data.valor;
        if (!data.observacoes) delete data.observacoes;
        if (!data.descricao_piano) delete data.descricao_piano;
        if (!data.local_evento) delete data.local_evento;
        await negociosApi.criar(data);
        setModal(false);
        load();
    };

    const changeStatus = async (id, status) => {
        await negociosApi.atualizarStatus(id, status);
        load();
    };

    const remove = async (id) => {
        if (!confirm('Excluir este negócio?')) return;
        await negociosApi.deletar(id);
        load();
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const getClienteNome = (id) => clientes.find((c) => c.id === id)?.nome || `#${id}`;

    if (loading) return <><div className="page-header"><h2>Negócios</h2></div><div className="page-content"><div className="loading-spinner" /></div></>;

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Negócios</h2>
                        <p>Funil de vendas</p>
                    </div>
                    <button className="btn btn-primary" onClick={openNew}>+ Novo Negócio</button>
                </div>
            </div>
            <div className="page-content">
                <div className="kanban-board">
                    {COLUMNS.map((col) => {
                        const items = negocios.filter((n) => n.status === col.key);
                        return (
                            <div className="kanban-column" key={col.key}>
                                <div className="kanban-column-header">
                                    <h4>{col.icon} {col.label}</h4>
                                    <span className="count">{items.length}</span>
                                </div>
                                <div className="kanban-cards">
                                    {items.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: 16 }}>Vazio</p>
                                    ) : (
                                        items.map((n) => (
                                            <div className="kanban-card" key={n.id}>
                                                <h5>{getClienteNome(n.cliente_id)}</h5>
                                                <p>{TIPO_LABEL[n.tipo] || n.tipo}</p>
                                                {n.valor && <p style={{ color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>R$ {parseFloat(n.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>}
                                                {n.observacoes && <p style={{ marginTop: 4, fontSize: '0.72rem' }}>{n.observacoes}</p>}
                                                <div className="kanban-card-footer">
                                                    <select
                                                        className="form-control"
                                                        style={{ padding: '3px 6px', fontSize: '0.7rem', width: 'auto' }}
                                                        value={n.status}
                                                        onChange={(e) => changeStatus(n.id, e.target.value)}
                                                    >
                                                        {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                                                    </select>
                                                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(n.id)}>🗑️</button>
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

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title="Novo Negócio"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={save}>Salvar</button>
                    </>
                }
            >
                <div className="form-row">
                    <div className="form-group">
                        <label>Cliente *</label>
                        <select className="form-control" value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)}>
                            <option value="">Selecione...</option>
                            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tipo *</label>
                        <select className="form-control" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                            <option value="venda">Venda</option>
                            <option value="locacao">Locação</option>
                            <option value="manutencao">Manutenção</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Valor (R$)</label>
                        <input className="form-control" type="number" value={form.valor} onChange={(e) => set('valor', e.target.value)} placeholder="0,00" />
                    </div>
                    <div className="form-group">
                        <label>Descrição Piano</label>
                        <input className="form-control" value={form.descricao_piano} onChange={(e) => set('descricao_piano', e.target.value)} placeholder="Ex: Yamaha C3" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Local do Evento</label>
                    <input className="form-control" value={form.local_evento} onChange={(e) => set('local_evento', e.target.value)} placeholder="Endereço" />
                </div>
                <div className="form-group">
                    <label>Observações</label>
                    <textarea className="form-control" value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} placeholder="Notas adicionais" />
                </div>
            </Modal>
        </>
    );
}
