<<<<<<< HEAD
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
=======
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { AIAgent } from '../../components/AIAgent';
import { Card, Badge, ProgressBar, Button } from '../../components/ui';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lock, 
  ChevronDown, 
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  ChevronUp,
  FileText,
  Award
} from 'lucide-react';

export function CursoView() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
<<<<<<< HEAD
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
=======
  const { cursos, getProgressoCurso, calcularProgresso } = useData();
  
  const [expandedModulo, setExpandedModulo] = useState(null);

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);
  const percentualProgresso = calcularProgresso(cursoId, user.id);

  // Verificar se todas as aulas foram assistidas (para liberar avaliação final)
  const todasAulasAssistidas = useMemo(() => {
    if (!curso || !progressoAluno) return false;
    const totalAulas = curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
    return progressoAluno.aulasAssistidas.length >= totalAulas;
  }, [curso, progressoAluno]);

  // Verificar se todas as avaliações de módulo foram feitas
  const todasAvaliacoesModuloFeitas = useMemo(() => {
    if (!curso || !progressoAluno) return false;
    const modulosComAvaliacao = curso.modulos.filter(m => m.avaliacao);
    return modulosComAvaliacao.every(m => 
      progressoAluno.avaliacoesFeitas.some(a => a.avaliacaoId === m.avaliacao.id)
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    );
  }, [curso, progressoAluno]);

  const podeAvaliacaoFinal = todasAulasAssistidas && todasAvaliacoesModuloFeitas;

  if (!curso || !progressoAluno) {
<<<<<<< HEAD
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
=======
    return <div>Curso não encontrado</div>;
  }

  const pageStyle = {
    minHeight: '100vh',
    background: 'var(--background)',
    paddingBottom: '100px'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: 'var(--space-md) var(--space-lg)',
    color: 'var(--blue-600)',
    fontWeight: '500',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem'
  };

  const heroStyle = {
    position: 'relative',
    height: '180px',
    overflow: 'hidden'
  };

  const heroImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const heroOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 'var(--space-lg)'
  };

  const heroTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: 'var(--space-sm)'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const progressSectionStyle = {
    marginBottom: 'var(--space-xl)'
  };

  const progressLabelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-sm)',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)'
  };

  const moduloCardStyle = {
    marginBottom: 'var(--space-md)'
  };

  const moduloHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md)',
    cursor: 'pointer'
  };

  const moduloTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const moduloNameStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'var(--text-primary)'
  };

  const aulasListStyle = {
    padding: '0 var(--space-md) var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)'
  };

  const aulaItemStyle = (assistida) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    background: assistida ? 'var(--blue-50)' : 'transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  });

  const aulaIconStyle = (assistida) => ({
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    background: assistida ? 'var(--success)' : 'var(--blue-100)',
    color: assistida ? 'white' : 'var(--blue-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  });

  const aulaInfoStyle = {
    flex: 1
  };

  const aulaNameStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const aulaDuracaoStyle = {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  };

  const avaliacaoButtonStyle = {
    marginTop: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--blue-50)',
    color: 'var(--blue-700)',
    border: '1px dashed var(--blue-300)',
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '0.875rem',
    transition: 'all var(--transition-fast)'
  };

  const isModuloCompleto = (modulo) => {
    return progressoAluno.modulosCompletos.includes(modulo.id);
  };

  const getAvaliacaoModulo = (moduloId) => {
    const modulo = curso.modulos.find(m => m.id === moduloId);
    if (!modulo?.avaliacao) return null;
    return progressoAluno.avaliacoesFeitas.find(a => a.avaliacaoId === modulo.avaliacao.id);
  };

  const todasAulasModuloAssistidas = (modulo) => {
    return modulo.aulas.every(a => progressoAluno.aulasAssistidas.includes(a.id));
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate('/aluno')}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={heroStyle}>
        <img src={curso.capa} alt={curso.nome} style={heroImageStyle} />
        <div style={heroOverlayStyle}>
          <h1 style={heroTitleStyle}>{curso.nome}</h1>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={progressSectionStyle}>
          <div style={progressLabelStyle}>
            <span>Seu progresso</span>
            <span>{percentualProgresso}% concluído</span>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
          </div>
          <ProgressBar value={percentualProgresso} showLabel={false} size="large" />
        </div>

<<<<<<< HEAD
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
=======
        {/* Módulos */}
        {curso.modulos.map((modulo, index) => {
          const isExpanded = expandedModulo === modulo.id;
          const moduloCompleto = isModuloCompleto(modulo);
          const avaliacaoFeita = getAvaliacaoModulo(modulo.id);
          const podeAvaliacao = todasAulasModuloAssistidas(modulo);

          return (
            <Card key={modulo.id} style={moduloCardStyle}>
              <div 
                style={moduloHeaderStyle}
                onClick={() => setExpandedModulo(isExpanded ? null : modulo.id)}
              >
                <div style={moduloTitleStyle}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: moduloCompleto ? 'var(--success)' : 'var(--blue-100)',
                    color: moduloCompleto ? 'white' : 'var(--blue-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {moduloCompleto ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <span style={moduloNameStyle}>{modulo.nome}</span>
                </div>
                {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </div>

              {isExpanded && (
                <div style={aulasListStyle}>
                  {modulo.aulas.map((aula) => {
                    const assistida = progressoAluno.aulasAssistidas.includes(aula.id);
                    
                    return (
                      <div
                        key={aula.id}
                        style={aulaItemStyle(assistida)}
                        onClick={() => navigate(`/aluno/curso/${cursoId}/aula/${aula.id}`)}
                      >
                        <div style={aulaIconStyle(assistida)}>
                          {assistida ? <CheckCircle size={16} /> : <Play size={16} />}
                        </div>
                        <div style={aulaInfoStyle}>
                          <div style={aulaNameStyle}>{aula.nome}</div>
                          <div style={aulaDuracaoStyle}>{aula.duracao}</div>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
                        </div>
                      </div>
                    );
                  })}

<<<<<<< HEAD
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
=======
                  {/* Avaliação do Módulo */}
                  {modulo.avaliacao && (
                    <button
                      style={{
                        ...avaliacaoButtonStyle,
                        opacity: podeAvaliacao ? 1 : 0.5,
                        cursor: podeAvaliacao ? 'pointer' : 'not-allowed',
                        background: avaliacaoFeita ? '#dcfce7' : 'var(--blue-50)',
                        borderColor: avaliacaoFeita ? '#86efac' : 'var(--blue-300)',
                        color: avaliacaoFeita ? '#166534' : 'var(--blue-700)'
                      }}
                      onClick={() => podeAvaliacao && navigate(`/aluno/curso/${cursoId}/avaliacao/${modulo.avaliacao.id}`)}
                      disabled={!podeAvaliacao}
                    >
                      {avaliacaoFeita ? (
                        <>
                          <CheckCircle size={16} />
                          Avaliação concluída - Nota: {avaliacaoFeita.nota}
                        </>
                      ) : podeAvaliacao ? (
                        <>
                          <FileText size={16} />
                          Fazer Avaliação do Módulo
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Complete as aulas para liberar
                        </>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
                      )}
                    </button>
                  )}
                </div>
              )}
<<<<<<< HEAD
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
=======
            </Card>
          );
        })}

        {/* Avaliação Final */}
        {curso.avaliacaoFinal && (
          <Card style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: podeAvaliacaoFinal ? 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)' : 'var(--blue-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: podeAvaliacaoFinal ? 'white' : 'var(--blue-400)'
              }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '600', marginBottom: '2px' }}>
                  Avaliação Final
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {podeAvaliacaoFinal 
                    ? 'Complete para obter seu certificado!' 
                    : 'Complete todas as aulas e avaliações'}
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
                </p>
              </div>
            </div>

            {progressoAluno.avaliacaoFinal ? (
              <div style={{
<<<<<<< HEAD
                padding: '16px',
                background: progressoAluno.resultado === 'aprovado'
                  ? 'rgba(0,255,136,0.08)'
                  : 'rgba(255,68,102,0.08)',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${progressoAluno.resultado === 'aprovado' ? 'rgba(0,255,136,0.25)' : 'rgba(255,68,102,0.25)'}`
=======
                padding: 'var(--space-md)',
                background: progressoAluno.resultado === 'aprovado' ? '#dcfce7' : '#fee2e2',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
              }}>
                <Badge variant={progressoAluno.resultado === 'aprovado' ? 'success' : 'error'}>
                  {progressoAluno.resultado === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                </Badge>
<<<<<<< HEAD
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
=======
                <p style={{ marginTop: 'var(--space-sm)', fontWeight: '600' }}>
                  Nota: {progressoAluno.avaliacaoFinal.nota}
                </p>
                {progressoAluno.resultado === 'aprovado' && (
                  <Button 
                    variant="primary" 
                    size="small" 
                    style={{ marginTop: 'var(--space-md)' }}
                    onClick={() => navigate(`/aluno/certificado/${cursoId}`)}
                  >
                    <Award size={16} />
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
                    Ver Certificado
                  </Button>
                )}
              </div>
            ) : (
              <Button
                fullWidth
                disabled={!podeAvaliacaoFinal}
<<<<<<< HEAD
                onClick={() => navigate(`/curso/${cursoId}/avaliacao-final`)}
              >
                {podeAvaliacaoFinal ? 'Iniciar Prova Final' : <><Lock size={14} /> Bloqueado</>}
              </Button>
            )}
          </div>
        )}
      </div>
=======
                onClick={() => navigate(`/aluno/curso/${cursoId}/avaliacao-final`)}
              >
                {podeAvaliacaoFinal ? (
                  <>Iniciar Avaliação Final</>
                ) : (
                  <>
                    <Lock size={16} />
                    Bloqueado
                  </>
                )}
              </Button>
            )}
          </Card>
        )}
      </div>

      <AIAgent />
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    </div>
  );
}
