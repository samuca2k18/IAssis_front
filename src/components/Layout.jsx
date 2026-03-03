import { NavLink, Outlet } from 'react-router-dom';

const nav = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/clientes', icon: '👤', label: 'Clientes' },
    { to: '/leads', icon: '🎯', label: 'Leads' },
    { to: '/negocios', icon: '🎹', label: 'Negócios' },
    { to: '/documentos', icon: '📄', label: 'Documentos' },
    { to: '/campanhas', icon: '📢', label: 'Campanhas' },
    { to: '/agenda', icon: '📅', label: 'Agenda' },
];

export default function Layout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">iA</div>
                    <div>
                        <h1>IAssis</h1>
                        <small>Assis Pianos CRM</small>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {nav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="main-area">
                <Outlet />
            </main>
        </div>
    );
}
