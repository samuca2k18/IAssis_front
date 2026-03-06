import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useCreateCampanha, useUpdateCampanha } from '../../hooks/useCampanhas';

const EMPTY = { nome: '', plataforma: '', investimento: '0', leads_gerados: '0', vendas: '0', receita: '0', status: 'ativa', observacoes: '' };

export default function CampanhaFormModal({ open, onClose, editing }) {
    const createMutation = useCreateCampanha();
    const updateMutation = useUpdateCampanha();

    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        if (open) {
            if (editing) {
                setForm({
                    nome: editing.nome, plataforma: editing.plataforma,
                    investimento: String(editing.investimento), leads_gerados: String(editing.leads_gerados),
                    vendas: String(editing.vendas), receita: String(editing.receita), status: editing.status,
                    observacoes: editing.observacoes || '',
                });
            } else {
                setForm(EMPTY);
            }
        }
    }, [open, editing]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        const data = {
            ...form,
            investimento: parseFloat(form.investimento) || 0,
            leads_gerados: parseInt(form.leads_gerados) || 0,
            vendas: parseInt(form.vendas) || 0,
            receita: parseFloat(form.receita) || 0,
        };
        if (!data.observacoes) delete data.observacoes;

        if (editing) {
            updateMutation.mutate({
                id: editing.id, data: {
                    investimento: data.investimento, leads_gerados: data.leads_gerados,
                    vendas: data.vendas, receita: data.receita, status: data.status,
                    observacoes: data.observacoes,
                }
            }, { onSuccess: () => onClose() });
        } else {
            createMutation.mutate(data, { onSuccess: () => onClose() });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? 'Editar Campanha' : 'Nova Campanha'}
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
                    <input className="form-control" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Black Friday Pianos" disabled={!!editing} />
                </div>
                <div className="form-group">
                    <label>Plataforma *</label>
                    <select className="form-control" value={form.plataforma} onChange={(e) => set('plataforma', e.target.value)} disabled={!!editing}>
                        <option value="">Selecione...</option>
                        <option value="Meta">Meta</option>
                        <option value="Google">Google</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group"><label>Investimento (R$)</label><input className="form-control" type="number" value={form.investimento} onChange={(e) => set('investimento', e.target.value)} /></div>
                <div className="form-group"><label>Leads Gerados</label><input className="form-control" type="number" value={form.leads_gerados} onChange={(e) => set('leads_gerados', e.target.value)} /></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label>Vendas</label><input className="form-control" type="number" value={form.vendas} onChange={(e) => set('vendas', e.target.value)} /></div>
                <div className="form-group"><label>Receita (R$)</label><input className="form-control" type="number" value={form.receita} onChange={(e) => set('receita', e.target.value)} /></div>
            </div>
            <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="encerrada">Encerrada</option>
                </select>
            </div>
            <div className="form-group">
                <label>Observações</label>
                <textarea className="form-control" value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} />
            </div>
        </Modal>
    );
}
