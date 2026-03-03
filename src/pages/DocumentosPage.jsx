import { useState, useEffect } from 'react';
import { documentosApi, negociosApi, clientesApi } from '../api';
import Modal from '../components/Modal';

export default function DocumentosPage() {
    const [docs, setDocs] = useState([]);
    const [negocios, setNegocios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orcModal, setOrcModal] = useState(false);
    const [contModal, setContModal] = useState(false);

    const [orcForm, setOrcForm] = useState({
        negocio_id: '', cliente_nome: '', cliente_telefone: '', cliente_cidade: '',
        cliente_cpf_cnpj: '', condicoes_pagamento: '40% na retirada e restante na entrega',
        prazo_entrega_dias: '60', itens: [{ descricao: '', valor: '' }],
    });

    const [contForm, setContForm] = useState({
        negocio_id: '', locatario_nome: '', locatario_endereco: '', locatario_cpf_cnpj: '',
        descricao_piano: '', valor_total: '', data_entrega_dia: '', data_entrega_mes: '',
        local_entrega: '', data_segunda_parcela_dia: '', data_segunda_parcela_mes: '',
        data_contrato_dia: '', data_contrato_mes: '',
    });

    const load = () => {
        setLoading(true);
        Promise.all([documentosApi.listar(), negociosApi.listar(), clientesApi.listar()])
            .then(([d, n, c]) => { setDocs(d); setNegocios(n); setClientes(c); })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    // ─── Orçamento handlers ───
    const setO = (k, v) => setOrcForm((f) => ({ ...f, [k]: v }));
    const addItem = () => setOrcForm((f) => ({ ...f, itens: [...f.itens, { descricao: '', valor: '' }] }));
    const removeItem = (i) => setOrcForm((f) => ({ ...f, itens: f.itens.filter((_, idx) => idx !== i) }));
    const setItem = (i, k, v) => setOrcForm((f) => {
        const itens = [...f.itens];
        itens[i] = { ...itens[i], [k]: v };
        return { ...f, itens };
    });

    const saveOrcamento = async () => {
        const data = {
            ...orcForm,
            negocio_id: parseInt(orcForm.negocio_id),
            prazo_entrega_dias: orcForm.prazo_entrega_dias ? parseInt(orcForm.prazo_entrega_dias) : null,
            itens: orcForm.itens.map((i) => ({ descricao: i.descricao, valor: parseFloat(i.valor) })),
        };
        if (!data.cliente_cpf_cnpj) delete data.cliente_cpf_cnpj;
        await documentosApi.gerarOrcamento(data);
        setOrcModal(false);
        load();
    };

    // ─── Contrato handlers ───
    const setC = (k, v) => setContForm((f) => ({ ...f, [k]: v }));

    const saveContrato = async () => {
        const data = { ...contForm, negocio_id: parseInt(contForm.negocio_id), valor_total: parseFloat(contForm.valor_total) };
        if (!data.locatario_cpf_cnpj) delete data.locatario_cpf_cnpj;
        await documentosApi.gerarContratoLocacao(data);
        setContModal(false);
        load();
    };

    const openOrcamento = () => {
        setOrcForm({
            negocio_id: '', cliente_nome: '', cliente_telefone: '', cliente_cidade: '',
            cliente_cpf_cnpj: '', condicoes_pagamento: '40% na retirada e restante na entrega',
            prazo_entrega_dias: '60', itens: [{ descricao: '', valor: '' }],
        });
        setOrcModal(true);
    };

    const openContrato = () => {
        setContForm({
            negocio_id: '', locatario_nome: '', locatario_endereco: '', locatario_cpf_cnpj: '',
            descricao_piano: '', valor_total: '', data_entrega_dia: '', data_entrega_mes: '',
            local_entrega: '', data_segunda_parcela_dia: '', data_segunda_parcela_mes: '',
            data_contrato_dia: '', data_contrato_mes: '',
        });
        setContModal(true);
    };

    const downloadUrl = (doc) => {
        if (doc.tipo === 'orcamento') return documentosApi.downloadOrcamentoPdf(doc.id);
        if (doc.tipo === 'contrato_locacao') return documentosApi.downloadContratoPdf(doc.id);
        return null;
    };

    const tipoLabel = { orcamento: '📋 Orçamento', contrato_locacao: '📜 Contrato Locação', recibo: '🧾 Recibo', proposta: '📝 Proposta' };

    const getNegocioCliente = (negocioId) => {
        const n = negocios.find((x) => x.id === negocioId);
        if (!n) return `Neg #${negocioId}`;
        const c = clientes.find((x) => x.id === n.cliente_id);
        return c ? c.nome : `Cliente #${n.cliente_id}`;
    };

    // Auto-fill client data when negocio is selected in orc form
    const onOrcNegocioChange = (negocioId) => {
        setO('negocio_id', negocioId);
        const n = negocios.find((x) => x.id === parseInt(negocioId));
        if (n) {
            const c = clientes.find((x) => x.id === n.cliente_id);
            if (c) {
                setOrcForm((f) => ({
                    ...f, negocio_id: negocioId,
                    cliente_nome: c.nome, cliente_telefone: c.telefone, cliente_cidade: c.cidade,
                    cliente_cpf_cnpj: c.cpf_cnpj || '',
                }));
            }
        }
    };

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Documentos</h2>
                        <p>Orçamentos e contratos</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-primary" onClick={openOrcamento}>+ Orçamento</button>
                        <button className="btn btn-secondary" onClick={openContrato}>+ Contrato Locação</button>
                    </div>
                </div>
            </div>
            <div className="page-content">
                {loading ? (
                    <div className="loading-spinner" />
                ) : docs.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📄</div>
                        <h3>Nenhum documento gerado</h3>
                        <p>Gere um orçamento ou contrato para começar</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Cliente</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((d) => (
                                    <tr key={d.id}>
                                        <td>#{d.id}</td>
                                        <td><span className="badge badge-accent">{tipoLabel[d.tipo] || d.tipo}</span></td>
                                        <td style={{ fontWeight: 600 }}>{getNegocioCliente(d.negocio_id)}</td>
                                        <td>{new Date(d.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {downloadUrl(d) && (
                                                <a href={downloadUrl(d)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">⬇️ PDF</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Orçamento */}
            <Modal open={orcModal} onClose={() => setOrcModal(false)} title="Gerar Orçamento" large
                footer={<><button className="btn btn-secondary" onClick={() => setOrcModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={saveOrcamento}>Gerar</button></>}
            >
                <div className="form-group">
                    <label>Negócio *</label>
                    <select className="form-control" value={orcForm.negocio_id} onChange={(e) => onOrcNegocioChange(e.target.value)}>
                        <option value="">Selecione o negócio...</option>
                        {negocios.map((n) => <option key={n.id} value={n.id}>#{n.id} — {getNegocioCliente(n.id)} ({n.tipo})</option>)}
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Nome do Cliente *</label><input className="form-control" value={orcForm.cliente_nome} onChange={(e) => setO('cliente_nome', e.target.value)} /></div>
                    <div className="form-group"><label>Telefone *</label><input className="form-control" value={orcForm.cliente_telefone} onChange={(e) => setO('cliente_telefone', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Cidade *</label><input className="form-control" value={orcForm.cliente_cidade} onChange={(e) => setO('cliente_cidade', e.target.value)} /></div>
                    <div className="form-group"><label>CPF/CNPJ</label><input className="form-control" value={orcForm.cliente_cpf_cnpj} onChange={(e) => setO('cliente_cpf_cnpj', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Condições de Pagamento</label><input className="form-control" value={orcForm.condicoes_pagamento} onChange={(e) => setO('condicoes_pagamento', e.target.value)} /></div>
                    <div className="form-group"><label>Prazo Entrega (dias)</label><input className="form-control" type="number" value={orcForm.prazo_entrega_dias} onChange={(e) => setO('prazo_entrega_dias', e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Itens do Orçamento *</label>
                    <div className="doc-items-list">
                        {orcForm.itens.map((item, i) => (
                            <div className="doc-item-row" key={i}>
                                <input className="form-control" placeholder="Descrição do serviço" value={item.descricao} onChange={(e) => setItem(i, 'descricao', e.target.value)} />
                                <input className="form-control valor-input" type="number" placeholder="Valor R$" value={item.valor} onChange={(e) => setItem(i, 'valor', e.target.value)} />
                                {orcForm.itens.length > 1 && <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeItem(i)}>✕</button>}
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={addItem}>+ Adicionar Item</button>
                </div>
            </Modal>

            {/* Modal Contrato Locação */}
            <Modal open={contModal} onClose={() => setContModal(false)} title="Gerar Contrato de Locação" large
                footer={<><button className="btn btn-secondary" onClick={() => setContModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={saveContrato}>Gerar</button></>}
            >
                <div className="form-group">
                    <label>Negócio (tipo locação) *</label>
                    <select className="form-control" value={contForm.negocio_id} onChange={(e) => setC('negocio_id', e.target.value)}>
                        <option value="">Selecione...</option>
                        {negocios.filter((n) => n.tipo === 'locacao').map((n) => <option key={n.id} value={n.id}>#{n.id} — {getNegocioCliente(n.id)}</option>)}
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Locatário *</label><input className="form-control" value={contForm.locatario_nome} onChange={(e) => setC('locatario_nome', e.target.value)} /></div>
                    <div className="form-group"><label>Endereço Locatário *</label><input className="form-control" value={contForm.locatario_endereco} onChange={(e) => setC('locatario_endereco', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Descrição Piano *</label><input className="form-control" value={contForm.descricao_piano} onChange={(e) => setC('descricao_piano', e.target.value)} placeholder="Piano meia cauda Yamaha C3" /></div>
                    <div className="form-group"><label>Valor Total (R$) *</label><input className="form-control" type="number" value={contForm.valor_total} onChange={(e) => setC('valor_total', e.target.value)} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Dia Entrega *</label><input className="form-control" value={contForm.data_entrega_dia} onChange={(e) => setC('data_entrega_dia', e.target.value)} placeholder="15" /></div>
                    <div className="form-group"><label>Mês Entrega *</label><input className="form-control" value={contForm.data_entrega_mes} onChange={(e) => setC('data_entrega_mes', e.target.value)} placeholder="março" /></div>
                </div>
                <div className="form-group"><label>Local de Entrega *</label><input className="form-control" value={contForm.local_entrega} onChange={(e) => setC('local_entrega', e.target.value)} /></div>
                <div className="form-row">
                    <div className="form-group"><label>Dia 2ª Parcela *</label><input className="form-control" value={contForm.data_segunda_parcela_dia} onChange={(e) => setC('data_segunda_parcela_dia', e.target.value)} placeholder="15" /></div>
                    <div className="form-group"><label>Mês 2ª Parcela *</label><input className="form-control" value={contForm.data_segunda_parcela_mes} onChange={(e) => setC('data_segunda_parcela_mes', e.target.value)} placeholder="março" /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Dia Contrato *</label><input className="form-control" value={contForm.data_contrato_dia} onChange={(e) => setC('data_contrato_dia', e.target.value)} placeholder="03" /></div>
                    <div className="form-group"><label>Mês Contrato *</label><input className="form-control" value={contForm.data_contrato_mes} onChange={(e) => setC('data_contrato_mes', e.target.value)} placeholder="março" /></div>
                </div>
            </Modal>
        </>
    );
}
