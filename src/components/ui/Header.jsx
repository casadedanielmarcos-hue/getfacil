import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from './index';
import { LogOut, GraduationCap } from 'lucide-react';

export function Header() {
  const { user, userType, logout } = useAuth();

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md) var(--space-lg)',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const logoIconStyle = {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  };

  const logoTextStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-800) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)'
  };

  const userInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  };

  const userNameStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  const userTypeStyle = {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'capitalize'
  };

  const logoutBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--blue-50)',
    color: 'var(--blue-600)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <div style={logoIconStyle}>
          <GraduationCap size={20} />
        </div>
        <span style={logoTextStyle}>Get Fácil</span>
      </div>

      <div style={userSectionStyle}>
        <div style={userInfoStyle}>
          <span style={userNameStyle}>{user?.nome}</span>
          <span style={userTypeStyle}>{userType}</span>
        </div>
        <Avatar name={user?.nome || 'U'} size="small" />
        <button 
          style={logoutBtnStyle} 
          onClick={logout}
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
