import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useGerarOrcamento } from '../../hooks/useDocumentos';

export default function OrcamentoModal({ open, onClose, negocios, clientes }) {
    const gerarOrcamentoMutation = useGerarOrcamento();
    const [orcForm, setOrcForm] = useState({
        negocio_id: '', cliente_nome: '', cliente_telefone: '', cliente_cidade: '',
        cliente_cpf_cnpj: '', condicoes_pagamento: '40% na retirada e restante na entrega',
        prazo_entrega_dias: '60', itens: [{ descricao: '', valor: '' }],
    });

    useEffect(() => {
        if (open) {
            setOrcForm({
                negocio_id: '', cliente_nome: '', cliente_telefone: '', cliente_cidade: '',
                cliente_cpf_cnpj: '', condicoes_pagamento: '40% na retirada e restante na entrega',
                prazo_entrega_dias: '60', itens: [{ descricao: '', valor: '' }],
            });
        }
    }, [open]);

    const setO = (k, v) => setOrcForm((f) => ({ ...f, [k]: v }));
    const addItem = () => setOrcForm((f) => ({ ...f, itens: [...f.itens, { descricao: '', valor: '' }] }));
    const removeItem = (i) => setOrcForm((f) => ({ ...f, itens: f.itens.filter((_, idx) => idx !== i) }));
    const setItem = (i, k, v) => setOrcForm((f) => {
        const itens = [...f.itens];
        itens[i] = { ...itens[i], [k]: v };
        return { ...f, itens };
    });

    const getNegocioCliente = (negocioId) => {
        const n = negocios.find((x) => x.id === parseInt(negocioId));
        if (!n) return `Neg #${negocioId}`;
        const c = clientes.find((x) => x.id === n.cliente_id);
        return c ? c.nome : `Cliente #${n.cliente_id}`;
    };

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

    const saveOrcamento = async () => {
        if (!orcForm.negocio_id) return alert('Selecione um negócio');
        if (!orcForm.cliente_nome.trim()) return alert('Nome do cliente é obrigatório');
        if (!orcForm.cliente_telefone.trim()) return alert('Telefone é obrigatório');
        if (!orcForm.cliente_cidade.trim()) return alert('Cidade é obrigatória');
        const itensFilled = orcForm.itens.every((i) => i.descricao.trim() && parseFloat(i.valor) > 0);
        if (!itensFilled) return alert('Preencha descrição e valor de todos os itens');

        const data = {
            ...orcForm,
            negocio_id: parseInt(orcForm.negocio_id),
            prazo_entrega_dias: orcForm.prazo_entrega_dias ? parseInt(orcForm.prazo_entrega_dias) : null,
            itens: orcForm.itens.map((i) => ({ descricao: i.descricao, valor: parseFloat(i.valor) })),
        };
        if (!data.cliente_cpf_cnpj) delete data.cliente_cpf_cnpj;

        gerarOrcamentoMutation.mutate(data, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal open={open} onClose={onClose} title="Gerar Orçamento" large
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={gerarOrcamentoMutation.isPending}>Cancelar</button>
                    <button className="btn btn-primary" onClick={saveOrcamento} disabled={gerarOrcamentoMutation.isPending}>
                        {gerarOrcamentoMutation.isPending ? 'Gerando...' : 'Gerar'}
                    </button>
                </>
            }
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
    );
}
