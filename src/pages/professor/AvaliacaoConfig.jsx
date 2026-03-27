import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Input } from '../../components/ui';
import { ArrowLeft, Plus, Trash2, FileText, Check } from 'lucide-react';

export function AvaliacaoConfig() {
  const { cursoId, moduloId } = useParams();
  const navigate = useNavigate();
  const { cursos, adicionarAvaliacaoModulo } = useData();
  
  const [titulo, setTitulo] = useState('');
  const [questoes, setQuestoes] = useState([
    {
      id: `q-${Date.now()}`,
      pergunta: '',
      opcoes: ['', '', '', ''],
      correta: 0
    }
  ]);

  const curso = cursos.find(c => c.id === cursoId);
  const modulo = curso?.modulos.find(m => m.id === moduloId);

  if (!curso || !modulo) {
    return <div>Módulo não encontrado</div>;
  }

  const handleAddQuestao = () => {
    setQuestoes([
      ...questoes,
      {
        id: `q-${Date.now()}`,
        pergunta: '',
        opcoes: ['', '', '', ''],
        correta: 0
      }
    ]);
  };

  const handleRemoveQuestao = (index) => {
    if (questoes.length > 1) {
      setQuestoes(questoes.filter((_, i) => i !== index));
    }
  };

  const handleQuestaoChange = (index, field, value) => {
    const novasQuestoes = [...questoes];
    novasQuestoes[index][field] = value;
    setQuestoes(novasQuestoes);
  };

  const handleOpcaoChange = (questaoIndex, opcaoIndex, value) => {
    const novasQuestoes = [...questoes];
    novasQuestoes[questaoIndex].opcoes[opcaoIndex] = value;
    setQuestoes(novasQuestoes);
  };

  const handleCorretaChange = (questaoIndex, opcaoIndex) => {
    const novasQuestoes = [...questoes];
    novasQuestoes[questaoIndex].correta = opcaoIndex;
    setQuestoes(novasQuestoes);
  };

  const handleSalvar = () => {
    // Validações
    if (!titulo.trim()) {
      alert('Digite o título da avaliação');
      return;
    }

    for (let i = 0; i < questoes.length; i++) {
      if (!questoes[i].pergunta.trim()) {
        alert(`Preencha a pergunta da questão ${i + 1}`);
        return;
      }
      
      const opcoesPreenchidas = questoes[i].opcoes.filter(o => o.trim());
      if (opcoesPreenchidas.length < 2) {
        alert(`A questão ${i + 1} precisa de pelo menos 2 opções`);
        return;
      }
    }

    const avaliacao = {
      titulo: titulo.trim(),
      questoes: questoes.map((q, i) => ({
        id: `av-${moduloId}-q${i}`,
        pergunta: q.pergunta.trim(),
        opcoes: q.opcoes.filter(o => o.trim()),
        correta: q.correta
      }))
    };

    adicionarAvaliacaoModulo(cursoId, moduloId, avaliacao);
    navigate(`/professor/curso/${cursoId}`);
  };

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
    textAlign: 'center',
    marginBottom: 'var(--space-xl)'
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
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
    marginBottom: 'var(--space-xs)'
  };

  const subtitleStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  };

  const questaoCardStyle = {
    marginBottom: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  };

  const questaoHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-md)'
  };

  const questaoNumStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    color: 'var(--blue-600)'
  };

  const removeButtonStyle = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    background: '#fee2e2',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const opcoesContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-md)'
  };

  const opcaoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const radioStyle = (isSelected) => ({
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    border: `2px solid ${isSelected ? 'var(--blue-600)' : 'var(--border)'}`,
    background: isSelected ? 'var(--blue-600)' : 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  });

  const opcaoInputStyle = {
    flex: 1,
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    fontSize: '0.95rem'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: 'var(--space-sm)'
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate(`/professor/curso/${cursoId}`)}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <FileText size={28} />
          </div>
          <h1 style={titleStyle}>Nova Avaliação</h1>
          <p style={subtitleStyle}>{modulo.nome}</p>
        </div>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Input
            label="Título da Avaliação"
            placeholder="Ex: Avaliação do Módulo 1"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {questoes.map((questao, qIndex) => (
          <Card key={questao.id} style={questaoCardStyle}>
            <div style={questaoHeaderStyle}>
              <span style={questaoNumStyle}>Questão {qIndex + 1}</span>
              {questoes.length > 1 && (
                <button 
                  style={removeButtonStyle}
                  onClick={() => handleRemoveQuestao(qIndex)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <textarea
              placeholder="Digite a pergunta..."
              value={questao.pergunta}
              onChange={(e) => handleQuestaoChange(qIndex, 'pergunta', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />

            <p style={labelStyle}>Clique no círculo para marcar a resposta correta:</p>

            <div style={opcoesContainerStyle}>
              {questao.opcoes.map((opcao, oIndex) => (
                <div key={oIndex} style={opcaoRowStyle}>
                  <div 
                    style={radioStyle(questao.correta === oIndex)}
                    onClick={() => handleCorretaChange(qIndex, oIndex)}
                  >
                    {questao.correta === oIndex && <Check size={14} color="white" />}
                  </div>
                  <input
                    type="text"
                    placeholder={`Opção ${oIndex + 1}`}
                    value={opcao}
                    onChange={(e) => handleOpcaoChange(qIndex, oIndex, e.target.value)}
                    style={opcaoInputStyle}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={handleAddQuestao}
          style={{ marginBottom: 'var(--space-lg)' }}
        >
          <Plus size={18} />
          Adicionar Questão
        </Button>

        <Button 
          fullWidth 
          size="large"
          onClick={handleSalvar}
        >
          Salvar Avaliação
        </Button>
      </div>
    </div>
  );
}
