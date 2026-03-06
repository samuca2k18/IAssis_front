import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useConvertLead } from '../../hooks/useLeads';

export default function LeadConvertModal({ lead, onClose }) {
    const convertMutation = useConvertLead();
    const [convertForm, setConvertForm] = useState({ nome: '', telefone: '', cidade: '', cpf_cnpj: '', origem: '' });

    useEffect(() => {
        if (lead) {
            setConvertForm({ nome: lead.nome, telefone: lead.telefone || '', cidade: '', cpf_cnpj: '', origem: lead.origem || '' });
        }
    }, [lead]);

    const setC = (k, v) => setConvertForm((f) => ({ ...f, [k]: v }));

    const doConvert = () => {
        if (!convertForm.nome.trim()) return alert('Nome é obrigatório');
        if (!convertForm.telefone.trim()) return alert('Telefone é obrigatório');
        if (!convertForm.cidade.trim()) return alert('Cidade é obrigatória');

        convertMutation.mutate({ id: lead.id, clienteData: convertForm }, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal
            open={!!lead}
            onClose={onClose}
            title="Converter Lead em Cliente"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={convertMutation.isPending}>Cancelar</button>
                    <button className="btn btn-success" onClick={doConvert} disabled={convertMutation.isPending}>
                        {convertMutation.isPending ? 'Convertendo...' : 'Converter'}
                    </button>
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
    );
}
