import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { StarfieldBackground } from '../components/StarfieldBackground';

const CARD_WIDTH = 280;
const CARD_GAP = 20;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

// Course icons as simple SVG paths
const ICONS = {
  c1: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="8" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M13 14l-4 4 4 4M23 14l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 22l4-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  c2: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 6L33 28H3L18 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="18" cy="22" r="2" fill="currentColor" />
      <path d="M18 13v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  c3: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="5" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 13h26M13 5v26" stroke="currentColor" strokeWidth="2" />
      <path d="M18 18l4 4M22 18l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  c4: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="6" width="24" height="24" rx="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18" r="4" fill="currentColor" />
      <path d="M18 8v4M18 24v4M8 18h4M24 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  c5: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 14l2-2M28 12l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="13" r="1" fill="currentColor" />
      <path d="M22 8l1-1 2 2-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
};

function CourseCard({ course, progress, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: `${CARD_WIDTH}px`,
        height: '350px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: course.coverColor,
        border: `1px solid rgba(255,255,255,${hovered ? 0.2 : 0.08})`,
        transform: hovered ? 'scale(1.04) translateY(-4px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${getCourseGlow(course.id)}`
          : '0 8px 24px rgba(0,0,0,0.4)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)'
      }} />

      {/* Decorative grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
        opacity: hovered ? 0.8 : 0.4
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top: icon + subtitle */}
        <div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '12px',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            {ICONS[course.id]}
          </div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: 'var(--font-body)'
          }}>
            {course.subtitle}
          </p>
        </div>

        {/* Bottom: title + progress + button */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.3',
            marginBottom: '12px',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}>
            {course.title}
          </h3>

          {progress > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div style={{
                height: '3px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '9999px'
                }} />
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 20px',
            borderRadius: '8px',
            background: hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#ffffff',
            fontFamily: 'var(--font-body)',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            gap: '6px'
          }}>
            {progress > 0 ? 'Continuar' : 'Acessar'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCourseGlow(id) {
  const glows = {
    c1: 'rgba(0, 102, 255, 0.4)',
    c2: 'rgba(124, 58, 237, 0.4)',
    c3: 'rgba(5, 150, 105, 0.4)',
    c4: 'rgba(234, 88, 12, 0.4)',
    c5: 'rgba(0, 212, 255, 0.4)'
  };
  return glows[id] || 'rgba(0, 212, 255, 0.3)';
}

export function Home() {
  const navigate = useNavigate();
  const { cursos, getCursosEmAndamento, getCursosFinalizados, calcularProgresso, ALUNO_ID } = useData();
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef(null);

  const cursosAndamento = getCursosEmAndamento(ALUNO_ID);
  const cursosFinalizados = getCursosFinalizados(ALUNO_ID);
  const totalCursos = cursos.length;

  const getMaxOffset = () => {
    const containerWidth = trackRef.current?.parentElement?.offsetWidth || 320;
    const totalWidth = totalCursos * CARD_STEP - CARD_GAP;
    return Math.min(0, containerWidth - totalWidth - 32);
  };

  const scrollLeft = () => {
    setOffset(prev => Math.min(prev + CARD_STEP, 0));
  };

  const scrollRight = () => {
    setOffset(prev => Math.max(prev - CARD_STEP, getMaxOffset()));
  };

  const canScrollLeft = offset < 0;
  const canScrollRight = offset > getMaxOffset();

  // Mouse drag
  const handleMouseDown = e => {
    setIsDragging(true);
    setDragStartX(e.clientX - offset);
  };
  const handleMouseMove = e => {
    if (!isDragging) return;
    const newOffset = e.clientX - dragStartX;
    setOffset(Math.max(Math.min(newOffset, 0), getMaxOffset()));
  };
  const handleMouseUp = () => setIsDragging(false);

  // Touch drag
  const handleTouchStart = e => {
    setDragStartX(e.touches[0].clientX - offset);
  };
  const handleTouchMove = e => {
    const newOffset = e.touches[0].clientX - dragStartX;
    setOffset(Math.max(Math.min(newOffset, 0), getMaxOffset()));
  };

  const getProgress = (cursoId) => {
    const prog = cursosAndamento.find(c => c.id === cursoId);
    if (prog) return prog.progresso;
    const fin = cursosFinalizados.find(c => c.id === cursoId);
    if (fin) return 100;
    return 0;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
      <StarfieldBackground />

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
            <circle cx="14" cy="14" r="5" fill="#00d4ff" />
            <line x1="14" y1="1" x2="14" y2="6" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="22" x2="14" y2="27" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="14" x2="6" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="14" x2="27" y2="14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            GetFuture<span style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.6)' }}>Today</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '64px 24px 48px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px',
          borderRadius: '9999px',
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.25)',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--neon-primary)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '24px',
          fontFamily: 'var(--font-body)'
        }}>
          Portal do Aluno
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: '900',
          color: '#ffffff',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
          lineHeight: '1.1'
        }}>
          GetFuture<span style={{
            color: '#00d4ff',
            textShadow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.3)'
          }}>Today</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.5px'
        }}>
          Aprenda. Evolua. <span style={{ color: '#00d4ff' }}>Destaque-se.</span>
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { value: `${cursosAndamento.length}`, label: 'Em andamento' },
            { value: `${cursosFinalizados.length}`, label: 'Concluídos' },
            { value: `${totalCursos}`, label: 'Cursos disponíveis' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#00d4ff',
                textShadow: '0 0 15px rgba(0,212,255,0.5)'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'var(--font-body)'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Carousel */}
      <section style={{ paddingBottom: '80px' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          marginBottom: '24px',
          maxWidth: '1200px',
          margin: '0 auto 24px'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Cursos Disponíveis
            </h2>
            <div style={{
              width: '40px',
              height: '2px',
              background: 'linear-gradient(90deg, #00d4ff, transparent)',
              marginTop: '6px'
            }} />
          </div>

          {/* Arrow controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { dir: 'left', fn: scrollLeft, can: canScrollLeft },
              { dir: 'right', fn: scrollRight, can: canScrollRight }
            ].map(({ dir, fn, can }) => (
              <button
                key={dir}
                onClick={fn}
                disabled={!can}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${can ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: can ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                  color: can ? '#00d4ff' : 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: can ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  boxShadow: can ? '0 0 10px rgba(0,212,255,0.15)' : 'none'
                }}
                onMouseEnter={e => can && (e.currentTarget.style.background = 'rgba(0,212,255,0.2)')}
                onMouseLeave={e => can && (e.currentTarget.style.background = 'rgba(0,212,255,0.1)')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {dir === 'left'
                    ? <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Track */}
        <div style={{
          overflow: 'hidden',
          padding: '8px 24px 16px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              transform: `translateX(${offset + dragOffset}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              userSelect: 'none'
            }}
          >
            {cursos.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getProgress(course.id)}
                onClick={() => !isDragging && navigate(`/curso/${course.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '16px'
        }}>
          {cursos.map((_, i) => {
            const cardPos = i * CARD_STEP;
            const isVisible = -offset >= cardPos - CARD_STEP && -offset <= cardPos + CARD_STEP;
            return (
              <div
                key={i}
                style={{
                  width: isVisible ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: isVisible ? '#00d4ff' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setOffset(Math.max(-cardPos, getMaxOffset()))}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
