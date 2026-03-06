import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useCreateLead } from '../../hooks/useLeads';

const EMPTY = { nome: '', telefone: '', origem: '', campanha: '', interesse: '', orcamento_estimado: '', temperatura: 'morno', observacoes: '' };

export default function LeadFormModal({ open, onClose }) {
    const createMutation = useCreateLead();
    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        if (open) {
            setForm(EMPTY);
        }
    }, [open]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        const data = { ...form };
        if (data.orcamento_estimado) data.orcamento_estimado = parseFloat(data.orcamento_estimado);
        else delete data.orcamento_estimado;
        if (!data.telefone) delete data.telefone;
        if (!data.origem) delete data.origem;
        if (!data.campanha) delete data.campanha;
        if (!data.interesse) delete data.interesse;
        if (!data.observacoes) delete data.observacoes;

        createMutation.mutate(data, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Novo Lead"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={createMutation.isPending}>Cancelar</button>
                    <button className="btn btn-primary" onClick={save} disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Salvando...' : 'Salvar'}
                    </button>
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
    );
}
