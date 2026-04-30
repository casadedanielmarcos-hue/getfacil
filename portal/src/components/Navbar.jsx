import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { gestor, logout } = useAuth();

  return (
    <header className="navbar">
      <button className="navbar-menu btn-icon" onClick={onMenuClick}>
        <Menu size={22} />
      </button>
      <div className="navbar-right">
        <span className="navbar-user">{gestor?.nome || gestor?.email || 'Gestor'}</span>
        <button className="navbar-logout" onClick={logout}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
