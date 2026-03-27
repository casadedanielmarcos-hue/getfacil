import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Input } from '../../components/ui';
import { ArrowLeft, Image, BookOpen } from 'lucide-react';

export function NovoCurso() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { adicionarCurso } = useData();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capa, setCapa] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Digite o nome do curso');
      return;
    }

    setLoading(true);

    const novoCurso = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      capa: capa.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      professorId: user.id
    };

    adicionarCurso(novoCurso);
    
    setTimeout(() => {
      navigate('/professor');
    }, 500);
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

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)'
  };

  const previewStyle = {
    marginTop: 'var(--space-md)'
  };

  const previewLabelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--space-sm)',
    display: 'block'
  };

  const previewCardStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)'
  };

  const previewImageStyle = {
    width: '100px',
    height: '70px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    background: 'var(--blue-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--blue-400)',
    flexShrink: 0
  };

  const previewInfoStyle = {
    flex: 1
  };

  const previewTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem',
    color: nome ? 'var(--text-primary)' : 'var(--text-muted)'
  };

  const previewDescStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '4px'
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate('/professor')}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <BookOpen size={28} />
          </div>
          <h1 style={titleStyle}>Novo Curso</h1>
          <p style={subtitleStyle}>Preencha as informações básicas</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <Input
            label="Nome do Curso *"
            placeholder="Ex: Introdução à Programação"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-xs)'
            }}>
              Descrição
            </label>
            <textarea
              placeholder="Descreva o conteúdo do curso..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          <Input
            label="URL da Imagem de Capa"
            placeholder="https://exemplo.com/imagem.jpg"
            value={capa}
            onChange={(e) => setCapa(e.target.value)}
            type="url"
          />

          <div style={previewStyle}>
            <span style={previewLabelStyle}>Pré-visualização</span>
            <Card style={previewCardStyle}>
              {capa ? (
                <img 
                  src={capa} 
                  alt="Preview" 
                  style={previewImageStyle}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div style={previewImageStyle}>
                  <Image size={24} />
                </div>
              )}
              <div style={previewInfoStyle}>
                <div style={previewTitleStyle}>
                  {nome || 'Nome do curso'}
                </div>
                <div style={previewDescStyle}>
                  {descricao || 'Descrição do curso aparecerá aqui...'}
                </div>
              </div>
            </Card>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="large"
            disabled={loading || !nome.trim()}
          >
            {loading ? 'Criando...' : 'Criar Curso'}
          </Button>
        </form>
      </div>
    </div>
  );
}
