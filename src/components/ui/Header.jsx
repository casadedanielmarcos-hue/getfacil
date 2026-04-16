import { useNavigate } from 'react-router-dom';

export function Header({ showBack = false, backTo = '/', backLabel = 'Voltar' }) {
  const navigate = useNavigate();

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none'
  };

  const logoTextStyle = {
    fontFamily: 'var(--font-logo)',
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
  };

  return (
    <header style={headerStyle}>
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
    </header>
  );
}
