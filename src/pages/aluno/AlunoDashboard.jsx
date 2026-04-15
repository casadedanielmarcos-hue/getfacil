import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { AIAgent } from '../../components/AIAgent';
import { Card, Badge, ProgressBar, Tabs, EmptyState } from '../../components/ui';
import { BookOpen, Award, Clock, CheckCircle, XCircle } from 'lucide-react';

export function AlunoDashboard() {
  const { user } = useAuth();
  const { getCursosEmAndamento, getCursosFinalizados } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('andamento');

  const cursosAndamento = getCursosEmAndamento(user.id);
  const cursosFinalizados = getCursosFinalizados(user.id);

  const pageStyle = {
    minHeight: '100dvh',
    background: 'var(--background)',
    paddingBottom: '100px'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const greetingStyle = {
    marginBottom: 'var(--space-lg)'
  };

  const greetingTextStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--space-xs)'
  };

  const greetingNameStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  };

  const sectionStyle = {
    marginTop: 'var(--space-lg)'
  };

  const coursesGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-md)'
  };

  const courseCardStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    cursor: 'pointer'
  };

  const courseImageStyle = {
    width: '100px',
    height: '70px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    flexShrink: 0
  };

  const courseInfoStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
    minWidth: 0
  };

  const courseNameStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const courseMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  };

  const tabs = [
    { id: 'andamento', label: `Em Andamento (${cursosAndamento.length})` },
    { id: 'finalizados', label: `Finalizados (${cursosFinalizados.length})` }
  ];

  const renderCursoAndamento = (curso) => (
    <Card 
      key={curso.id} 
      hover 
      onClick={() => navigate(`/aluno/curso/${curso.id}`)}
      style={courseCardStyle}
    >
      <img 
        src={curso.capa} 
        alt={curso.nome} 
        style={courseImageStyle}
      />
      <div style={courseInfoStyle}>
        <h3 style={courseNameStyle}>{curso.nome}</h3>
        <div style={courseMetaStyle}>
          <Clock size={14} />
          <span>Em andamento</span>
        </div>
        <ProgressBar value={curso.progresso} size="small" />
      </div>
    </Card>
  );

  const renderCursoFinalizado = (curso) => (
    <Card 
      key={curso.id} 
      hover 
      onClick={() => navigate(`/aluno/curso/${curso.id}`)}
      style={courseCardStyle}
    >
      <img 
        src={curso.capa} 
        alt={curso.nome} 
        style={courseImageStyle}
      />
      <div style={courseInfoStyle}>
        <h3 style={courseNameStyle}>{curso.nome}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Badge variant={curso.resultado === 'aprovado' ? 'success' : 'error'}>
            {curso.resultado === 'aprovado' ? (
              <><CheckCircle size={12} style={{ marginRight: '4px' }} /> Aprovado</>
            ) : (
              <><XCircle size={12} style={{ marginRight: '4px' }} /> Reprovado</>
            )}
          </Badge>
          {curso.resultado === 'aprovado' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/aluno/certificado/${curso.id}`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--blue-100)',
                color: 'var(--blue-700)',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Award size={12} />
              Certificado
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={pageStyle}>
      <Header />
      
      <div style={contentStyle}>
        <div style={greetingStyle}>
          <p style={greetingTextStyle}>Olá,</p>
          <h1 style={greetingNameStyle}>{user.nome.split(' ')[0]}! 👋</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={sectionStyle}>
          {activeTab === 'andamento' ? (
            cursosAndamento.length > 0 ? (
              <div style={coursesGridStyle}>
                {cursosAndamento.map(renderCursoAndamento)}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Nenhum curso em andamento"
                description="Você ainda não está matriculado em nenhum curso"
              />
            )
          ) : (
            cursosFinalizados.length > 0 ? (
              <div style={coursesGridStyle}>
                {cursosFinalizados.map(renderCursoFinalizado)}
              </div>
            ) : (
              <EmptyState
                icon={Award}
                title="Nenhum curso finalizado"
                description="Complete seus cursos para vê-los aqui"
              />
            )
          )}
        </div>
      </div>

      <AIAgent />
    </div>
  );
}
