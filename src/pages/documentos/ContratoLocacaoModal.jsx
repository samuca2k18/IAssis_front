import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useGerarContratoLocacao } from '../../hooks/useDocumentos';

export default function ContratoLocacaoModal({ open, onClose, negocios, clientes }) {
    const gerarContratoMutation = useGerarContratoLocacao();
    const [contForm, setContForm] = useState({
        negocio_id: '', locatario_nome: '', locatario_endereco: '', locatario_cpf_cnpj: '',
        descricao_piano: '', valor_total: '', data_entrega_dia: '', data_entrega_mes: '',
        local_entrega: '', data_segunda_parcela_dia: '', data_segunda_parcela_mes: '',
        data_contrato_dia: '', data_contrato_mes: '',
    });

    useEffect(() => {
        if (open) {
            setContForm({
                negocio_id: '', locatario_nome: '', locatario_endereco: '', locatario_cpf_cnpj: '',
                descricao_piano: '', valor_total: '', data_entrega_dia: '', data_entrega_mes: '',
                local_entrega: '', data_segunda_parcela_dia: '', data_segunda_parcela_mes: '',
                data_contrato_dia: '', data_contrato_mes: '',
            });
        }
    }, [open]);

    const setC = (k, v) => setContForm((f) => ({ ...f, [k]: v }));

    const getNegocioCliente = (negocioId) => {
        const n = negocios.find((x) => x.id === parseInt(negocioId));
        if (!n) return `Neg #${negocioId}`;
        const c = clientes.find((x) => x.id === n.cliente_id);
        return c ? c.nome : `Cliente #${n.cliente_id}`;
    };

    const saveContrato = async () => {
        if (!contForm.negocio_id) return alert('Selecione um negócio de locação');
        if (!contForm.locatario_nome.trim()) return alert('Nome do locatário é obrigatório');
        if (!contForm.valor_total) return alert('Valor total é obrigatório');

        const data = {
            ...contForm,
            negocio_id: parseInt(contForm.negocio_id),
            valor_total: parseFloat(contForm.valor_total),
        };
        if (!data.locatario_cpf_cnpj) delete data.locatario_cpf_cnpj;

        gerarContratoMutation.mutate(data, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal open={open} onClose={onClose} title="Gerar Contrato de Locação" large
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={gerarContratoMutation.isPending}>Cancelar</button>
                    <button className="btn btn-primary" onClick={saveContrato} disabled={gerarContratoMutation.isPending}>
                        {gerarContratoMutation.isPending ? 'Gerando...' : 'Gerar'}
                    </button>
                </>
            }
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
    );
}
