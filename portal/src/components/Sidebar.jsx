import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, X } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/alunos', icon: Users, label: 'Alunos' },
  { to: '/cursos', icon: BookOpen, label: 'Cursos' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <img src="/portal-gestor/logo-getfuturetoday.png" alt="GetFutureToday" className="sidebar-logo" />
          <button className="sidebar-close btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onClose}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-version">Portal Gestor v1.0</span>
        </div>
      </aside>
    </>
  );
}
