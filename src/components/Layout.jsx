import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Target,
    Piano,
    FileText,
    Megaphone,
    Calendar
} from 'lucide-react';

const nav = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/leads', icon: Target, label: 'Leads' },
    { to: '/negocios', icon: Piano, label: 'Negócios' },
    { to: '/documentos', icon: FileText, label: 'Documentos' },
    { to: '/campanhas', icon: Megaphone, label: 'Campanhas' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
];

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-secondary transition-transform">
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#e8c94c] font-black tracking-tighter text-[#0f1117] shadow-[0_0_20px_var(--accent-glow)]">
                        iA
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-foreground">IAssis</h1>
                        <small className="text-xs font-medium text-muted-foreground">Assis Pianos CRM</small>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {nav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Area */}
            <main className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
