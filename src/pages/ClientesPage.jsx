import { useState, useEffect } from 'react';
import { clientesApi } from '../api';
import Modal from '../components/Modal';

const EMPTY = { nome: '', telefone: '', cidade: '', cpf_cnpj: '', origem: '', tipo_pessoa: 'fisica' };

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const load = () => {
        setLoading(true);
        clientesApi.listar().then(setClientes).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (c) => { setEditing(c); setForm({ nome: c.nome, telefone: c.telefone, cidade: c.cidade, cpf_cnpj: c.cpf_cnpj || '', origem: c.origem || '', tipo_pessoa: c.tipo_pessoa }); setModal(true); };

    const save = async () => {
        if (editing) {
            await clientesApi.atualizar(editing.id, form);
        } else {
            await clientesApi.criar(form);
        }
        setModal(false);
        load();
    };

    const remove = async (id) => {
        if (!confirm('Excluir este cliente?')) return;
        await clientesApi.deletar(id);
        load();
    };

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Clientes</h2>
                        <p>Gerencie sua base de clientes</p>
                    </div>
                    <button className="btn btn-primary" onClick={openNew}>+ Novo Cliente</button>
                </div>
            </div>
            <div className="page-content">
                {loading ? (
                    <div className="loading-spinner" />
                ) : clientes.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">👤</div>
                        <h3>Nenhum cliente cadastrado</h3>
                        <p>Clique em "+ Novo Cliente" para começar</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Telefone</th>
                                    <th>Cidade</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Origem</th>
                                    <th>Tipo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 600 }}>{c.nome}</td>
                                        <td>{c.telefone}</td>
                                        <td>{c.cidade}</td>
                                        <td>{c.cpf_cnpj || '—'}</td>
                                        <td>{c.origem || '—'}</td>
                                        <td><span className="badge badge-accent">{c.tipo_pessoa}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️ Editar</button>
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
                title={editing ? 'Editar Cliente' : 'Novo Cliente'}
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
                        <input className="form-control" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Nome completo" />
                    </div>
                    <div className="form-group">
                        <label>Telefone *</label>
                        <input className="form-control" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(85) 9xxxx-xxxx" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Cidade *</label>
                        <input className="form-control" value={form.cidade} onChange={(e) => set('cidade', e.target.value)} placeholder="Fortaleza/CE" />
                    </div>
                    <div className="form-group">
                        <label>CPF/CNPJ</label>
                        <input className="form-control" value={form.cpf_cnpj} onChange={(e) => set('cpf_cnpj', e.target.value)} placeholder="000.000.000-00" />
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
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tipo Pessoa</label>
                        <select className="form-control" value={form.tipo_pessoa} onChange={(e) => set('tipo_pessoa', e.target.value)}>
                            <option value="fisica">Pessoa Física</option>
                            <option value="juridica">Pessoa Jurídica</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </>
    );
}
