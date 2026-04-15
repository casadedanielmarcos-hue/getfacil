import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { CheckCircle, XCircle, Award, Trophy } from 'lucide-react';

export function AvaliacaoFinal() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, salvarAvaliacao, getProgressoCurso } = useData();

  const [respostas, setRespostas] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [resultado, setResultado] = useState(null);

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);
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
          }}>
            <div style={{
              width: '80px',
              height: '80px',
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
            }}>
              {resultado.aprovado ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: '800',
              color: resultado.aprovado ? '#00ff88' : '#ff4466',
              marginBottom: '8px',
              textShadow: resultado.aprovado
                ? '0 0 20px rgba(0,255,136,0.5)'
                : '0 0 20px rgba(255,68,102,0.5)'
            }}>
              {resultado.aprovado ? 'Parabéns!' : 'Não foi dessa vez'}
            </h1>

            <p style={{
              color: resultado.aprovado ? 'rgba(0,255,136,0.7)' : 'rgba(255,68,102,0.7)',
              fontFamily: 'var(--font-body)',
              marginBottom: '24px'
            }}>
              {resultado.aprovado
                ? 'Você concluiu o curso com sucesso!'
                : 'Continue estudando e tente novamente'}
            </p>

            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
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
              </span>
            </div>
          </div>

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
        </div>
      </div>
    );
  }

  return (
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
        </Button>
      </div>
    </div>
  );
}
