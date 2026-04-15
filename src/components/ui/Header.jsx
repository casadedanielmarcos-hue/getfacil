<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';

export function Header({ showBack = false, backTo = '/', backLabel = 'Voltar' }) {
  const navigate = useNavigate();
=======
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from './index';
import { LogOut, GraduationCap } from 'lucide-react';

export function Header() {
  const { user, userType, logout } = useAuth();
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
    padding: '12px 24px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
=======
    padding: 'var(--space-md) var(--space-lg)',
    background: 'white',
    borderBottom: '1px solid var(--border)',
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none'
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  };

  const logoTextStyle = {
    fontFamily: 'var(--font-display)',
<<<<<<< HEAD
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.5px'
  };

  const neonPartStyle = {
    color: 'var(--neon-primary)',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.6)'
  };

  const backBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(0, 212, 255, 0.08)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    color: 'var(--neon-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  };

  return (
    <header style={headerStyle}>
<<<<<<< HEAD
      <div style={logoStyle} onClick={() => navigate('/')}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
          <circle cx="14" cy="14" r="5" fill="#00d4ff" />
          <line x1="14" y1="1" x2="14" y2="6" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="22" x2="14" y2="27" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="14" x2="6" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="14" x2="27" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={logoTextStyle}>
          GetFuture<span style={neonPartStyle}>Today</span>
        </span>
      </div>

      {showBack && (
        <button
          style={backBtnStyle}
          onClick={() => navigate(backTo)}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel}
        </button>
      )}
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    </header>
  );
}
