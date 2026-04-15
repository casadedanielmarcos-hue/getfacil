import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
<<<<<<< HEAD
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { CheckCircle, ChevronRight } from 'lucide-react';
=======
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

export function AulaPlayer() {
  const { cursoId, aulaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso, marcarAulaAssistida, marcarModuloCompleto } = useData();

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);
<<<<<<< HEAD

  let aulaAtual = null;
  let moduloAtual = null;
  let aulaIndex = -1;

  for (const modulo of curso?.modules || []) {
    const index = modulo.lessons.findIndex(l => l.id === aulaId);
    if (index !== -1) {
      aulaAtual = modulo.lessons[index];
=======
  
  // Encontrar aula e módulo atual
  let aulaAtual = null;
  let moduloAtual = null;
  let aulaIndex = -1;
  
  for (const modulo of curso?.modulos || []) {
    const index = modulo.aulas.findIndex(a => a.id === aulaId);
    if (index !== -1) {
      aulaAtual = modulo.aulas[index];
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      moduloAtual = modulo;
      aulaIndex = index;
      break;
    }
  }

<<<<<<< HEAD
  const getProximaAula = () => {
    if (!moduloAtual || !curso) return null;
    if (aulaIndex < moduloAtual.lessons.length - 1) {
      return { aula: moduloAtual.lessons[aulaIndex + 1], modulo: moduloAtual };
    }
    const moduloIndex = curso.modules.findIndex(m => m.id === moduloAtual.id);
    if (moduloIndex < curso.modules.length - 1) {
      const proximoModulo = curso.modules[moduloIndex + 1];
      if (proximoModulo.lessons.length > 0) {
        return { aula: proximoModulo.lessons[0], modulo: proximoModulo };
      }
    }
=======
  // Encontrar próxima aula
  const getProximaAula = () => {
    if (!moduloAtual || !curso) return null;
    
    // Próxima aula no mesmo módulo
    if (aulaIndex < moduloAtual.aulas.length - 1) {
      return {
        aula: moduloAtual.aulas[aulaIndex + 1],
        modulo: moduloAtual
      };
    }
    
    // Primeira aula do próximo módulo
    const moduloIndex = curso.modulos.findIndex(m => m.id === moduloAtual.id);
    if (moduloIndex < curso.modulos.length - 1) {
      const proximoModulo = curso.modulos[moduloIndex + 1];
      if (proximoModulo.aulas.length > 0) {
        return {
          aula: proximoModulo.aulas[0],
          modulo: proximoModulo
        };
      }
    }
    
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    return null;
  };

  const proxima = getProximaAula();
  const aulaAssistida = progressoAluno?.aulasAssistidas.includes(aulaId);

<<<<<<< HEAD
  useEffect(() => {
    if (!aulaAssistida && aulaAtual && progressoAluno) {
      const timer = setTimeout(() => {
        marcarAulaAssistida(user.id, cursoId, aulaId);
        const aulasModulo = moduloAtual.lessons.map(l => l.id);
        const assistidasModulo = progressoAluno.aulasAssistidas.filter(a => aulasModulo.includes(a));
        if (assistidasModulo.length + 1 >= aulasModulo.length) {
          marcarModuloCompleto(user.id, cursoId, moduloAtual.id);
        }
      }, 5000);
=======
  // Marcar como assistida automaticamente após 5 segundos
  useEffect(() => {
    if (!aulaAssistida && aulaAtual) {
      const timer = setTimeout(() => {
        marcarAulaAssistida(user.id, cursoId, aulaId);
        
        // Verificar se todas as aulas do módulo foram assistidas
        const aulasModulo = moduloAtual.aulas.map(a => a.id);
        const aulasAssistidasModulo = progressoAluno.aulasAssistidas.filter(a => aulasModulo.includes(a));
        
        if (aulasAssistidasModulo.length + 1 >= aulasModulo.length) {
          marcarModuloCompleto(user.id, cursoId, moduloAtual.id);
        }
      }, 5000);
      
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      return () => clearTimeout(timer);
    }
  }, [aulaId, aulaAssistida]);

  if (!curso || !aulaAtual) {
<<<<<<< HEAD
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StarfieldBackground />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Aula não encontrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      <StarfieldBackground />
      <Header showBack backTo={`/curso/${cursoId}`} backLabel="Voltar ao curso" />

      {/* Video */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        background: '#000',
        position: 'relative',
        maxHeight: '60vh'
      }}>
        <iframe
          src={aulaAtual.url}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={aulaAtual.title}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '6px',
              lineHeight: '1.3'
            }}>
              {aulaAtual.title}
            </h1>
            <p style={{
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)'
            }}>
              {moduloAtual.title} • {aulaAtual.duration}
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '9999px',
            background: aulaAssistida
              ? 'rgba(0,255,136,0.1)'
              : 'rgba(0,212,255,0.1)',
            border: `1px solid ${aulaAssistida ? 'rgba(0,255,136,0.35)' : 'rgba(0,212,255,0.25)'}`,
            color: aulaAssistida ? '#00ff88' : '#00d4ff',
            fontSize: '0.78rem',
            fontWeight: '600',
            fontFamily: 'var(--font-body)',
            flexShrink: 0
          }}>
            <CheckCircle size={13} />
=======
    return <div>Aula não encontrada</div>;
  }

  const pageStyle = {
    minHeight: '100vh',
    background: 'var(--background)'
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

  const videoContainerStyle = {
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    position: 'relative'
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const titleSectionStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-lg)'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-xs)'
  };

  const metaStyle = {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  };

  const statusBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    background: aulaAssistida ? '#dcfce7' : 'var(--blue-50)',
    color: aulaAssistida ? '#166534' : 'var(--blue-600)',
    fontSize: '0.8rem',
    fontWeight: '600',
    flexShrink: 0
  };

  const navigationStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-xl)'
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate(`/aluno/curso/${cursoId}`)}>
        <ArrowLeft size={18} />
        Voltar ao curso
      </button>

      <div style={videoContainerStyle}>
        <iframe
          src={aulaAtual.url}
          style={iframeStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={aulaAtual.nome}
        />
      </div>

      <div style={contentStyle}>
        <div style={titleSectionStyle}>
          <div>
            <h1 style={titleStyle}>{aulaAtual.nome}</h1>
            <p style={metaStyle}>
              {moduloAtual.nome} • {aulaAtual.duracao}
            </p>
          </div>
          <div style={statusBadgeStyle}>
            <CheckCircle size={14} />
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            {aulaAssistida ? 'Assistida' : 'Assistindo...'}
          </div>
        </div>

<<<<<<< HEAD
        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            onClick={() => navigate(`/curso/${cursoId}`)}
=======
        <div style={navigationStyle}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/aluno/curso/${cursoId}`)}
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            style={{ flex: 1 }}
          >
            Ver módulos
          </Button>
<<<<<<< HEAD
          {proxima ? (
            <Button
              variant="primary"
              onClick={() => navigate(`/curso/${cursoId}/aula/${proxima.aula.id}`)}
              style={{ flex: 1 }}
            >
              Próxima aula
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate(`/curso/${cursoId}`)}
              style={{ flex: 1 }}
            >
              Concluir
              <CheckCircle size={16} />
=======
          
          {proxima ? (
            <Button 
              variant="primary"
              onClick={() => navigate(`/aluno/curso/${cursoId}/aula/${proxima.aula.id}`)}
              style={{ flex: 1 }}
            >
              Próxima aula
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button 
              variant="primary"
              onClick={() => navigate(`/aluno/curso/${cursoId}`)}
              style={{ flex: 1 }}
            >
              Concluir
              <CheckCircle size={18} />
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
