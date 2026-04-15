import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
<<<<<<< HEAD
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { CheckCircle, XCircle, Award, Trophy } from 'lucide-react';
=======
import { Header } from '../../components/ui/Header';
import { Card, Button, Badge } from '../../components/ui';
import { ArrowLeft, CheckCircle, XCircle, Award, Trophy } from 'lucide-react';
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

export function AvaliacaoFinal() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, salvarAvaliacao, getProgressoCurso } = useData();
<<<<<<< HEAD

=======
  
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  const [respostas, setRespostas] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [resultado, setResultado] = useState(null);

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);
<<<<<<< HEAD
  const avaliacao = curso?.finalExam;

  const handleSelectOption = (questaoId, opcaoIndex) => {
    if (submitted) return;
    setRespostas(prev => ({ ...prev, [questaoId]: opcaoIndex }));
  };

  const handleSubmit = () => {
    let acertos = 0;
    avaliacao.questions.forEach(q => {
      if (respostas[q.id] === q.correct) acertos++;
    });
    const nota = Math.round((acertos / avaliacao.questions.length) * 10);
    const respostasArray = avaliacao.questions.map(q => respostas[q.id] ?? -1);
    salvarAvaliacao(user.id, cursoId, avaliacao.id, nota, respostasArray, true);
    setResultado({ nota, acertos, total: avaliacao.questions.length, aprovado: nota >= 6 });
    setSubmitted(true);
  };

  const todasRespondidas = avaliacao?.questions.every(q => respostas[q.id] !== undefined);

  const opcaoStyle = (questaoId, index) => {
    const isSelected = respostas[questaoId] === index;
    const q = avaliacao.questions.find(q => q.id === questaoId);
    const isCorreta = q?.correct === index;

    if (submitted) {
      if (isCorreta) return { border: '1px solid rgba(0,255,136,0.5)', background: 'rgba(0,255,136,0.08)', color: '#00ff88' };
      if (isSelected) return { border: '1px solid rgba(255,68,102,0.5)', background: 'rgba(255,68,102,0.08)', color: '#ff4466' };
    } else if (isSelected) {
      return { border: '1px solid rgba(0,212,255,0.5)', background: 'rgba(0,212,255,0.1)', color: '#00d4ff' };
    }
    return { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#ffffff' };
  };

  if (!curso || !avaliacao) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StarfieldBackground />
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Avaliação não encontrada</p>
      </div>
    );
  }

  // Result screen
  if (submitted && resultado) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '60px' }}>
        <StarfieldBackground />
        <Header showBack backTo={`/curso/${cursoId}`} backLabel={resultado.aprovado ? 'Ver curso' : 'Voltar'} />

        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
          {/* Result hero */}
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            borderRadius: '20px',
            background: resultado.aprovado
              ? 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,212,170,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255,68,102,0.08) 0%, rgba(204,0,51,0.05) 100%)',
            border: `1px solid ${resultado.aprovado ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,102,0.2)'}`,
            marginBottom: '24px'
