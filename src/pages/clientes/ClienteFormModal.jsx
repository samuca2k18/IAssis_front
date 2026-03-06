import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useCreateCliente, useUpdateCliente } from '../../hooks/useClientes';

const EMPTY = { nome: '', telefone: '', cidade: '', cpf_cnpj: '', origem: '', tipo_pessoa: 'fisica' };

export default function ClienteFormModal({ open, onClose, editing }) {
    const createMutation = useCreateCliente();
    const updateMutation = useUpdateCliente();

    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        if (open) {
            if (editing) {
                setForm({
                    nome: editing.nome,
                    telefone: editing.telefone,
                    cidade: editing.cidade,
                    cpf_cnpj: editing.cpf_cnpj || '',
                    origem: editing.origem || '',
                    tipo_pessoa: editing.tipo_pessoa
                });
            } else {
                setForm(EMPTY);
            }
        }
    }, [open, editing]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        if (editing) {
            updateMutation.mutate({ id: editing.id, data: form }, { onSuccess: () => onClose() });
        } else {
            createMutation.mutate(form, { onSuccess: () => onClose() });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? 'Editar Cliente' : 'Novo Cliente'}
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
                    <button className="btn btn-primary" onClick={save} disabled={isPending}>
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
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
    );
}
