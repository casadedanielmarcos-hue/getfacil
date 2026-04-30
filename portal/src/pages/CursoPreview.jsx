import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Play, FileText, ExternalLink } from 'lucide-react';

const GITHUB_PAGES_BASE = 'https://casadedanielmarcos-hue.github.io/getfacil';

/**
 * Resolve a URL do conteúdo da aula para exibição no iframe.
 *
 * Prioridade:
 * 1. arquivoUrl (URL completa — GitHub Pages ou Firebase Storage)
 * 2. arquivoPath legado (caminho relativo que aponta para o GitHub Pages)
 * 3. Fallback por slug (conteúdo estático no GitHub Pages)
 */
function resolveAulaUrl(aula, cursoId) {
  // 1. URL completa (novo upload via GitHub ou Firebase Storage)
  if (aula.arquivoUrl && aula.arquivoUrl.startsWith('http')) {
    return aula.arquivoUrl;
  }

  // 2. Caminho legado (ex: /cursos/pensamento-computacional/introducao/index.html)
  if (aula.arquivoPath) {
    // Converte caminho relativo para URL absoluta do GitHub Pages
    const path = aula.arquivoPath.startsWith('/cursos/')
      ? aula.arquivoPath.replace('/cursos/', '/Cursos/')
      : aula.arquivoPath;
    return `${GITHUB_PAGES_BASE}${path}`;
  }

  // 3. Fallback: URL do arquivoUrl que não começa com http (caminho relativo salvo)
  if (aula.arquivoUrl) {
    return `${GITHUB_PAGES_BASE}${aula.arquivoUrl}`;
  }

  return null;
}

export default function CursoPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aulaAtiva, setAulaAtiva] = useState(null);
  const [moduloAberto, setModuloAberto] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'cursos', id)).then(snap => {
      if (!snap.exists()) { setLoading(false); return; }
      const data = { id: snap.id, ...snap.data() };
      setCurso(data);
      const primeiroModulo = data.modulos?.[0];
      const primeiraAula = primeiroModulo?.aulas?.[0];
      if (primeiroModulo) setModuloAberto(primeiroModulo.id || 0);
      if (primeiraAula) setAulaAtiva(primeiraAula);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f' }}>
      <div className="spinner" />
    </div>
  );

  if (!curso) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f', color: 'var(--gray-300)' }}>
      Curso não encontrado.
    </div>
  );

  const totalAulas = (curso.modulos || []).reduce((acc, m) => acc + (m.aulas?.length || 0), 0);
  const corCurso = curso.cor || '#00d4ff';
  const aulaUrl = aulaAtiva ? resolveAulaUrl(aulaAtiva, id) : null;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f', overflow: 'hidden' }}>

      {/* Banner de pré-visualização */}
      <div style={{
        background: 'rgba(0,212,255,0.07)',
        borderBottom: '1px solid var(--neon-border)',
        padding: '0.55rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: 'var(--neon)',
            color: '#000',
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '0.18rem 0.5rem',
            borderRadius: 4,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Pré-visualização
          </span>
          <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
            Modo Aluno — esta tela é uma simulação
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {aulaUrl && (
            <a
              href={aulaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              title="Abrir conteúdo em nova aba"
            >
              <ExternalLink size={13} /> Abrir em nova aba
            </a>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/cursos/${id}`)}
          >
            <ArrowLeft size={14} /> Voltar para Gestão
          </button>
        </div>
      </div>

      {/* Corpo principal */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar do curso */}
        <div style={{
          width: 300,
          minWidth: 260,
          background: 'rgba(10,10,18,0.98)',
          borderRight: '1px solid var(--neon-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Cabeçalho do curso */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid var(--gray-700)',
            background: `linear-gradient(135deg, ${corCurso}14 0%, transparent 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div style={{ width: 4, height: 32, background: corCurso, borderRadius: 2, flexShrink: 0 }} />
              <p style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', lineHeight: 1.3 }}>
                {curso.titulo}
              </p>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--gray-500)', paddingLeft: '0.65rem' }}>
              {(curso.modulos || []).length} módulos — {totalAulas} aulas
            </p>
          </div>

          {/* Lista de módulos e aulas */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBlock: '0.5rem' }}>
            {(curso.modulos || []).length === 0 && (
              <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', padding: '1rem 1.25rem' }}>
                Nenhum módulo cadastrado.
              </p>
            )}
            {(curso.modulos || []).map((modulo, mi) => {
              const key = modulo.id || mi;
              const aberto = moduloAberto === key;
              return (
                <div key={key}>
                  <button
                    onClick={() => setModuloAberto(aberto ? null : key)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gray-100)',
                      fontSize: '0.83rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {aberto
                      ? <ChevronDown size={14} style={{ flexShrink: 0, color: 'var(--gray-500)' }} />
                      : <ChevronRight size={14} style={{ flexShrink: 0, color: 'var(--gray-500)' }} />}
                    <BookOpen size={13} style={{ color: corCurso, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.3 }}>{modulo.titulo}</span>
                  </button>

                  {aberto && (modulo.aulas || []).map((aula, ai) => {
                    const aulaKey = aula.id || ai;
                    const ativa = aulaAtiva?.id === aula.id || (!aulaAtiva?.id && ai === 0 && mi === 0);
                    const temConteudo = !!(aula.arquivoUrl || aula.arquivoPath);
                    return (
                      <button
                        key={aulaKey}
                        onClick={() => setAulaAtiva(aula)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 1.25rem 0.45rem 2.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: ativa ? `${corCurso}14` : 'transparent',
                          border: 'none',
                          borderLeft: `2px solid ${ativa ? corCurso : 'transparent'}`,
                          color: ativa ? corCurso : temConteudo ? 'var(--gray-300)' : 'var(--gray-600)',
                          fontSize: '0.79rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!ativa) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!ativa) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Play size={10} style={{ flexShrink: 0, opacity: temConteudo ? 1 : 0.3 }} />
                        {aula.titulo}
                        {!temConteudo && <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>(sem conteúdo)</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Área de conteúdo da aula */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {aulaAtiva ? (
            <>
              <div style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--gray-700)',
                flexShrink: 0,
                background: 'rgba(15,15,26,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--white)', fontWeight: 600 }}>
                  {aulaAtiva.titulo}
                </h2>
                {aulaUrl && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-600)', fontFamily: 'monospace', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {aulaUrl}
                  </span>
                )}
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                {aulaUrl ? (
                  <iframe
                    key={aulaUrl}
                    src={aulaUrl}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#fff' }}
                    title={aulaAtiva.titulo}
                    allow="fullscreen"
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--gray-500)',
                    gap: '1rem',
                  }}>
                    <FileText size={48} style={{ opacity: 0.25 }} />
                    <p style={{ fontSize: '0.875rem' }}>Nenhum conteúdo vinculado a esta aula.</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                      Edite o curso e faça upload do conteúdo Rise 360 (.zip).
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--gray-500)',
              gap: '1rem',
            }}>
              <BookOpen size={48} style={{ opacity: 0.2 }} />
              <p style={{ fontSize: '0.875rem' }}>Selecione uma aula no menu lateral para começar.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
