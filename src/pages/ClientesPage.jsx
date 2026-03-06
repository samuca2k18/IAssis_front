import { useState } from 'react';
import { useClientes, useDeleteCliente } from '../hooks/useClientes';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ClienteFormModal from './clientes/ClienteFormModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Pencil, Trash2, Plus } from 'lucide-react';

export default function ClientesPage() {
    const { data: clientes = [], isLoading: loading } = useClientes();
    const deleteMutation = useDeleteCliente();

    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const openNew = () => { setEditing(null); setModal(true); };
    const openEdit = (c) => { setEditing(c); setModal(true); };

    const remove = (id) => {
        if (!confirm('Excluir este cliente?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <>
            <PageHeader
                title="Clientes"
                description="Gerencie sua base de clientes"
                action={
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="h-4 w-4" /> Novo Cliente
                    </Button>
                }
            />

            <div className="px-8 pb-8">
                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    </div>
                ) : clientes.length === 0 ? (
                    <EmptyState
                        icon={<Users className="h-16 w-16 text-muted-foreground opacity-50" />}
                        title="Nenhum cliente cadastrado"
                        description='Clique em "+ Novo Cliente" para começar'
                    />
                ) : (
                    <div className="rounded-md border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Cidade</TableHead>
                                    <TableHead>CPF/CNPJ</TableHead>
                                    <TableHead>Origem</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientes.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.nome}</TableCell>
                                        <TableCell>{c.telefone}</TableCell>
                                        <TableCell>{c.cidade}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.cpf_cnpj || '—'}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.origem || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                {c.tipo_pessoa}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => openEdit(c)} className="gap-1.5 h-8">
                                                    <Pencil className="h-3.5 w-3.5" /> Editar
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => remove(c.id)} className="h-8 px-2">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <ClienteFormModal
                open={modal}
                onClose={() => setModal(false)}
                editing={editing}
            />
        </>
    );
}
