import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useCreateEvento } from '../../hooks/useAgendaDashboard';

const EMPTY = { titulo: '', descricao: '', data_hora: '', tipo: 'outro', cliente_id: '' };

export default function EventoFormModal({ open, onClose, clientes }) {
    const createMutation = useCreateEvento();
    const [form, setForm] = useState(EMPTY);

    useEffect(() => {
        if (open) {
            setForm(EMPTY);
        }
    }, [open]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        if (!form.titulo.trim()) return alert('Título é obrigatório');
        if (!form.data_hora) return alert('Data e hora são obrigatórias');
        const data = { ...form };
        // Garantir formato ISO completo (datetime-local não inclui segundos)
        if (data.data_hora && data.data_hora.length === 16) {
            data.data_hora = data.data_hora + ':00';
        }
        if (!data.descricao) delete data.descricao;
        if (data.cliente_id) data.cliente_id = parseInt(data.cliente_id);
        else delete data.cliente_id;

        createMutation.mutate(data, {
            onSuccess: () => onClose(),
            onError: (e) => alert('Erro: ' + e.message)
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Novo Evento"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={createMutation.isPending}>Cancelar</button>
                    <button className="btn btn-primary" onClick={save} disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </>
            }
        >
            <div className="form-group">
                <label>Título *</label>
                <input className="form-control" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Afinação Piano - João" />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Data e Hora *</label>
                    <input className="form-control" type="datetime-local" value={form.data_hora} onChange={(e) => set('data_hora', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Tipo</label>
                    <select className="form-control" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                        <option value="entrega">📦 Entrega</option>
                        <option value="evento">🎵 Evento</option>
                        <option value="manutencao">🔧 Manutenção</option>
                        <option value="afinacao">🎹 Afinação</option>
                        <option value="followup">📞 Follow-up</option>
                        <option value="outro">📌 Outro</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label>Cliente (opcional)</label>
                <select className="form-control" value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)}>
                    <option value="">Nenhum</option>
                    {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <textarea className="form-control" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Detalhes do evento" />
            </div>
        </Modal>
    );
}
