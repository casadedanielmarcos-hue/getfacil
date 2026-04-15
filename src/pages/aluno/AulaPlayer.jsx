import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui';
import { CheckCircle, ChevronRight } from 'lucide-react';

export function AulaPlayer() {
  const { cursoId, aulaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, getProgressoCurso, marcarAulaAssistida, marcarModuloCompleto } = useData();

  const curso = cursos.find(c => c.id === cursoId);
  const progressoAluno = getProgressoCurso(user.id, cursoId);

  let aulaAtual = null;
  let moduloAtual = null;
  let aulaIndex = -1;

  for (const modulo of curso?.modules || []) {
    const index = modulo.lessons.findIndex(l => l.id === aulaId);
    if (index !== -1) {
      aulaAtual = modulo.lessons[index];
      moduloAtual = modulo;
      aulaIndex = index;
      break;
    }
  }

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
    return null;
  };

  const proxima = getProximaAula();
  const aulaAssistida = progressoAluno?.aulasAssistidas.includes(aulaId);

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
      return () => clearTimeout(timer);
    }
  }, [aulaId, aulaAssistida]);

  if (!curso || !aulaAtual) {
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
            {aulaAssistida ? 'Assistida' : 'Assistindo...'}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            onClick={() => navigate(`/curso/${cursoId}`)}
            style={{ flex: 1 }}
          >
            Ver módulos
          </Button>
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
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
