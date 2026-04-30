import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

// ── Partículas da Navbar ────────────────────────────────────────────────────
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
        const color = p.isBlue ? '0,212,255' : '200,220,255';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha * 0.18})`;
        ctx.fill();

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

// ── Neural Mesh Canvas ──────────────────────────────────────────────────────
function NeuralMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const NUM = 140;
    const MAX_DIST = 130;
    let animId;
    let time = 0;
    let pts = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      pts = Array.from({ length: NUM }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        bx: 0, by: 0,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        phase: Math.random() * Math.PI * 2,
        amp: Math.random() * 18 + 6,
        r: Math.random() * 1.8 + 0.8,
      }));
      pts.forEach(p => { p.bx = p.x; p.by = p.y; });
    };

    init();

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      time += 0.005;

      // update
      pts.forEach(p => {
        p.bx += p.vx;
        p.by += p.vy;
        if (p.bx < 0 || p.bx > W) p.vx *= -1;
        if (p.by < 0 || p.by > H) p.vy *= -1;
        p.x = p.bx + Math.sin(time * 0.9 + p.phase) * p.amp * 0.4;
        p.y = p.by + Math.cos(time * 0.7 + p.phase) * p.amp;
      });

      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${a})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      pts.forEach(p => {
        const pulse = 0.45 + Math.sin(time * 1.5 + p.phase) * 0.25;
        // outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,0.04)`;
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${pulse})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => { init(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

// ── Course Icons ────────────────────────────────────────────────────────────
const ICONS = {
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
};

// ── Card especial: Pensamento Computacional (sci-fi) ────────────────────────
function ScifiCourseCard({ course, onClick }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const W = canvas.width = 260;
    const H = canvas.height = 380;

    // Mini neural mesh confined to card
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      bx: 0, by: 0,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      r: Math.random() * 1.5 + 0.5,
    }));
    pts.forEach(p => { p.bx = p.x; p.by = p.y; });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.007;

      pts.forEach(p => {
        p.bx += p.vx; p.by += p.vy;
        if (p.bx < 0 || p.bx > W) p.vx *= -1;
        if (p.by < 0 || p.by > H) p.vy *= -1;
        p.x = p.bx + Math.sin(t + p.phase) * 8;
        p.y = p.by + Math.cos(t * 0.8 + p.phase) * 10;
      });

      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 80) * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      pts.forEach(p => {
        const pulse = 0.5 + Math.sin(t * 2 + p.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,136,255,0.06)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${pulse})`;
        ctx.fill();
      });

      // horizontal scan line
      const scanY = ((t * 40) % (H + 40)) - 20;
      const grad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, 'rgba(0,212,255,0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 12, W, 24);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '260px',
        height: '380px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: '#010a14',
        border: `1px solid ${hovered ? 'rgba(0,212,255,0.7)' : 'rgba(0,212,255,0.35)'}`,
        transform: hovered ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? '0 28px 70px rgba(0,0,0,0.7), 0 0 60px rgba(0,136,255,0.35), 0 0 120px rgba(0,212,255,0.12)'
          : '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,136,255,0.15)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Animated neural mesh background */}
      <canvas
        ref={canvasRef}
        width={260}
        height={380}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Corner brackets sci-fi */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <svg
          key={i}
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ position: 'absolute', ...pos, opacity: hovered ? 0.9 : 0.5, transition: 'opacity 0.3s ease' }}
        >
          {i === 0 && <><path d="M0 8V0h8" stroke="#00d4ff" strokeWidth="1.5" /></>}
          {i === 1 && <><path d="M14 8V0H6" stroke="#00d4ff" strokeWidth="1.5" /></>}
          {i === 2 && <><path d="M0 6v8h8" stroke="#00d4ff" strokeWidth="1.5" /></>}
          {i === 3 && <><path d="M14 6v8H6" stroke="#00d4ff" strokeWidth="1.5" /></>}
        </svg>
      ))}

      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
        boxShadow: '0 0 8px #00d4ff',
      }} />

      {/* Dark gradient overlay bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,4,12,0.92) 0%, rgba(0,4,12,0.5) 45%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Top: icon + "DISPONÍVEL" badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: '52px', height: '52px',
            borderRadius: '10px',
            background: 'rgba(0,20,40,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,212,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#00d4ff',
            boxShadow: hovered ? '0 0 20px rgba(0,212,255,0.4)' : '0 0 10px rgba(0,212,255,0.2)',
            transition: 'box-shadow 0.3s ease',
          }}>
            {ICONS['c2']}
          </div>
          <div style={{
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.35)',
            fontSize: '0.6rem',
            fontWeight: '700',
            color: '#00d4ff',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 0 10px rgba(0,212,255,0.2)',
          }}>
            DISPONÍVEL
          </div>
        </div>

        {/* Bottom info */}
        <div>
          {/* Subtitle */}
          <p style={{
            fontSize: '0.65rem',
            fontWeight: '600',
            color: 'rgba(0,212,255,0.7)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: 'var(--font-body)',
            marginBottom: '6px',
          }}>
            {course.subtitle}
          </p>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: '16px',
            textShadow: hovered ? '0 0 20px rgba(0,212,255,0.4)' : 'none',
            transition: 'text-shadow 0.3s ease',
          }}>
            {course.title}
          </h3>

          {/* CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '11px 0',
            borderRadius: '8px',
            background: hovered ? 'rgba(0,212,255,0.18)' : 'rgba(0,212,255,0.1)',
            border: `1px solid ${hovered ? 'rgba(0,212,255,0.7)' : 'rgba(0,212,255,0.35)'}`,
            color: '#00d4ff',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '0.85rem',
            transition: 'all 0.25s ease',
            boxShadow: hovered ? '0 0 16px rgba(0,212,255,0.25)' : 'none',
          }}>
            Acessar curso
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Card (disponível — clicável) ─────────────────────────────────────
function CourseCard({ course, onClick }) {
  const [hovered, setHovered] = useState(false);
  const accent = course.accentColor || '#00d4ff';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '260px',
        height: '380px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: course.imagemCapa
          ? `url(${course.imagemCapa}) center/cover`
          : course.coverColor,
        border: `1px solid ${hovered ? `${accent}99` : `${accent}33`}`,
        transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${accent}33`
          : '0 8px 32px rgba(0,0,0,0.5)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(${accent}08 1px, transparent 1px),
          linear-gradient(90deg, ${accent}08 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)',
      }} />

      {/* "DISPONÍVEL" badge */}
      <div style={{
        position: 'absolute', top: '18px', right: '18px',
        padding: '3px 9px',
        borderRadius: '4px',
        background: `${accent}1a`,
        border: `1px solid ${accent}55`,
        fontSize: '0.58rem',
        fontWeight: '700',
        color: accent,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
      }}>
        DISPONÍVEL
      </div>

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Icon */}
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${accent}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
          boxShadow: hovered ? `0 0 16px ${accent}44` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}>
          {ICONS[course.id] || (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 8h16M6 14h10M6 20h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Bottom info */}
        <div>
          <p style={{
            fontSize: '0.65rem', fontWeight: '600',
            color: `${accent}bb`,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            fontFamily: 'var(--font-body)', marginBottom: '6px',
          }}>
            {course.subtitle}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontWeight: '700',
            color: '#ffffff', lineHeight: '1.25', marginBottom: '18px',
            textShadow: hovered ? `0 0 20px ${accent}44` : 'none',
            transition: 'text-shadow 0.3s ease',
          }}>
            {course.title}
          </h3>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '10px 0', borderRadius: '8px',
            background: hovered ? `${accent}22` : `${accent}0d`,
            border: `1px solid ${hovered ? `${accent}77` : `${accent}33`}`,
            color: accent,
            fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.85rem',
            transition: 'all 0.25s ease',
          }}>
            Acessar curso
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Locked Course Card ───────────────────────────────────────────────────────
function LockedCourseCard({ course }) {
  const [hovered, setHovered] = useState(false);
  const accent = course.accentColor || '#00d4ff';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: '260px', height: '380px', borderRadius: '14px', cursor: 'default', position: 'relative', userSelect: 'none' }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '14px', overflow: 'hidden',
        background: course.imagemCapa ? `url(${course.imagemCapa}) center/cover` : course.coverColor,
        border: '1px solid rgba(255,255,255,0.06)',
        opacity: hovered ? 0.6 : 0.45,
        filter: 'grayscale(60%)',
        transition: 'opacity 0.25s ease',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }} />

        {/* Lock icon */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.5" fill="rgba(255,255,255,0.4)" />
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2.5px' }}>
            Em breve
          </span>
        </div>

        <div style={{ position: 'absolute', inset: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: `1px solid ${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${accent}44` }}>
            {ICONS[course.id] || (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 8h16M6 14h10M6 20h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: '500', color: `${accent}44`, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
              {course.subtitle}
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '700', color: 'rgba(255,255,255,0.45)', lineHeight: '1.25' }}>
              {course.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Solicitation Modal ───────────────────────────────────────────────────────
// ── Home Page ───────────────────────────────────────────────────────────────
const CARD_W = 260;
const CARD_GAP = 20;
const CARD_STEP = CARD_W + CARD_GAP;

export function Home() {
  const navigate = useNavigate();
  const { cursos } = useData();
  const { user, logout } = useAuth();
  const coursesRef = useRef(null);
  const trackRef = useRef(null);

  const cursosVisiveis = cursos;

  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const getMaxOffset = () => {
    const containerW = trackRef.current?.parentElement?.offsetWidth || 320;
    const totalW = cursosVisiveis.length * CARD_STEP - CARD_GAP;
    return Math.min(0, containerW - totalW - 48);
  };

  const scrollLeft = () => setOffset(prev => Math.min(prev + CARD_STEP, 0));
  const scrollRight = () => setOffset(prev => Math.max(prev - CARD_STEP, getMaxOffset()));
  const canLeft = offset < 0;
  const canRight = offset > getMaxOffset();

  const onMouseDown = e => { setIsDragging(true); setDragStartX(e.clientX - offset); };
  const onMouseMove = e => {
    if (!isDragging) return;
    setOffset(Math.max(Math.min(e.clientX - dragStartX, 0), getMaxOffset()));
  };
  const onMouseUp = () => setIsDragging(false);

  const onTouchStart = e => setDragStartX(e.touches[0].clientX - offset);
  const onTouchMove = e => {
    const next = e.touches[0].clientX - dragStartX;
    setOffset(Math.max(Math.min(next, 0), getMaxOffset()));
  };

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 40px',
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
        overflow: 'hidden',
      }}>
        <NavParticles />

        <div style={{ lineHeight: 0, position: 'relative', zIndex: 1, height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <img
            src="/getfacil/logo-getfuturetoday.png"
            alt="GetFutureToday"
            style={{ height: '176px', width: 'auto', display: 'block', flexShrink: 0 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
          <button
            onClick={scrollToCourses}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: '500',
              color: 'rgba(255,255,255,0.6)', background: 'none', border: '1px solid transparent',
              cursor: 'pointer', padding: '7px 14px', borderRadius: '8px', transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            Cursos
          </button>
          <button
            onClick={() => navigate('/meus-cursos')}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: '500',
              color: 'rgba(255,255,255,0.6)', background: 'none', border: '1px solid transparent',
              cursor: 'pointer', padding: '7px 14px', borderRadius: '8px', transition: 'color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'none'; }}
          >
            Meus Cursos
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                {user.nome?.split(' ')[0]}
              </span>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                style={{
                  padding: '7px 14px', borderRadius: '7px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff4466'; e.currentTarget.style.borderColor = 'rgba(255,68,102,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Left — text (40%) */}
        <div style={{
          width: '42%',
          padding: '0 0 0 clamp(28px, 5vw, 80px)',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}>
            <div style={{ width: '28px', height: '1px', background: '#00d4ff', opacity: 0.7 }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#00d4ff',
              textTransform: 'uppercase',
              letterSpacing: '2.5px',
            }}>
              Plataforma de Aprendizado
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 4.5vw, 5rem)',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.05',
            letterSpacing: '-1px',
            marginBottom: '24px',
          }}>
            O futuro do<br />
            aprendizado<br />
            <span style={{
              color: '#00d4ff',
              textShadow: '0 0 32px rgba(0,212,255,0.45)',
            }}>começa aqui</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
            fontWeight: '400',
            color: '#8899aa',
            lineHeight: '1.6',
            marginBottom: '44px',
            maxWidth: '380px',
          }}>
            Aprenda no seu ritmo. Evolua de verdade.
          </p>

          <button
            onClick={scrollToCourses}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#00d4ff',
              color: '#000000',
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              fontSize: '0.95rem',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.2px',
              boxShadow: '0 0 32px rgba(0,212,255,0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#33ddff';
              e.currentTarget.style.boxShadow = '0 0 48px rgba(0,212,255,0.55)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#00d4ff';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explorar Cursos
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right — Neural Mesh (60%) */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0,
          width: '62%',
          height: '100%',
        }}>
          {/* Fade mask on left edge */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            width: '120px', height: '100%',
            background: 'linear-gradient(to right, #000000, transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />
          <NeuralMesh />
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to top, #000000, transparent)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 4,
          opacity: 0.4,
          animation: 'float 2.5s ease-in-out infinite',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '2px', color: '#8899aa' }}>SCROLL</span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 1l7 7 7-7" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Courses Section ─────────────────────────────────── */}
      <section ref={coursesRef} style={{ paddingBottom: '100px', paddingTop: '80px' }}>

        {/* Section header */}
        <div style={{
          padding: '0 clamp(24px, 5vw, 64px)',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              fontWeight: '600',
              color: '#00d4ff',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '10px',
            }}>
              CURSOS DISPONÍVEIS
            </h2>
            {/* Decorative line */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ width: '48px', height: '2px', background: '#00d4ff', borderRadius: '1px', boxShadow: '0 0 8px rgba(0,212,255,0.6)' }} />
              <div style={{ width: '16px', height: '2px', background: 'rgba(0,212,255,0.35)', borderRadius: '1px' }} />
              <div style={{ width: '6px', height: '2px', background: 'rgba(0,212,255,0.15)', borderRadius: '1px' }} />
            </div>
          </div>

          {/* Arrows */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { can: canLeft, fn: scrollLeft, d: 'left' },
              { can: canRight, fn: scrollRight, d: 'right' },
            ].map(({ can, fn, d }) => (
              <button
                key={d}
                onClick={fn}
                disabled={!can}
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${can ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: can ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                  color: can ? '#00d4ff' : 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: can ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => can && (e.currentTarget.style.background = 'rgba(0,212,255,0.18)')}
                onMouseLeave={e => can && (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {d === 'left'
                    ? <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div
          style={{
            overflow: 'hidden',
            padding: '8px clamp(24px, 5vw, 64px) 20px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              transform: `translateX(${offset}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              userSelect: 'none',
            }}
          >
            {cursosVisiveis.map(course => {
              if (!course.disponivel) return (
                <LockedCourseCard
                  key={course.id}
                  course={course}
                />
              );
              if (course.id === 'c2') return (
                <ScifiCourseCard
                  key={course.id}
                  course={course}
                  onClick={() => !isDragging && navigate(`/curso/${course.id}`)}
                />
              );
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => !isDragging && navigate(`/curso/${course.id}`)}
                />
              );
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
          {cursosVisiveis.map((_, i) => {
            const pos = i * CARD_STEP;
            const active = -offset >= pos - CARD_STEP && -offset <= pos + CARD_STEP;
            return (
              <div
                key={i}
                onClick={() => setOffset(Math.max(-pos, getMaxOffset()))}
                style={{
                  width: active ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: active ? '#00d4ff' : 'rgba(255,255,255,0.18)',
                  boxShadow: active ? '0 0 8px rgba(0,212,255,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>
      </section>

    </div>
  );
}
