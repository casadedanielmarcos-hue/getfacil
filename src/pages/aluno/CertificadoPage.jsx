import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { ArrowLeft, Download, Share2, Award } from 'lucide-react';

export function CertificadoPage() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso } = useData();

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);

  if (!curso || !progressoAluno || progressoAluno.resultado !== 'aprovado') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Certificado não disponível
      </div>
    );
  }

  const dataEmissao = progressoAluno.dataFim 
    ? new Date(progressoAluno.dataFim).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const codigoCertificado = `GF-${Date.now().toString(36).toUpperCase()}`;

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--blue-50) 0%, var(--blue-100) 100%)'
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
    maxWidth: '500px',
    margin: '0 auto'
  };

  const certificadoStyle = {
    background: 'white',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-xl)',
    boxShadow: 'var(--shadow-xl)',
    border: '4px solid var(--blue-200)',
    position: 'relative',
    overflow: 'hidden'
  };

  const decorStyle = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, var(--blue-100) 0%, var(--blue-200) 100%)',
    borderRadius: 'var(--radius-full)',
    opacity: 0.5
  };

  const decor2Style = {
    position: 'absolute',
    bottom: '-30px',
    left: '-30px',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, var(--blue-100) 0%, var(--blue-200) 100%)',
    borderRadius: 'var(--radius-full)',
    opacity: 0.5
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 'var(--space-xl)',
    position: 'relative',
    zIndex: 1
  };

  const logoStyle = {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    margin: '0 auto var(--space-md)',
    boxShadow: 'var(--shadow-md)'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-800) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 'var(--space-xs)'
  };

  const subtitleStyle = {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  };

  const bodyStyle = {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  };

  const certifyTextStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: 'var(--space-md)'
  };

  const nameStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-lg)',
    padding: 'var(--space-sm) 0',
    borderBottom: '2px solid var(--blue-200)'
  };

  const completedTextStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: 'var(--space-sm)'
  };

  const courseNameStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--blue-700)',
    marginBottom: 'var(--space-lg)'
  };

  const dateStyle = {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: 'var(--space-lg)'
  };

  const codeStyle = {
    display: 'inline-block',
    padding: 'var(--space-xs) var(--space-md)',
    background: 'var(--blue-50)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    color: 'var(--blue-600)',
    fontFamily: 'monospace',
    letterSpacing: '1px'
  };

  const badgeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: 'var(--radius-md)',
    color: '#92400e',
    fontWeight: '600',
    fontSize: '0.9rem'
  };

  const actionsStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-xl)'
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate('/aluno')}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={contentStyle}>
        <div style={certificadoStyle}>
          <div style={decorStyle} />
          <div style={decor2Style} />

          <div style={headerStyle}>
            <div style={logoStyle}>
              <Award size={28} />
            </div>
            <h1 style={titleStyle}>Get Fácil</h1>
            <p style={subtitleStyle}>Certificado de Conclusão</p>
          </div>

          <div style={bodyStyle}>
            <p style={certifyTextStyle}>Certificamos que</p>
            <h2 style={nameStyle}>{user.nome}</h2>
            
            <p style={completedTextStyle}>concluiu com êxito o curso</p>
            <h3 style={courseNameStyle}>{curso.nome}</h3>
            
            <p style={dateStyle}>
              Emitido em {dataEmissao}
            </p>

            <div style={codeStyle}>
              {codigoCertificado}
            </div>

            <div style={badgeStyle}>
              <Award size={20} />
              Nota Final: {progressoAluno.avaliacaoFinal?.nota || 10}
            </div>
          </div>
        </div>

        <div style={actionsStyle}>
          <Button 
            variant="secondary" 
            fullWidth
            onClick={() => {
              // Simular compartilhamento
              if (navigator.share) {
                navigator.share({
                  title: 'Meu Certificado - Get Fácil',
                  text: `Concluí o curso ${curso.nome} na plataforma Get Fácil!`,
                  url: window.location.href
                });
              } else {
                alert('Link copiado para compartilhamento!');
              }
            }}
          >
            <Share2 size={18} />
            Compartilhar
          </Button>
          
          <Button 
            variant="primary"
            fullWidth
            onClick={() => {
              // Em produção, geraria PDF
              alert('Em breve: Download em PDF');
            }}
          >
            <Download size={18} />
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
