import { useState, useEffect } from 'react';
import { leadsApi } from '../api';
import Modal from '../components/Modal';

const TEMP_BADGE = {
    quente: { label: '🔴 Quente', cls: 'badge-danger' },
    morno: { label: '🟡 Morno', cls: 'badge-warning' },
    frio: { label: '🔵 Frio', cls: 'badge-info' },
};

const STATUS_BADGE = {
    novo: { label: 'Novo', cls: 'badge-neutral' },
    contatado: { label: 'Contatado', cls: 'badge-info' },
    orcamento: { label: 'Orçamento', cls: 'badge-purple' },
    negociacao: { label: 'Negociação', cls: 'badge-warning' },
    convertido: { label: 'Convertido', cls: 'badge-success' },
    perdido: { label: 'Perdido', cls: 'badge-danger' },
};

const EMPTY = { nome: '', telefone: '', origem: '', campanha: '', interesse: '', orcamento_estimado: '', temperatura: 'morno', observacoes: '' };

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [convertModal, setConvertModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [convertForm, setConvertForm] = useState({ nome: '', telefone: '', cidade: '', cpf_cnpj: '', origem: '' });
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTemp, setFilterTemp] = useState('');

    const load = () => {
        setLoading(true);
        leadsApi.listar({ status: filterStatus || undefined, temperatura: filterTemp || undefined })
            .then(setLeads).finally(() => setLoading(false));
    };

    useEffect(load, [filterStatus, filterTemp]);

    const openNew = () => { setForm(EMPTY); setModal(true); };

    const save = async () => {
        const data = { ...form };
        if (data.orcamento_estimado) data.orcamento_estimado = parseFloat(data.orcamento_estimado);
        else delete data.orcamento_estimado;
        if (!data.telefone) delete data.telefone;
        if (!data.origem) delete data.origem;
        if (!data.campanha) delete data.campanha;
        if (!data.interesse) delete data.interesse;
        if (!data.observacoes) delete data.observacoes;
        await leadsApi.criar(data);
        setModal(false);
        load();
    };

    const updateStatus = async (id, status, temperatura) => {
        await leadsApi.atualizarStatus(id, { status, temperatura });
        load();
    };

    const openConvert = (lead) => {
        setConvertModal(lead);
        setConvertForm({ nome: lead.nome, telefone: lead.telefone || '', cidade: '', cpf_cnpj: '', origem: lead.origem || '' });
    };

    const doConvert = async () => {
        await leadsApi.converter(convertModal.id, convertForm);
        setConvertModal(null);
        load();
    };

    const remove = async (id) => {
        if (!confirm('Excluir este lead?')) return;
        await leadsApi.deletar(id);
        load();
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setC = (k, v) => setConvertForm((f) => ({ ...f, [k]: v }));

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Leads</h2>
                        <p>Funil de marketing</p>
                    </div>
                    <button className="btn btn-primary" onClick={openNew}>+ Novo Lead</button>
                </div>
            </div>
            <div className="page-content">
                <div className="filters-bar">
                    <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Todos os status</option>
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="orcamento">Orçamento</option>
                        <option value="negociacao">Negociação</option>
                        <option value="convertido">Convertido</option>
                        <option value="perdido">Perdido</option>
                    </select>
                    <select className="form-control" value={filterTemp} onChange={(e) => setFilterTemp(e.target.value)}>
                        <option value="">Todas temperaturas</option>
                        <option value="quente">🔴 Quente</option>
                        <option value="morno">🟡 Morno</option>
                        <option value="frio">🔵 Frio</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-spinner" />
                ) : leads.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🎯</div>
                        <h3>Nenhum lead encontrado</h3>
                        <p>Crie um novo lead ou ajuste os filtros</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Telefone</th>
                                    <th>Origem</th>
                                    <th>Interesse</th>
                                    <th>Temperatura</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((l) => (
                                    <tr key={l.id}>
                                        <td style={{ fontWeight: 600 }}>{l.nome}</td>
                                        <td>{l.telefone || '—'}</td>
                                        <td>{l.origem || '—'}</td>
                                        <td>{l.interesse || '—'}</td>
                                        <td><span className={`badge ${TEMP_BADGE[l.temperatura]?.cls || 'badge-neutral'}`}>{TEMP_BADGE[l.temperatura]?.label || l.temperatura}</span></td>
                                        <td><span className={`badge ${STATUS_BADGE[l.status]?.cls || 'badge-neutral'}`}>{STATUS_BADGE[l.status]?.label || l.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <select
                                                    className="form-control"
                                                    style={{ width: 120, padding: '4px 8px', fontSize: '0.75rem' }}
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
                                                    <button className="btn btn-success btn-sm" onClick={() => openConvert(l)}>🔄 Converter</button>
                                                )}
                                                <button className="btn btn-danger btn-sm" onClick={() => remove(l.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Novo Lead */}
            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title="Novo Lead"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={save}>Salvar</button>
                    </>
                }
            >
                <div className="form-row">
                    <div className="form-group">
                        <label>Nome *</label>
                        <input className="form-control" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Nome do lead" />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input className="form-control" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(85) 9xxxx-xxxx" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Origem</label>
                        <select className="form-control" value={form.origem} onChange={(e) => set('origem', e.target.value)}>
                            <option value="">Selecione...</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Meta Ads">Meta Ads</option>
                            <option value="Google">Google</option>
                            <option value="Indicação">Indicação</option>
                            <option value="Site">Site</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Interesse</label>
                        <select className="form-control" value={form.interesse} onChange={(e) => set('interesse', e.target.value)}>
                            <option value="">Selecione...</option>
                            <option value="Compra">Compra</option>
                            <option value="Locação">Locação</option>
                            <option value="Manutenção">Manutenção</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Temperatura</label>
                        <select className="form-control" value={form.temperatura} onChange={(e) => set('temperatura', e.target.value)}>
                            <option value="quente">🔴 Quente</option>
                            <option value="morno">🟡 Morno</option>
                            <option value="frio">🔵 Frio</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Orçamento Estimado</label>
                        <input className="form-control" type="number" value={form.orcamento_estimado} onChange={(e) => set('orcamento_estimado', e.target.value)} placeholder="R$" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Campanha</label>
                    <input className="form-control" value={form.campanha} onChange={(e) => set('campanha', e.target.value)} placeholder="Nome da campanha" />
                </div>
                <div className="form-group">
                    <label>Observações</label>
                    <textarea className="form-control" value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} placeholder="Notas adicionais" />
                </div>
            </Modal>

            {/* Modal Converter Lead em Cliente */}
            <Modal
                open={!!convertModal}
                onClose={() => setConvertModal(null)}
                title="Converter Lead em Cliente"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setConvertModal(null)}>Cancelar</button>
                        <button className="btn btn-success" onClick={doConvert}>Converter</button>
                    </>
                }
            >
                <div className="form-row">
                    <div className="form-group">
                        <label>Nome *</label>
                        <input className="form-control" value={convertForm.nome} onChange={(e) => setC('nome', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Telefone *</label>
                        <input className="form-control" value={convertForm.telefone} onChange={(e) => setC('telefone', e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Cidade *</label>
                        <input className="form-control" value={convertForm.cidade} onChange={(e) => setC('cidade', e.target.value)} placeholder="Fortaleza/CE" />
                    </div>
                    <div className="form-group">
                        <label>CPF/CNPJ</label>
                        <input className="form-control" value={convertForm.cpf_cnpj} onChange={(e) => setC('cpf_cnpj', e.target.value)} />
                    </div>
                </div>
            </Modal>
        </>
    );
}
