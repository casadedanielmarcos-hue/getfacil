import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Card, Button, Badge } from '../../components/ui';
import { CheckCircle, XCircle } from 'lucide-react';

export function AvaliacaoPage() {
  const { cursoId, avaliacaoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, salvarAvaliacao, getProgressoCurso } = useData();
  const [respostas, setRespostas] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [resultado, setResultado] = useState(null);

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);

  const avaliacao = useMemo(() => {
    if (!curso) return null;
    for (const modulo of curso.modules) {
      if (modulo.quiz?.id === avaliacaoId) return modulo.quiz;
    }
    return null;
  }, [curso, avaliacaoId]);

  const quizJaFeito = progressoAluno?.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);

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
    salvarAvaliacao(user.id, cursoId, avaliacaoId, nota, respostasArray, false);
    setResultado({ nota, acertos, total: avaliacao.questions.length });
    setSubmitted(true);
  };

  const todasRespondidas = avaliacao?.questions.every(q => respostas[q.id] !== undefined);

  const opcaoStyle = (questaoId, index) => {
    const isSelected = respostas[questaoId] === index;
    const q = avaliacao.questions.find(q => q.id === questaoId);
    const isCorreta = q?.correct === index;

    if (submitted) {
      if (isCorreta) return {
        border: '1px solid rgba(0,255,136,0.5)',
        background: 'rgba(0,255,136,0.08)',
        color: '#00ff88'
      };
      if (isSelected) return {
        border: '1px solid rgba(255,68,102,0.5)',
        background: 'rgba(255,68,102,0.08)',
        color: '#ff4466'
      };
    } else if (isSelected) {
      return {
        border: '1px solid rgba(0,212,255,0.5)',
        background: 'rgba(0,212,255,0.1)',
        color: '#00d4ff'
      };
    }
    return {
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.03)',
      color: '#ffffff'
    };
  };

  if (!curso || !avaliacao) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StarfieldBackground />
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Quiz não encontrado</p>
      </div>
    );
  }

  // Already completed view
  if (quizJaFeito && !submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '60px' }}>
        <StarfieldBackground />
        <Header showBack backTo={`/curso/${cursoId}`} backLabel="Voltar ao curso" />
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            {avaliacao.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', marginBottom: '24px' }}>
            Você já completou este quiz
          </p>

          <div style={{
            textAlign: 'center',
            padding: '32px',
            borderRadius: '16px',
            background: quizJaFeito.nota >= 6 ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,102,0.08)',
            border: `1px solid ${quizJaFeito.nota >= 6 ? 'rgba(0,255,136,0.25)' : 'rgba(255,68,102,0.25)'}`,
            marginBottom: '20px'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: quizJaFeito.nota >= 6 ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,102,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              color: quizJaFeito.nota >= 6 ? '#00ff88' : '#ff4466'
            }}>
              {quizJaFeito.nota >= 6 ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3rem',
              fontWeight: '700',
              color: quizJaFeito.nota >= 6 ? '#00ff88' : '#ff4466'
            }}>
              {quizJaFeito.nota}
            </div>
            <p style={{
              color: quizJaFeito.nota >= 6 ? '#00ff88' : '#ff4466',
              marginTop: '4px',
              fontFamily: 'var(--font-body)'
            }}>
              {quizJaFeito.nota >= 6 ? 'Aprovado!' : 'Não aprovado'}
            </p>
          </div>

          <Button fullWidth onClick={() => navigate(`/curso/${cursoId}`)}>
            Voltar ao Curso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '60px' }}>
      <StarfieldBackground />
      <Header showBack backTo={`/curso/${cursoId}`} backLabel="Voltar ao curso" />

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '6px'
        }}>
          {avaliacao.title}
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-body)',
          marginBottom: '24px'
        }}>
          {avaliacao.questions.length} questões • Nota mínima: 6
        </p>

        {/* Result banner */}
        {submitted && resultado && (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            borderRadius: '12px',
            background: resultado.nota >= 6 ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,102,0.08)',
            border: `1px solid ${resultado.nota >= 6 ? 'rgba(0,255,136,0.25)' : 'rgba(255,68,102,0.25)'}`,
            marginBottom: '24px'
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: resultado.nota >= 6 ? '#00ff88' : '#ff4466'
            }}>
              {resultado.nota}
            </div>
            <p style={{
              color: resultado.nota >= 6 ? '#00ff88' : '#ff4466',
              fontFamily: 'var(--font-body)',
              marginTop: '4px'
            }}>
              {resultado.nota >= 6 ? 'Parabéns! Aprovado!' : 'Não foi dessa vez...'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
              {resultado.acertos} de {resultado.total} corretas
            </p>
          </div>
        )}

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
                const isCorreta = submitted && questao.correct === oIndex;
                const isWrong = submitted && isSelected && !isCorreta;
                const style = opcaoStyle(questao.id, oIndex);

                return (
                  <div
                    key={oIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      ...style
                    }}
                    onClick={() => handleSelectOption(questao.id, oIndex)}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${style.color}`,
                      background: isSelected || isCorreta ? style.color : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}>
                      {isCorreta && submitted && <CheckCircle size={12} color="#000" />}
                      {isWrong && <XCircle size={12} color="#000" />}
                      {!submitted && isSelected && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
                      )}
                    </div>
                    <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                      {opcao}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <Button
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={!todasRespondidas}
          >
            {todasRespondidas ? 'Enviar Respostas' : 'Responda todas as questões'}
          </Button>
        ) : (
          <Button fullWidth size="large" onClick={() => navigate(`/curso/${cursoId}`)}>
            Voltar ao Curso
          </Button>
        )}
      </div>
    </div>
  );
}
