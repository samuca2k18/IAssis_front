import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import LeadsPage from './pages/LeadsPage';
import NegociosPage from './pages/NegociosPage';
import DocumentosPage from './pages/DocumentosPage';
import CampanhasPage from './pages/CampanhasPage';
import AgendaPage from './pages/AgendaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/negocios" element={<NegociosPage />} />
          <Route path="/documentos" element={<DocumentosPage />} />
          <Route path="/campanhas" element={<CampanhasPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
