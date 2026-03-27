import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Badge } from '../../components/ui';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  
  // Encontrar a avaliação
  const avaliacao = useMemo(() => {
    if (!curso) return null;
    
    for (const modulo of curso.modulos) {
      if (modulo.avaliacao?.id === avaliacaoId) {
        return modulo.avaliacao;
      }
    }
    return null;
  }, [curso, avaliacaoId]);

  // Verificar se já foi feita
  const avaliacaoJaFeita = progressoAluno?.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);

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
    
    // Salvar resultado
    const respostasArray = avaliacao.questoes.map(q => respostas[q.id] ?? -1);
    salvarAvaliacao(user.id, cursoId, avaliacaoId, nota, respostasArray, false);
    
    setResultado({ nota, acertos, total: avaliacao.questoes.length });
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
    marginBottom: 'var(--space-xl)'
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

  const resultadoStyle = {
    textAlign: 'center',
    padding: 'var(--space-xl)',
    background: resultado?.nota >= 6 ? '#dcfce7' : '#fee2e2',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 'var(--space-xl)'
  };

  const resultadoIconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-full)',
    background: resultado?.nota >= 6 ? '#22c55e' : '#ef4444',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto var(--space-md)'
  };

  const resultadoNotaStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '3rem',
    fontWeight: '700',
    color: resultado?.nota >= 6 ? '#166534' : '#991b1b'
  };

  const resultadoTextStyle = {
    fontSize: '1rem',
    color: resultado?.nota >= 6 ? '#166534' : '#991b1b',
    marginTop: 'var(--space-sm)'
  };

  // Se já foi feita, mostrar resultado anterior
  if (avaliacaoJaFeita && !submitted) {
    return (
      <div style={pageStyle}>
        <Header />
        
        <button style={backButtonStyle} onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
          <ArrowLeft size={18} />
          Voltar ao curso
        </button>

        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>{avaliacao.titulo}</h1>
            <p style={subtitleStyle}>Você já completou esta avaliação</p>
          </div>

          <div style={{
            ...resultadoStyle,
            background: avaliacaoJaFeita.nota >= 6 ? '#dcfce7' : '#fee2e2'
          }}>
            <div style={{
              ...resultadoIconStyle,
              background: avaliacaoJaFeita.nota >= 6 ? '#22c55e' : '#ef4444'
            }}>
              {avaliacaoJaFeita.nota >= 6 ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div style={{
              ...resultadoNotaStyle,
              color: avaliacaoJaFeita.nota >= 6 ? '#166534' : '#991b1b'
            }}>
              {avaliacaoJaFeita.nota}
            </div>
            <p style={{
              ...resultadoTextStyle,
              color: avaliacaoJaFeita.nota >= 6 ? '#166534' : '#991b1b'
            }}>
              {avaliacaoJaFeita.nota >= 6 ? 'Aprovado!' : 'Não aprovado'}
            </p>
            <Badge variant="info" style={{ marginTop: 'var(--space-md)' }}>
              Tentativa {avaliacaoJaFeita.tentativa}
            </Badge>
          </div>

          <Button fullWidth onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
            Voltar ao Curso
          </Button>
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
          <h1 style={titleStyle}>{avaliacao.titulo}</h1>
          <p style={subtitleStyle}>
            {avaliacao.questoes.length} questões • Nota mínima: 6
          </p>
        </div>

        {submitted && resultado && (
          <div style={resultadoStyle}>
            <div style={resultadoIconStyle}>
              {resultado.nota >= 6 ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div style={resultadoNotaStyle}>{resultado.nota}</div>
            <p style={resultadoTextStyle}>
              {resultado.nota >= 6 ? 'Parabéns! Você foi aprovado!' : 'Não foi dessa vez...'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              {resultado.acertos} de {resultado.total} questões corretas
            </p>
          </div>
        )}

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
                    {submitted && questao.correta === oIndex && (
                      <CheckCircle size={14} color="white" />
                    )}
                    {submitted && respostas[questao.id] === oIndex && questao.correta !== oIndex && (
                      <XCircle size={14} color="white" />
                    )}
                    {!submitted && respostas[questao.id] === oIndex && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />
                    )}
                  </div>
                  <span style={{ flex: 1 }}>{opcao}</span>
                </div>
              ))}
            </div>
          </Card>
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
          <Button fullWidth size="large" onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
            Voltar ao Curso
          </Button>
        )}
      </div>
    </div>
  );
}
