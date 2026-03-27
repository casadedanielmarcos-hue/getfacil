import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

export function AulaPlayer() {
  const { cursoId, aulaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso, marcarAulaAssistida, marcarModuloCompleto } = useData();

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);
  
  // Encontrar aula e módulo atual
  let aulaAtual = null;
  let moduloAtual = null;
  let aulaIndex = -1;
  
  for (const modulo of curso?.modulos || []) {
    const index = modulo.aulas.findIndex(a => a.id === aulaId);
    if (index !== -1) {
      aulaAtual = modulo.aulas[index];
      moduloAtual = modulo;
      aulaIndex = index;
      break;
    }
  }

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
    
    return null;
  };

  const proxima = getProximaAula();
  const aulaAssistida = progressoAluno?.aulasAssistidas.includes(aulaId);

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
      
      return () => clearTimeout(timer);
    }
  }, [aulaId, aulaAssistida]);

  if (!curso || !aulaAtual) {
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
            {aulaAssistida ? 'Assistida' : 'Assistindo...'}
          </div>
        </div>

        <div style={navigationStyle}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/aluno/curso/${cursoId}`)}
            style={{ flex: 1 }}
          >
            Ver módulos
          </Button>
          
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
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
