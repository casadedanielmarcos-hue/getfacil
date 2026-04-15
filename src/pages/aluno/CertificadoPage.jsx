import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
<<<<<<< HEAD
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { Award, Download, Share2 } from 'lucide-react';
=======
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { ArrowLeft, Download, Share2, Award } from 'lucide-react';
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

export function CertificadoPage() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso } = useData();

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);

  if (!curso || !progressoAluno || progressoAluno.resultado !== 'aprovado') {
    return (
<<<<<<< HEAD
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <StarfieldBackground />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Certificado não disponível</p>
        <Button variant="secondary" onClick={() => navigate('/')}>Ir para cursos</Button>
=======
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Certificado não disponível
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      </div>
    );
  }

<<<<<<< HEAD
  const dataEmissao = progressoAluno.dataFim
    ? new Date(progressoAluno.dataFim + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const codigoCertificado = `GFT-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingBottom: '60px' }}>
      <StarfieldBackground />
      <Header showBack backTo="/" backLabel="Meus cursos" />

      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        {/* Certificate card */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 0 40px rgba(0,212,255,0.15), 0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Gradient border */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            padding: '1px',
            background: 'linear-gradient(135deg, #00d4ff, #0066ff, #7c3aed)',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              borderRadius: '19px',
              background: '#0a0a14'
            }} />
          </div>

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            padding: '36px 28px',
            background: 'linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(5,5,20,0.98) 100%)',
            backdropFilter: 'blur(20px)'
          }}>
            {/* Decorative glows */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                margin: '0 auto 12px',
                boxShadow: '0 0 24px rgba(0,212,255,0.5)'
              }}>
                <Award size={28} />
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: '800',
                color: '#00d4ff',
                textShadow: '0 0 15px rgba(0,212,255,0.5)',
                marginBottom: '2px'
              }}>
                GetFutureToday
              </h2>
              <p style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontFamily: 'var(--font-body)'
              }}>
                Certificado de Conclusão
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)',
              marginBottom: '24px'
            }} />

            {/* Body */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)',
                marginBottom: '8px'
              }}>
                Certificamos que
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#ffffff',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(0,212,255,0.2)',
                marginBottom: '16px'
              }}>
                {user.nome}
              </h3>

              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)',
                marginBottom: '8px'
              }}>
                concluiu com êxito o curso
              </p>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#00d4ff',
                marginBottom: '20px',
                lineHeight: '1.3',
                textShadow: '0 0 12px rgba(0,212,255,0.4)'
              }}>
                {curso.title}
              </h4>

              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'var(--font-body)',
                marginBottom: '16px'
              }}>
                Emitido em {dataEmissao}
              </p>

              <div style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '9999px',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
                fontSize: '0.7rem',
                color: '#00d4ff',
                fontFamily: 'monospace',
                letterSpacing: '1.5px',
                marginBottom: '16px'
              }}>
                {codigoCertificado}
              </div>

              {/* Score badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(255,200,0,0.1) 0%, rgba(255,150,0,0.1) 100%)',
                border: '1px solid rgba(255,200,0,0.25)',
                borderRadius: '10px',
                color: '#ffd700',
                fontWeight: '600',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-body)'
              }}>
                <Award size={16} />
                Nota Final: {progressoAluno.avaliacaoFinal?.nota || 10}
              </div>
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Meu Certificado — GetFutureToday',
                  text: `Concluí o curso "${curso.title}" na plataforma GetFutureToday!`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Link copiado!');
              }
            }}
          >
            <Share2 size={16} />
            Compartilhar
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => alert('Em breve: Download em PDF')}
          >
            <Download size={16} />
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
