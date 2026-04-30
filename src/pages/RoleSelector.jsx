import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PORTAL_URL = 'https://casadedanielmarcos-hue.github.io/getfacil/portal/';

function BackgroundMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;
    let pts = [];

    const init = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        bx: 0, by: 0,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
        amp: Math.random() * 14 + 4,
        r: Math.random() * 1.4 + 0.5,
      }));
      pts.forEach(p => { p.bx = p.x; p.by = p.y; });
    };

    init();

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      time += 0.004;

      pts.forEach(p => {
        p.bx += p.vx; p.by += p.vy;
        if (p.bx < 0 || p.bx > W) p.vx *= -1;
        if (p.by < 0 || p.by > H) p.vy *= -1;
        p.x = p.bx + Math.sin(time + p.phase) * p.amp * 0.4;
        p.y = p.by + Math.cos(time * 0.8 + p.phase) * p.amp;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 120) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      pts.forEach(p => {
        const pulse = 0.35 + Math.sin(time * 1.5 + p.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${pulse})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}

function RoleCard({ title, subtitle, icon, onClick, accent }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '240px',
        padding: '40px 28px',
        borderRadius: '16px',
        cursor: 'pointer',
        background: hovered ? `rgba(0,0,0,0.7)` : 'rgba(0,0,0,0.5)',
        border: `1px solid ${hovered ? accent : `${accent}44`}`,
        boxShadow: hovered
          ? `0 0 40px ${accent}33, 0 24px 60px rgba(0,0,0,0.6)`
          : '0 8px 32px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }} />

      {/* icon */}
      <div style={{
        width: '64px', height: '64px',
        borderRadius: '14px',
        background: `${accent}12`,
        border: `1px solid ${accent}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent,
        boxShadow: hovered ? `0 0 24px ${accent}44` : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        {icon}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '6px',
          textShadow: hovered ? `0 0 20px ${accent}66` : 'none',
          transition: 'text-shadow 0.3s ease',
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.5px',
        }}>
          {subtitle}
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 24px',
        borderRadius: '8px',
        background: hovered ? `${accent}22` : `${accent}0d`,
        border: `1px solid ${hovered ? `${accent}77` : `${accent}33`}`,
        color: accent,
        fontFamily: 'var(--font-body)',
        fontWeight: '600',
        fontSize: '0.82rem',
        transition: 'all 0.25s ease',
      }}>
        Entrar
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <BackgroundMesh />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ height: '56px', overflow: 'hidden', marginBottom: '56px' }}>
          <img
            src="/getfacil/logo-getfuturetoday.png"
            alt="GetFutureToday"
            style={{ height: '224px', width: 'auto', display: 'block', marginTop: '-84px' }}
          />
        </div>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '1px', background: '#00d4ff', opacity: 0.6 }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#00d4ff',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}>
            Acesso ao Sistema
          </span>
          <div style={{ width: '24px', height: '1px', background: '#00d4ff', opacity: 0.6 }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '48px',
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>
          Você é:
        </h1>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <RoleCard
            title="Professor"
            subtitle="Área do aluno"
            accent="#00d4ff"
            onClick={() => navigate('/home')}
            icon={
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4l12 6-12 6L2 10l12-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M2 10v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M7 12.5v5c0 2 3 4 7 4s7-2 7-4v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <RoleCard
            title="Gestor"
            subtitle="Portal administrativo"
            accent="#0088ff"
            onClick={() => { window.location.href = PORTAL_URL; }}
            icon={
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="5" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 23h10M14 21v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M7 10h4M7 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
