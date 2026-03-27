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
  ChevronUp,
  FileText,
  Award
} from 'lucide-react';

export function CursoView() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    );
  }, [curso, progressoAluno]);

  const podeAvaliacaoFinal = todasAulasAssistidas && todasAvaliacoesModuloFeitas;

  if (!curso || !progressoAluno) {
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
          </div>
          <ProgressBar value={percentualProgresso} showLabel={false} size="large" />
        </div>

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
                        </div>
                      </div>
                    );
                  })}

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
                      )}
                    </button>
                  )}
                </div>
              )}
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
                </p>
              </div>
            </div>

            {progressoAluno.avaliacaoFinal ? (
              <div style={{
                padding: 'var(--space-md)',
                background: progressoAluno.resultado === 'aprovado' ? '#dcfce7' : '#fee2e2',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <Badge variant={progressoAluno.resultado === 'aprovado' ? 'success' : 'error'}>
                  {progressoAluno.resultado === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                </Badge>
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
                    Ver Certificado
                  </Button>
                )}
              </div>
            ) : (
              <Button
                fullWidth
                disabled={!podeAvaliacaoFinal}
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
    </div>
  );
}