=======
  const avaliacao = curso?.avaliacaoFinal;

  if (!curso || !avaliacao) {
    return <div>Avaliação não encontrada</div>;
  }

  const handleSelectOption = (questaoId, opcaoIndex) => {
    if (submitted) return;
    setRespostas(prev => ({
      ...prev,
      [questaoId]: opcaoIndex
    }));
  };

  const handleSubmit = () => {
    // Calcular nota
    let acertos = 0;
    avaliacao.questoes.forEach(q => {
      if (respostas[q.id] === q.correta) {
        acertos++;
      }
    });
    
    const nota = Math.round((acertos / avaliacao.questoes.length) * 10);
    
    // Salvar resultado como avaliação final
    const respostasArray = avaliacao.questoes.map(q => respostas[q.id] ?? -1);
    salvarAvaliacao(user.id, cursoId, avaliacao.id, nota, respostasArray, true);
    
    setResultado({ nota, acertos, total: avaliacao.questoes.length, aprovado: nota >= 6 });
    setSubmitted(true);
  };

  const todasRespondidas = avaliacao.questoes.every(q => respostas[q.id] !== undefined);

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

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: 'var(--space-xl)',
    textAlign: 'center'
  };

  const iconContainerStyle = {
    width: '72px',
    height: '72px',
    borderRadius: 'var(--radius-xl)',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    margin: '0 auto var(--space-md)',
    boxShadow: 'var(--shadow-lg)'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-sm)'
  };

  const subtitleStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  };

  const warningStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: '#fef3c7',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-xl)',
    fontSize: '0.875rem',
    color: '#92400e'
  };

  const questaoStyle = {
    marginBottom: 'var(--space-lg)'
  };

  const questaoNumeroStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--blue-600)',
    marginBottom: 'var(--space-xs)'
  };

  const questaoPerguntaStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-md)'
  };

  const opcoesStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)'
  };

  const opcaoStyle = (questaoId, index) => {
    const isSelected = respostas[questaoId] === index;
    const questao = avaliacao.questoes.find(q => q.id === questaoId);
    const isCorreta = questao?.correta === index;
    
    let background = 'white';
    let borderColor = 'var(--border)';
    let color = 'var(--text-primary)';
    
    if (submitted) {
      if (isCorreta) {
        background = '#dcfce7';
        borderColor = '#86efac';
        color = '#166534';
      } else if (isSelected && !isCorreta) {
        background = '#fee2e2';
        borderColor = '#fca5a5';
        color = '#991b1b';
      }
    } else if (isSelected) {
      background = 'var(--blue-50)';
      borderColor = 'var(--blue-400)';
      color = 'var(--blue-700)';
    }
    
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${borderColor}`,
      background,
      color,
      cursor: submitted ? 'default' : 'pointer',
      transition: 'all var(--transition-fast)'
    };
  };

  const radioStyle = (questaoId, index) => {
    const isSelected = respostas[questaoId] === index;
    const questao = avaliacao.questoes.find(q => q.id === questaoId);
    const isCorreta = questao?.correta === index;
    
    let background = 'white';
    let borderColor = 'var(--border)';
    
    if (submitted) {
      if (isCorreta) {
        background = '#22c55e';
        borderColor = '#22c55e';
      } else if (isSelected) {
        background = '#ef4444';
        borderColor = '#ef4444';
      }
    } else if (isSelected) {
      background = 'var(--blue-600)';
      borderColor = 'var(--blue-600)';
    }
    
    return {
      width: '22px',
      height: '22px',
      borderRadius: 'var(--radius-full)',
      border: `2px solid ${borderColor}`,
      background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    };
  };

  // Tela de resultado final
  if (submitted && resultado) {
    return (
      <div style={pageStyle}>
        <Header />

        <div style={contentStyle}>
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-lg)',
            background: resultado.aprovado 
              ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
              : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-xl)'
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
          }}>
            <div style={{
              width: '80px',
              height: '80px',
<<<<<<< HEAD
              borderRadius: '50%',
              background: resultado.aprovado ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,102,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: resultado.aprovado ? '#00ff88' : '#ff4466',
              boxShadow: resultado.aprovado
                ? '0 0 30px rgba(0,255,136,0.3)'
                : '0 0 30px rgba(255,68,102,0.3)'
=======
              borderRadius: 'var(--radius-full)',
              background: resultado.aprovado ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto var(--space-lg)',
              boxShadow: resultado.aprovado 
                ? '0 8px 32px rgba(34, 197, 94, 0.4)'
                : '0 8px 32px rgba(239, 68, 68, 0.4)'
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            }}>
              {resultado.aprovado ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
<<<<<<< HEAD
              fontSize: '1.75rem',
              fontWeight: '800',
              color: resultado.aprovado ? '#00ff88' : '#ff4466',
              marginBottom: '8px',
              textShadow: resultado.aprovado
                ? '0 0 20px rgba(0,255,136,0.5)'
                : '0 0 20px rgba(255,68,102,0.5)'
=======
              fontSize: '2rem',
              fontWeight: '700',
              color: resultado.aprovado ? '#166534' : '#991b1b',
              marginBottom: 'var(--space-sm)'
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            }}>
              {resultado.aprovado ? 'Parabéns!' : 'Não foi dessa vez'}
            </h1>

            <p style={{
<<<<<<< HEAD
              color: resultado.aprovado ? 'rgba(0,255,136,0.7)' : 'rgba(255,68,102,0.7)',
              fontFamily: 'var(--font-body)',
              marginBottom: '24px'
            }}>
              {resultado.aprovado
=======
              fontSize: '1rem',
              color: resultado.aprovado ? '#166534' : '#991b1b',
              marginBottom: 'var(--space-lg)'
            }}>
              {resultado.aprovado 
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
                ? 'Você concluiu o curso com sucesso!'
                : 'Continue estudando e tente novamente'}
            </p>

            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
<<<<<<< HEAD
              padding: '16px 32px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: `1px solid ${resultado.aprovado ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,102,0.2)'}`
            }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>Sua nota</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                fontWeight: '800',
                color: resultado.aprovado ? '#00ff88' : '#ff4466'
              }}>
                {resultado.nota}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                {resultado.acertos}/{resultado.total} acertos
