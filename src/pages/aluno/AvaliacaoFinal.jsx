import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Badge } from '../../components/ui';
import { ArrowLeft, CheckCircle, XCircle, Award, Trophy } from 'lucide-react';

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
          }}>
            <div style={{
              width: '80px',
              height: '80px',
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
            }}>
              {resultado.aprovado ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: '700',
              color: resultado.aprovado ? '#166534' : '#991b1b',
              marginBottom: 'var(--space-sm)'
            }}>
              {resultado.aprovado ? 'Parabéns!' : 'Não foi dessa vez'}
            </h1>

            <p style={{
              fontSize: '1rem',
              color: resultado.aprovado ? '#166534' : '#991b1b',
              marginBottom: 'var(--space-lg)'
            }}>
              {resultado.aprovado 
                ? 'Você concluiu o curso com sucesso!'
                : 'Continue estudando e tente novamente'}
            </p>

            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
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
              </span>
            </div>
          </div>

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
        </div>
      </div>
    );
  }

  return (
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
        </Button>
      </div>
    </div>
  );
}
