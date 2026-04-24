import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const pts = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      bx: 0, by: 0,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2, amp: Math.random() * 14 + 4,
      r: Math.random() * 1.5 + 0.4,
    }));
    pts.forEach(p => { p.bx = p.x; p.by = p.y; });
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.005;
      pts.forEach(p => {
        p.bx += p.vx; p.by += p.vy;
        if (p.bx < 0 || p.bx > W) p.vx *= -1;
        if (p.by < 0 || p.by > H) p.vy *= -1;
        p.x = p.bx + Math.sin(t + p.phase) * p.amp * 0.4;
        p.y = p.by + Math.cos(t * 0.8 + p.phase) * p.amp;
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      pts.forEach(p => {
        const a = 0.35 + Math.sin(t * 1.5 + p.phase) * 0.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.04)'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

function InputField({ label, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', padding: '13px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${focused ? 'rgba(0,212,255,0.6)' : 'rgba(0,212,255,0.2)'}`,
          borderRadius: '8px', color: '#ffffff',
          fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(0,212,255,0.1)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

const ERROS = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (mode === 'signup' && !nome.trim()) { setErro('Informe seu nome.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') await login(email, senha);
      else await signup(nome.trim(), email, senha);
      navigate('/home', { replace: true });
    } catch (err) {
      setErro(ERROS[err.code] || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <LoginParticles />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px', margin: '24px',
        background: 'rgba(10,10,20,0.88)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 0 80px rgba(0,212,255,0.08), 0 32px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/getfacil/logo-getfuturetoday.png" alt="GetFutureToday"
            style={{ height: '56px', width: 'auto', margin: '0 auto 14px', display: 'block' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
            {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <InputField label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
          )}
          <InputField label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
          <InputField label="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'} />

          {erro && (
            <p style={{
              fontSize: '0.82rem', color: '#ff4466',
              background: 'rgba(255,68,102,0.08)',
              border: '1px solid rgba(255,68,102,0.25)',
              borderRadius: '8px', padding: '10px 14px',
              fontFamily: 'var(--font-body)',
            }}>
              {erro}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: '4px', padding: '14px',
            background: loading ? 'rgba(0,212,255,0.4)' : '#00d4ff',
            color: '#000000', border: 'none', borderRadius: '8px',
            fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 0 24px rgba(0,212,255,0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#33ddff'; e.currentTarget.style.boxShadow = '0 0 36px rgba(0,212,255,0.55)'; }}}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#00d4ff'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.35)'; }}}
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErro(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#00d4ff', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '3px',
              }}>
              {mode === 'login' ? 'Criar conta' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