=======
              padding: 'var(--space-lg)',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sua nota</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                fontWeight: '700',
                color: resultado.aprovado ? '#22c55e' : '#ef4444'
              }}>
                {resultado.nota}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {resultado.acertos} de {resultado.total} acertos
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
              </span>
            </div>
          </div>

<<<<<<< HEAD
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {resultado.aprovado ? (
              <>
                <Button fullWidth size="large" onClick={() => navigate(`/certificado/${cursoId}`)}>
                  <Award size={18} />
                  Ver Certificado
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
                  Voltar aos Cursos
                </Button>
              </>
            ) : (
              <Button fullWidth size="large" onClick={() => navigate(`/curso/${cursoId}`)}>
                Voltar ao Curso
              </Button>
            )}
          </div>

          {/* Question review */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '14px'
          }}>
            Revisão das questões
          </h2>
          {avaliacao.questions.map((questao, qIndex) => (
            <div key={questao.id} style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,212,255,0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <p style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#00d4ff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'var(--font-body)',
                marginBottom: '6px'
              }}>
                Questão {qIndex + 1}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {questao.question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {questao.options.map((opcao, oIndex) => {
                  const style = opcaoStyle(questao.id, oIndex);
                  const isCorreta = questao.correct === oIndex;
                  const isWrong = respostas[questao.id] === oIndex && !isCorreta;
                  return (
                    <div key={oIndex} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      ...style
                    }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: `2px solid ${style.color}`,
                        background: isCorreta || isWrong ? style.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isCorreta && <CheckCircle size={11} color="#000" />}
                        {isWrong && <XCircle size={11} color="#000" />}
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>{opcao}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
=======
          {resultado.aprovado ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Button 
                fullWidth 
                size="large"
                onClick={() => navigate(`/aluno/certificado/${cursoId}`)}
              >
                <Award size={20} />
                Ver Certificado
              </Button>
              <Button 
                variant="secondary"
                fullWidth
                onClick={() => navigate('/aluno')}
              >
                Voltar aos Cursos
              </Button>
            </div>
          ) : (
            <Button fullWidth size="large" onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
              Voltar ao Curso
            </Button>
          )}

          {/* Revisão das questões */}
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: 'var(--space-lg)',
              color: 'var(--text-primary)'
            }}>
              Revisão das Questões
            </h2>

            {avaliacao.questoes.map((questao, qIndex) => (
              <Card key={questao.id} style={questaoStyle}>
                <div style={questaoNumeroStyle}>Questão {qIndex + 1}</div>
                <div style={questaoPerguntaStyle}>{questao.pergunta}</div>
                
                <div style={opcoesStyle}>
                  {questao.opcoes.map((opcao, oIndex) => (
                    <div key={oIndex} style={opcaoStyle(questao.id, oIndex)}>
                      <div style={radioStyle(questao.id, oIndex)}>
                        {questao.correta === oIndex && (
                          <CheckCircle size={14} color="white" />
                        )}
                        {respostas[questao.id] === oIndex && questao.correta !== oIndex && (
                          <XCircle size={14} color="white" />
                        )}
                      </div>
                      <span style={{ flex: 1 }}>{opcao}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '60px' }}>
      <StarfieldBackground />
      <Header showBack backTo={`/curso/${cursoId}`} backLabel="Voltar ao curso" />

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(0,212,255,0.4)'
          }}>
            <Award size={32} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '6px'
          }}>
            Prova Final
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-body)'
          }}>
            {curso.title} • {avaliacao.questions.length} questões
          </p>
        </div>

        {/* Warning */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '14px 16px',
          background: 'rgba(255,170,0,0.08)',
          border: '1px solid rgba(255,170,0,0.25)',
          borderRadius: '10px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: '#ffaa00',
          fontFamily: 'var(--font-body)'
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <span>
            <strong>Atenção:</strong> Nota mínima 6 para aprovação e emissão do certificado.
          </span>
        </div>

        {/* Questions */}
        {avaliacao.questions.map((questao, qIndex) => (
          <div key={questao.id} style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '14px'
          }}>
            <p style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#00d4ff',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'var(--font-body)',
              marginBottom: '6px'
            }}>
              Questão {qIndex + 1}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '14px',
              lineHeight: '1.4'
            }}>
              {questao.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {questao.options.map((opcao, oIndex) => {
                const isSelected = respostas[questao.id] === oIndex;
                const style = opcaoStyle(questao.id, oIndex);
                return (
                  <div
                    key={oIndex}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '8px',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      ...style
                    }}
                    onClick={() => handleSelectOption(questao.id, oIndex)}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${style.color}`,
                      background: isSelected ? style.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s ease'
                    }}>
                      {isSelected && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
                      )}
                    </div>
                    <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>{opcao}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <Button
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={!todasRespondidas}
        >
          {todasRespondidas ? 'Finalizar Prova' : 'Responda todas as questões'}
=======
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
        <ArrowLeft size={18} />
        Voltar ao curso
      </button>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <Award size={36} />
          </div>
          <h1 style={titleStyle}>Avaliação Final</h1>
          <p style={subtitleStyle}>
            {curso.nome} • {avaliacao.questoes.length} questões
          </p>
        </div>

        <div style={warningStyle}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <div>
            <strong>Atenção:</strong> Esta é a avaliação final do curso. 
            Você precisa de nota mínima 6 para ser aprovado e receber seu certificado.
          </div>
        </div>

        {avaliacao.questoes.map((questao, qIndex) => (
          <Card key={questao.id} style={questaoStyle}>
            <div style={questaoNumeroStyle}>Questão {qIndex + 1}</div>
            <div style={questaoPerguntaStyle}>{questao.pergunta}</div>
            
            <div style={opcoesStyle}>
              {questao.opcoes.map((opcao, oIndex) => (
                <div
                  key={oIndex}
                  style={opcaoStyle(questao.id, oIndex)}
                  onClick={() => handleSelectOption(questao.id, oIndex)}
                >
                  <div style={radioStyle(questao.id, oIndex)}>
                    {respostas[questao.id] === oIndex && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />
                    )}
                  </div>
                  <span style={{ flex: 1 }}>{opcao}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Button 
          fullWidth 
          size="large" 
          onClick={handleSubmit}
          disabled={!todasRespondidas}
        >
          {todasRespondidas ? 'Finalizar Avaliação' : 'Responda todas as questões'}
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
        </Button>
      </div>
    </div>
  );
}
