import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useCreateNegocio } from '../../hooks/useNegocios';

const EMPTY = { cliente_id: '', tipo: 'manutencao', valor: '', observacoes: '', descricao_piano: '', local_evento: '' };

export default function NegocioFormModal({ open, onClose, clientes }) {
    const createMutation = useCreateNegocio();
    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        if (open) {
            setForm(EMPTY);
        }
    }, [open]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        const data = { ...form, cliente_id: parseInt(form.cliente_id) };
        if (data.valor) data.valor = parseFloat(data.valor);
        else delete data.valor;
        if (!data.observacoes) delete data.observacoes;
        if (!data.descricao_piano) delete data.descricao_piano;
        if (!data.local_evento) delete data.local_evento;

        createMutation.mutate(data, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Novo Negócio"
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
    );
}
