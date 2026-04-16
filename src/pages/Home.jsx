import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

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
  c1: ( // Canva — pen tool / design
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M20 4l8 8-14 14H6v-8L20 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 7l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 28l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  c2: ( // Pensamento Computacional — circuit / cpu
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="9" y="9" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 9V6M16 9V6M20 9V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 23v3M16 23v3M20 23v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12H6M9 16H6M9 20H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 12h3M23 16h3M23 20h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  c3: ( // Guia Offline — compass / map
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 13l-6 3 3 3 6-3-3-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  c4: ( // Design Instrucional — layers / book
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 22l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 16l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 10l10-5 10 5-10 5L6 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course, onClick }) {
  const [hovered, setHovered] = useState(false);

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
        background: course.coverColor,
        border: `1px solid ${hovered ? `${course.accentColor}55` : 'rgba(255,255,255,0.06)'}`,
        transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${course.accentColor}33`
          : '0 8px 32px rgba(0,0,0,0.5)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
      }} />

      {/* Accent glow at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${course.accentColor}88, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Icon */}
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${course.accentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: course.accentColor,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.3s ease',
          boxShadow: hovered ? `0 0 16px ${course.accentColor}44` : 'none',
        }}>
          {ICONS[course.id]}
        </div>

        {/* Bottom info */}
        <div>
          <p style={{
            fontSize: '0.7rem',
            fontWeight: '500',
            color: `${course.accentColor}cc`,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontFamily: 'var(--font-body)',
            marginBottom: '8px',
          }}>
            {course.subtitle}
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.25',
            marginBottom: '20px',
          }}>
            {course.title}
          </h3>

          {/* CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 0',
            borderRadius: '8px',
            background: hovered ? `${course.accentColor}22` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${hovered ? `${course.accentColor}66` : 'rgba(255,255,255,0.1)'}`,
            color: hovered ? course.accentColor : 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '0.85rem',
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

// ── Home Page ───────────────────────────────────────────────────────────────
const CARD_W = 260;
const CARD_GAP = 20;
const CARD_STEP = CARD_W + CARD_GAP;

export function Home() {
  const navigate = useNavigate();
  const { cursos } = useData();
  const coursesRef = useRef(null);
  const trackRef = useRef(null);

  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const getMaxOffset = () => {
    const containerW = trackRef.current?.parentElement?.offsetWidth || 320;
    const totalW = cursos.length * CARD_STEP - CARD_GAP;
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
        padding: '16px 40px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
            <circle cx="14" cy="14" r="5" fill="#00d4ff" />
            <line x1="14" y1="1" x2="14" y2="6" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="22" x2="14" y2="27" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="14" x2="6" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="14" x2="27" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: 'var(--font-logo)',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.5px',
          }}>
            GetFuture<span style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.6)' }}>Today</span>
          </span>
        </div>

        <button
          onClick={scrollToCourses}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.6)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          Cursos
        </button>
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
            {cursos.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => !isDragging && navigate(`/curso/${course.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
          {cursos.map((_, i) => {
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
