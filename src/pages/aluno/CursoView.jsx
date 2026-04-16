import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Card, Badge, ProgressBar, Button } from '../../components/ui';
import {
  Play,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Award
} from 'lucide-react';

export function CursoView() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso, calcularProgresso, ensureMatriculado } = useData();

  const [expandedModulo, setExpandedModulo] = useState(null);

  const curso = cursos.find(c => c.id === cursoId);

  // Auto-enroll if not yet enrolled
  useEffect(() => {
    if (curso) ensureMatriculado(user.id, cursoId);
  }, [cursoId, curso]);

  const progressoAluno = getProgressoCurso(user.id, cursoId);
  const percentualProgresso = calcularProgresso(cursoId, user.id);

  const todasAulasAssistidas = useMemo(() => {
    if (!curso || !progressoAluno) return false;
    const total = curso.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    return progressoAluno.aulasAssistidas.length >= total;
  }, [curso, progressoAluno]);

  const todasAvaliacoesModuloFeitas = useMemo(() => {
    if (!curso || !progressoAluno) return false;
    const modulosComQuiz = curso.modules.filter(m => m.quiz);
    return modulosComQuiz.every(m =>
      progressoAluno.avaliacoesFeitas.some(a => a.avaliacaoId === m.quiz.id)
    );
  }, [curso, progressoAluno]);

  const podeAvaliacaoFinal = todasAulasAssistidas && todasAvaliacoesModuloFeitas;

  if (!curso || !progressoAluno) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StarfieldBackground />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Carregando...</p>
      </div>
    );
  }

  const isModuloCompleto = (modulo) => progressoAluno.modulosCompletos.includes(modulo.id);

  const getQuizModulo = (moduloId) => {
    const modulo = curso.modules.find(m => m.id === moduloId);
    if (!modulo?.quiz) return null;
    return progressoAluno.avaliacoesFeitas.find(a => a.avaliacaoId === modulo.quiz.id);
  };

  const todasAulasModuloAssistidas = (modulo) =>
    modulo.lessons.every(l => progressoAluno.aulasAssistidas.includes(l.id));

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '80px' }}>
      <StarfieldBackground />
      <Header showBack backTo="/" backLabel="Cursos" />

      {/* Course Hero Banner */}
      <div style={{
        height: '180px',
        background: curso.coverColor,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px'
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontFamily: 'var(--font-body)',
            marginBottom: '4px'
          }}>
            {curso.subtitle}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            {curso.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
        {/* Progress */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-body)'
          }}>
            <span>Seu progresso</span>
            <span style={{ color: '#00d4ff', fontWeight: '600' }}>{percentualProgresso}% concluído</span>
          </div>
          <ProgressBar value={percentualProgresso} showLabel={false} size="large" />
        </div>

        {/* Modules */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '12px'
        }}>
          Módulos
        </h2>

        {curso.modules.map((modulo, index) => {
          const isExpanded = expandedModulo === modulo.id;
          const moduloCompleto = isModuloCompleto(modulo);
          const quizFeito = getQuizModulo(modulo.id);
          const podeQuiz = todasAulasModuloAssistidas(modulo);

          return (
            <div key={modulo.id} style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${moduloCompleto ? 'rgba(0,255,136,0.2)' : 'rgba(0,212,255,0.12)'}`,
              borderRadius: '12px',
              marginBottom: '10px',
              overflow: 'hidden',
              transition: 'border-color 0.2s ease'
            }}>
              {/* Module header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => setExpandedModulo(isExpanded ? null : modulo.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: moduloCompleto
                      ? 'rgba(0,255,136,0.15)'
                      : 'rgba(0,212,255,0.1)',
                    border: `1px solid ${moduloCompleto ? 'rgba(0,255,136,0.4)' : 'rgba(0,212,255,0.3)'}`,
                    color: moduloCompleto ? '#00ff88' : '#00d4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    flexShrink: 0
                  }}>
                    {moduloCompleto ? <CheckCircle size={14} /> : index + 1}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#ffffff'
                  }}>
                    {modulo.title}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{
                  borderTop: '1px solid rgba(0,212,255,0.08)',
                  padding: '8px 12px 12px'
                }}>
                  {modulo.lessons.map((lesson) => {
                    const assistida = progressoAluno.aulasAssistidas.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 8px',
                          borderRadius: '8px',
                          background: assistida ? 'rgba(0,255,136,0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onClick={() => navigate(`/curso/${cursoId}/aula/${lesson.id}`)}
                        onMouseEnter={e => !assistida && (e.currentTarget.style.background = 'rgba(0,212,255,0.06)')}
                        onMouseLeave={e => !assistida && (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: assistida ? 'rgba(0,255,136,0.15)' : 'rgba(0,212,255,0.1)',
                          border: `1px solid ${assistida ? 'rgba(0,255,136,0.4)' : 'rgba(0,212,255,0.25)'}`,
                          color: assistida ? '#00ff88' : '#00d4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {assistida ? <CheckCircle size={14} /> : <Play size={12} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: assistida ? 'rgba(255,255,255,0.7)' : '#ffffff',
                            fontFamily: 'var(--font-body)'
                          }}>
                            {lesson.title}
                          </div>
                          <div style={{
                            fontSize: '0.72rem',
                            color: 'rgba(255,255,255,0.35)',
                            fontFamily: 'var(--font-body)'
                          }}>
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Module quiz button */}
                  {modulo.quiz && (
                    <button
                      style={{
                        marginTop: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        background: quizFeito
                          ? 'rgba(0,255,136,0.08)'
                          : podeQuiz
                          ? 'rgba(0,212,255,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px dashed ${quizFeito ? 'rgba(0,255,136,0.35)' : podeQuiz ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        color: quizFeito ? '#00ff88' : podeQuiz ? '#00d4ff' : 'rgba(255,255,255,0.25)',
                        cursor: podeQuiz ? 'pointer' : 'not-allowed',
                        width: '100%',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-body)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => podeQuiz && navigate(`/curso/${cursoId}/avaliacao/${modulo.quiz.id}`)}
                      disabled={!podeQuiz}
                    >
                      {quizFeito ? (
                        <><CheckCircle size={14} /> Quiz concluído — Nota: {quizFeito.nota}</>
                      ) : podeQuiz ? (
                        <><FileText size={14} /> Fazer Quiz do Módulo</>
                      ) : (
                        <><Lock size={14} /> Complete as aulas para liberar</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Final Exam */}
        {curso.finalExam && (
          <div style={{
            marginTop: '24px',
            background: podeAvaliacaoFinal
              ? 'rgba(0,212,255,0.06)'
              : 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${podeAvaliacaoFinal ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: podeAvaliacaoFinal
                  ? 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)'
                  : 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: podeAvaliacaoFinal ? '#000' : 'rgba(255,255,255,0.2)',
                boxShadow: podeAvaliacaoFinal ? '0 0 20px rgba(0,212,255,0.4)' : 'none'
              }}>
                <Award size={22} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '2px'
                }}>
                  Prova Final
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: podeAvaliacaoFinal ? 'rgba(0,212,255,0.8)' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'var(--font-body)'
                }}>
                  {podeAvaliacaoFinal
                    ? 'Pronto! Faça a prova e receba seu certificado'
                    : 'Complete todos os módulos e quizzes para liberar'}
                </p>
              </div>
            </div>

            {progressoAluno.avaliacaoFinal ? (
              <div style={{
                padding: '16px',
                background: progressoAluno.resultado === 'aprovado'
                  ? 'rgba(0,255,136,0.08)'
                  : 'rgba(255,68,102,0.08)',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${progressoAluno.resultado === 'aprovado' ? 'rgba(0,255,136,0.25)' : 'rgba(255,68,102,0.25)'}`
              }}>
                <Badge variant={progressoAluno.resultado === 'aprovado' ? 'success' : 'error'}>
                  {progressoAluno.resultado === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                </Badge>
                <p style={{ marginTop: '8px', fontWeight: '600', color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                  Nota: {progressoAluno.avaliacaoFinal.nota}
                </p>
                {progressoAluno.resultado === 'aprovado' && (
                  <Button
                    variant="primary"
                    size="small"
                    style={{ marginTop: '12px' }}
                    onClick={() => navigate(`/certificado/${cursoId}`)}
                  >
                    <Award size={14} />
                    Ver Certificado
                  </Button>
                )}
              </div>
            ) : (
              <Button
                fullWidth
                disabled={!podeAvaliacaoFinal}
                onClick={() => navigate(`/curso/${cursoId}/avaliacao-final`)}
              >
                {podeAvaliacaoFinal ? 'Iniciar Prova Final' : <><Lock size={14} /> Bloqueado</>}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
