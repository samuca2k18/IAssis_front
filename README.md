# IAssis Pianos — Frontend

> Painel de controle web da **Assis Pianos**  
> Tech: **React · Vite · Tailwind CSS · shadcn/ui**

---

## Páginas

| Página | Rota | Descrição |
|---|---|---|
| Dashboard | `/` | KPIs, receita, pipeline e agenda do dia |
| Clientes | `/clientes` | Cadastro e listagem de clientes |
| Leads | `/leads` | Pipeline de marketing com filtros |
| Negócios | `/negocios` | Funil de vendas |
| Documentos | `/documentos` | Gerar e baixar PDFs (orçamento, recibo, contrato) |
| Agenda | `/agenda` | Agendamentos de serviços |
| Campanhas | `/campanhas` | Campanhas de marketing |

---

## Rodar localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar `.env`
```bash
# Crie um arquivo .env na raiz com:
VITE_API_URL=http://IP_DO_BACKEND:8000
```

> Por padrão, sem `.env`, o frontend aponta para `http://147.15.19.110:8000`.

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:5173**

---

## Estrutura do projeto

```
src/
├── api.js              # Todas as chamadas HTTP para o backend
├── App.jsx             # Rotas principais (React Router)
├── index.css           # Design system global (CSS variables + Tailwind)
├── pages/
│   ├── DashboardPage.jsx
│   ├── ClientesPage.jsx
│   ├── LeadsPage.jsx
│   ├── NegociosPage.jsx
│   ├── DocumentosPage.jsx
│   ├── AgendaPage.jsx
│   └── CampanhasPage.jsx
└── components/         # Componentes reutilizáveis (modais, tabelas, etc.)
```

---

## Conexão com o Backend

Todas as chamadas ao backend estão centralizadas em `src/api.js`:

```js
// Configurar a URL base
const API_BASE = import.meta.env.VITE_API_URL || 'http://147.15.19.110:8000';
```

### APIs disponíveis

| Módulo | Objeto exportado |
|---|---|
| Clientes | `clientesApi` |
| Leads | `leadsApi` |
| Negócios | `negociosApi` |
| Documentos | `documentosApi` |
| Campanhas | `campanhasApi` |
| Agenda | `agendaApi` |
| Dashboard | `dashboardApi` |

**Exemplo de uso:**
```js
import { clientesApi } from '../api';

// Listar todos
const clientes = await clientesApi.listar();

// Criar
await clientesApi.criar({
  nome: 'João Silva',
  telefone: '85999990000',
  cidade: 'Fortaleza',
});
```

---

## Download de PDFs

```js
import { documentosApi } from '../api';

// Gerar orçamento (retorna o documento criado)
const doc = await documentosApi.gerarOrcamento({ negocio_id: 1, ... });

// Obter URL do PDF para abrir/baixar
const pdfUrl = documentosApi.downloadOrcamentoPdf(doc.id);
window.open(pdfUrl);
```

---

## Build de produção

```bash
npm run build
# Arquivos gerados em /dist
```

O projeto está configurado com `vercel.json` para deploy na **Vercel**:
```bash
vercel --prod
```

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base do backend FastAPI | `http://147.15.19.110:8000` |
