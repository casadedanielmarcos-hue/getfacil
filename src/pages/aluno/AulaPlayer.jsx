import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';

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
      return { aula: moduloAtual.lessons[aulaIndex + 1] };
    }
    const moduloIndex = curso.modules.findIndex(m => m.id === moduloAtual.id);
    if (moduloIndex < curso.modules.length - 1) {
      const proximoModulo = curso.modules[moduloIndex + 1];
      if (proximoModulo.lessons.length > 0) {
        return { aula: proximoModulo.lessons[0] };
      }
    }
    return null;
  };

  const proxima = getProximaAula();
  const aulaAssistida = progressoAluno?.aulasAssistidas.includes(aulaId);

  // undefined = carregando, null = não encontrado, string = URL do Firebase Storage
  const [arquivoUrl, setArquivoUrl] = useState(undefined);

  useEffect(() => {
    if (!aulaAtual || !moduloAtual) return;
    setArquivoUrl(undefined);
    getDoc(doc(db, 'cursos', cursoId, 'modulos', moduloAtual.id, 'aulas', aulaId))
      .then(snap => {
        const url = snap.exists() ? snap.data().arquivoUrl : null;
        setArquivoUrl(url || null);
      })
      .catch(() => setArquivoUrl(null));
  }, [cursoId, moduloAtual?.id, aulaId]);

  // Auto-marca como assistida após 5s de visualização
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
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Aula não encontrada</p>
      </div>
    );
  }

  const isRise = aulaAtual.type === 'rise360';
  const githubFallback = `/getfacil/Cursos/${curso.slug}/${encodeURIComponent(aulaAtual.slug)}/index.html`;

  // Prioridade: Firebase Storage → GitHub Pages (só Rise) → URL da aula (YouTube etc.)
  let iframeSrc = null;
  let conteudoIndisponivel = false;
  if (arquivoUrl === undefined) {
    // ainda carregando — aguarda
  } else if (arquivoUrl) {
    iframeSrc = arquivoUrl;
  } else if (isRise) {
    iframeSrc = githubFallback;
  } else if (aulaAtual.url) {
    iframeSrc = aulaAtual.url;
  } else {
    conteudoIndisponivel = true;
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#000000',
      overflow: 'hidden',
    }}>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav style={{
        height: '60px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        zIndex: 100,
        gap: '12px',
      }}>

        {/* Logo */}
        <div
          style={{ cursor: 'pointer', flexShrink: 0, lineHeight: 0 }}
          onClick={() => navigate('/')}
        >
          <img
            src="/getfacil/logo-getfuturetoday.png"
            alt="GetFutureToday"
            style={{ height: '144px', width: 'auto', display: 'block' }}
          />
        </div>

        {/* Center — título da aula */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          overflow: 'hidden',
          padding: '0 12px',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.8)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {aulaAtual.title}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem',
            color: 'rgba(255,255,255,0.3)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {moduloAtual.title}
          </p>
        </div>

        {/* Right — ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

          {aulaAssistida && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.72rem', fontWeight: '600',
              color: '#00ff88',
              fontFamily: 'var(--font-body)',
            }}>
              <CheckCircle size={12} />
              Concluída
            </div>
          )}

          {proxima && (
            <button
              onClick={() => navigate(`/curso/${cursoId}/aula/${proxima.aula.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px',
                borderRadius: '7px',
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00d4ff',
                fontFamily: 'var(--font-body)',
                fontWeight: '500',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
            >
              Próxima
              <ChevronRight size={13} />
            </button>
          )}

          <button
            onClick={() => navigate(`/curso/${cursoId}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 14px',
              borderRadius: '7px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-body)',
              fontWeight: '500',
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <ArrowLeft size={13} />
            Voltar ao curso
          </button>
        </div>
      </nav>

      {/* ── Conteúdo ─────────────────────────────────────────── */}
      {arquivoUrl === undefined ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
            Carregando aula...
          </p>
        </div>
      ) : conteudoIndisponivel ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
            Conteúdo não disponível ainda
          </p>
        </div>
      ) : (isRise || arquivoUrl) ? (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          style={{
            flex: 1,
            width: '100%',
            height: 'calc(100vh - 60px)',
            border: 'none',
            display: 'block',
            background: '#ffffff',
          }}
          allow="fullscreen"
          title={aulaAtual.title}
        />
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}>
          <iframe
            src={iframeSrc}
            style={{
              width: '100%',
              maxWidth: '1280px',
              aspectRatio: '16/9',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={aulaAtual.title}
          />
        </div>
      )}
    </div>
  );
}
