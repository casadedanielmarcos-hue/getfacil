import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '2px solid rgba(0,212,255,0.2)',
          borderTop: '2px solid #00d4ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
          Verificando sessão...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
}
