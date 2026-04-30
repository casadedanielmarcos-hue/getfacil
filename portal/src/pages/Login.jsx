import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const gestorDoc = await getDoc(doc(db, 'gestores', cred.user.uid));
      if (!gestorDoc.exists()) {
        await auth.signOut();
        setError('Acesso negado. Você não é um gestor autorizado.');
        return;
      }
      navigate('/');
    } catch {
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card glass">
        <div className="login-logo">
          <img src="/portal-gestor/logo-getfuturetoday.png" alt="GetFutureToday" />
        </div>
        <h1 className="login-title">Portal Gestor</h1>
        <p className="login-subtitle">Acesso exclusivo para gestores</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input"
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
          Primeiro acesso? <Link to="/setup" style={{ color: 'var(--neon)' }}>Inicializar sistema</Link>
        </p>
      </div>
    </div>
  );
}
