const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const res = await fetch(url, config);
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = err.detail;
    const msg = Array.isArray(detail)
      ? detail.map((e) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(', ')
      : (detail || 'Erro na requisição');
    throw new Error(msg);
  }
  return res.json();
}

// ─── CLIENTES ───
export const clientesApi = {
  listar: () => request('/clientes'),
  buscar: (id) => request(`/clientes/${id}`),
  criar: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  atualizar: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
};

// ─── LEADS ───
export const leadsApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.temperatura) qs.set('temperatura', params.temperatura);
    const q = qs.toString();
    return request(`/leads${q ? '?' + q : ''}`);
  },
  criar: (data) => request('/leads', { method: 'POST', body: JSON.stringify(data) }),
  atualizarStatus: (id, data) => request(`/leads/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  converter: (id, clienteData) => request(`/leads/${id}/converter`, { method: 'PUT', body: JSON.stringify(clienteData) }),
  deletar: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
};

// ─── NEGÓCIOS ───
export const negociosApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.tipo) qs.set('tipo', params.tipo);
    if (params.cliente_id) qs.set('cliente_id', params.cliente_id);
    const q = qs.toString();
    return request(`/negocios${q ? '?' + q : ''}`);
  },
  buscar: (id) => request(`/negocios/${id}`),
  criar: (data) => request('/negocios', { method: 'POST', body: JSON.stringify(data) }),
  atualizarStatus: (id, status) => request(`/negocios/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deletar: (id) => request(`/negocios/${id}`, { method: 'DELETE' }),
};

// ─── DOCUMENTOS ───
export const documentosApi = {
  listar: () => request('/documentos'),
  listarPorNegocio: (negocioId) => request(`/documentos/negocio/${negocioId}`),
  gerarOrcamento: (data) => request('/documentos/orcamento', { method: 'POST', body: JSON.stringify(data) }),
  gerarContratoLocacao: (data) => request('/documentos/contrato-locacao', { method: 'POST', body: JSON.stringify(data) }),
  downloadOrcamentoPdf: (docId) => `${API_BASE}/documentos/orcamento/${docId}/pdf`,
  downloadContratoPdf: (docId) => `${API_BASE}/documentos/contrato-locacao/${docId}/pdf`,
};

// ─── CAMPANHAS ───
export const campanhasApi = {
  listar: () => request('/campanhas'),
  criar: (data) => request('/campanhas', { method: 'POST', body: JSON.stringify(data) }),
  atualizar: (id, data) => request(`/campanhas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: (id) => request(`/campanhas/${id}`, { method: 'DELETE' }),
};

// ─── AGENDA ───
export const agendaApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.apenas_pendentes) qs.set('apenas_pendentes', 'true');
    if (params.tipo) qs.set('tipo', params.tipo);
    const q = qs.toString();
    return request(`/agenda${q ? '?' + q : ''}`);
  },
  criar: (data) => request('/agenda', { method: 'POST', body: JSON.stringify(data) }),
  concluir: (id) => request(`/agenda/${id}/concluir`, { method: 'PUT' }),
  deletar: (id) => request(`/agenda/${id}`, { method: 'DELETE' }),
};

// ─── DASHBOARD ───
export const dashboardApi = {
  get: () => request('/dashboard'),
};
