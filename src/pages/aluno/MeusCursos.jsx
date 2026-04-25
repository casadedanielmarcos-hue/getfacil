import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StarfieldBackground } from '../../components/StarfieldBackground';

// ── Nav particles (mesma lógica do Home) ─────────────────────────────────────
function NavParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const pts = Array.from({ length: 42 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.3 + 0.4, isBlue: Math.random() > 0.45,
      baseOpacity: Math.random() * 0.28 + 0.12, phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const alpha = p.baseOpacity + Math.sin(t * 1.2 + p.phase) * 0.1;
        const color = p.isBlue ? '0,212,255' : '200,220,255';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha * 0.18})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(0.7px)', pointerEvents: 'none', zIndex: 0 }} />;
}

// ── Ícones dos cursos ─────────────────────────────────────────────────────────
const COURSE_ICONS = {
  c1: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M20 4l8 8-14 14H6v-8L20 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 7l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 28l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  c2: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="9" y="9" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 9V6M16 9V6M20 9V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 23v3M16 23v3M20 23v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12H6M9 16H6M9 20H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 12h3M23 16h3M23 20h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  c3: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 13l-6 3 3 3 6-3-3-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  c4: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 22l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 16l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 10l10-5 10 5-10 5L6 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  c5: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4l4 8 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1 4-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M11 12h10M11 16h7M11 20h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ── Card de curso ─────────────────────────────────────────────────────────────
function CursoCard({ course, progresso, aulasCompletas, totalAulas }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const getStatus = () => {
    if (progresso >= 100) return { label: 'Concluído', color: '#00ff88', border: 'rgba(0,255,136,0.3)', bg: 'rgba(0,255,136,0.08)' };
    if (progresso > 0)    return { label: 'Em Progresso', color: '#00d4ff', border: 'rgba(0,212,255,0.3)', bg: 'rgba(0,212,255,0.08)' };
    return                       { label: 'Não Iniciado', color: 'rgba(255,255,255,0.38)', border: 'rgba(255,255,255,0.12)', bg: 'rgba(255,255,255,0.04)' };
  };

  const getBtnLabel = () => {
    if (progresso >= 100) return 'Acessar Curso';
    if (progresso > 0)    return 'Continuar Curso';
    return 'Iniciar Curso';
  };

  const status = getStatus();
  const accent = course.accentColor || '#00d4ff';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/curso/${course.id}`)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(14px)',
        border: `1px solid ${hovered ? 'rgba(0,212,255,0.45)' : 'rgba(0,212,255,0.13)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.025) translateY(-5px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? '0 24px 64px rgba(0,0,0,0.55), 0 0 40px rgba(0,212,255,0.12)'
          : '0 4px 28px rgba(0,0,0,0.35)',
        transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Capa */}
      <div style={{ height: '118px', background: course.coverColor, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {/* Ícone grande — watermark */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, opacity: 0.18, transform: 'scale(2.4)', pointerEvents: 'none' }}>
          {COURSE_ICONS[course.id] || DEFAULT_ICON}
        </div>
        {/* Gradiente inferior */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 65%)' }} />
        {/* Glow superior no hover */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`, opacity: hovered ? 1 : 0.4, transition: 'opacity 0.3s ease' }} />
        {/* Badge de status */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '20px', background: status.bg, border: `1px solid ${status.border}`, fontSize: '0.6rem', fontWeight: '700', color: status.color, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-body)' }}>
          {status.label}
        </div>
      </div>

      {/* Corpo */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '0.64rem', fontWeight: '600', color: `${accent}99`, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-body)', marginBottom: '5px' }}>
          {course.subtitle}
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', lineHeight: '1.3', flex: 1 }}>
          {course.title}
        </h3>

        {/* Barra de progresso */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.71rem', color: 'rgba(255,255,255,0.4)' }}>
              {aulasCompletas} de {totalAulas} aulas completas
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: '700', color: progresso >= 100 ? '#00ff88' : accent }}>
              {progresso}%
            </span>
          </div>
          <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '3px', width: `${progresso}%`,
              background: progresso >= 100
                ? 'linear-gradient(90deg, #00d4ff, #00ff88)'
                : 'linear-gradient(90deg, #0055ff, #00d4ff)',
              transition: 'width 0.6s ease',
              boxShadow: progresso > 0 ? `0 0 8px ${accent}99` : 'none',
            }} />
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={e => { e.stopPropagation(); navigate(`/curso/${course.id}`); }}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px',
            background: hovered ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.08)',
            border: `1px solid ${hovered ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.25)'}`,
            color: '#00d4ff', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.84rem',
            cursor: 'pointer', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: hovered ? '0 0 14px rgba(0,212,255,0.2)' : 'none',
          }}
        >
          {getBtnLabel()}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export function MeusCursos() {
  const { user, logout } = useAuth();
  const { cursos, getProgressoCurso, calcularProgresso } = useData();
  const navigate = useNavigate();

  const meusCursos = cursos.filter(c => user?.cursosMatriculados?.includes(c.id));

  const navBtnStyle = (active = false) => ({
    fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: active ? '600' : '500',
    color: active ? '#00d4ff' : 'rgba(255,255,255,0.6)',
    background: active ? 'rgba(0,212,255,0.08)' : 'none',
    border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
    cursor: 'pointer', padding: '7px 14px', borderRadius: '8px', transition: 'color 0.2s ease, background 0.2s ease',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <StarfieldBackground />

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 40px',
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, overflow: 'hidden',
      }}>
        <NavParticles />

        {/* Logo */}
        <div
          style={{ lineHeight: 0, position: 'relative', zIndex: 1, height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <img src="/getfacil/logo-getfuturetoday.png" alt="GetFutureToday" style={{ height: '176px', width: 'auto', display: 'block', flexShrink: 0 }} />
        </div>

        {/* Links + usuário */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', zIndex: 1 }}>
          <button
            style={navBtnStyle(false)}
            onClick={() => navigate('/home')}
            onMouseEnter={e => { if (e.currentTarget.style.color !== '#00d4ff') e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            Cursos
          </button>
          <button style={navBtnStyle(true)}>
            Meus Cursos
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                {user.nome?.split(' ')[0]}
              </span>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff4466'; e.currentTarget.style.borderColor = 'rgba(255,68,102,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Conteúdo ───────────────────────────────────────── */}
      <div style={{ paddingTop: '88px', padding: 'clamp(24px, 5vw, 64px)', paddingTop: '104px', maxWidth: '1140px', margin: '0 auto' }}>

        {/* Cabeçalho da página */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '2px', background: '#00d4ff', borderRadius: '1px', boxShadow: '0 0 8px rgba(0,212,255,0.6)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: '600', color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '3px' }}>
              Portal do Aluno
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '700', color: '#ffffff', marginBottom: '10px', lineHeight: '1.1' }}>
            Meus Cursos
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
            {meusCursos.length > 0
              ? `${meusCursos.length} curso${meusCursos.length > 1 ? 's' : ''} em que você está matriculado`
              : 'Cursos em que você está matriculado'}
          </p>
        </div>

        {/* Grid ou estado vazio */}
        {meusCursos.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '20px',
          }}>
            <div style={{ marginBottom: '20px', opacity: 0.35 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect x="8" y="14" width="40" height="28" rx="4" stroke="#00d4ff" strokeWidth="2" />
                <path d="M20 28h16M28 22v12" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
              Nenhum curso ainda
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', maxWidth: '380px', marginBottom: '28px' }}>
              Você ainda não está matriculado em nenhum curso. Explore os cursos disponíveis e solicite matrícula.
            </p>
            <button
              onClick={() => navigate('/home')}
              style={{ padding: '12px 28px', borderRadius: '8px', background: '#00d4ff', color: '#000', border: 'none', fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 0 24px rgba(0,212,255,0.3)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#33ddff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00d4ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {meusCursos.map(course => {
              const prog = getProgressoCurso(user.id, course.id);
              const percentual = calcularProgresso(course.id, user.id);
              const totalAulas = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const aulasCompletas = prog?.aulasAssistidas?.length || 0;
              return (
                <CursoCard
                  key={course.id}
                  course={course}
                  progresso={percentual}
                  aulasCompletas={aulasCompletas}
                  totalAulas={totalAulas}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
