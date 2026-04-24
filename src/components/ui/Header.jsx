import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Partículas flutuantes na navbar — ficam "atrás do vidro" com blur suave
function NavParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const NUM = 42;
    const pts = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.3 + 0.4,
      isBlue: Math.random() > 0.45,
      baseOpacity: Math.random() * 0.28 + 0.12,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const alpha = p.baseOpacity + Math.sin(t * 1.2 + p.phase) * 0.1;
        const color = p.isBlue ? `0,212,255` : `200,220,255`;

        // soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha * 0.2})`;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        filter: 'blur(0.7px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export function Header({ showBack = false, backTo = '/', backLabel = 'Voltar' }) {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      background: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.10)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      overflow: 'hidden',
    }}>
      <NavParticles />

      {/* Logo */}
      <div
        style={{ position: 'relative', zIndex: 1, cursor: 'pointer', lineHeight: 0 }}
        onClick={() => navigate('/')}
      >
        <img
          src="/getfacil/logo-getfuturetoday.png"
          alt="GetFutureToday"
          style={{ height: '72px', width: 'auto', display: 'block' }}
        />
      </div>

      {showBack && (
        <button
          style={{
            position: 'relative',
            zIndex: 1,
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
            transition: 'all 0.2s ease',
          }}
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
