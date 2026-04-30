import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Lock, Unlock, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function AlunoDetalhe() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [expandedCurso, setExpandedCurso] = useState(null);
  const [showAddCurso, setShowAddCurso] = useState(false);
  const [cursoParaAdicionar, setCursoParaAdicionar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [alunoDoc, cursosSnap] = await Promise.all([
      getDoc(doc(db, 'alunos', uid)),
      getDocs(collection(db, 'cursos')),
    ]);
    if (alunoDoc.exists()) setAluno({ id: alunoDoc.id, ...alunoDoc.data() });
    setCursos(cursosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [uid]);

  const toggleStatus = async () => {
    const novo = aluno.status === 'ativo' ? 'bloqueado' : 'ativo';
    setSaving(true);
    await updateDoc(doc(db, 'alunos', uid), { status: novo });
    setAluno({ ...aluno, status: novo });
    setSaving(false);
  };

  const removerCurso = async (cursoId) => {
    if (!confirm('Remover este aluno do curso?')) return;
    const novos = (aluno.cursosMatriculados || []).filter(c => (c.id || c) !== cursoId);
    await updateDoc(doc(db, 'alunos', uid), { cursosMatriculados: novos });
    setAluno({ ...aluno, cursosMatriculados: novos });
  };

  const adicionarCurso = async () => {
    if (!cursoParaAdicionar) return;
    const cursosAtual = aluno.cursosMatriculados || [];
    const semEsseCurso = cursosAtual.filter(c => (c.id || c) !== cursoParaAdicionar);
    const novaEntrada = { id: cursoParaAdicionar, progresso: 0, aulasCompletas: [] };
    const novos = [...semEsseCurso, novaEntrada];
    await updateDoc(doc(db, 'alunos', uid), {
      cursosMatriculados: novos,
      [`progresso.${cursoParaAdicionar}`]: {
        status: 'andamento',
        aulasAssistidas: [], modulosCompletos: [],
        avaliacoesFeitas: [], avaliacaoFinal: null,
        resultado: null,
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: null,
      },
    });
    setAluno({ ...aluno, cursosMatriculados: novos });
    setShowAddCurso(false);
    setCursoParaAdicionar('');
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!aluno) return <div className="page"><p>Aluno não encontrado.</p></div>;

  const matriculados = aluno.cursosMatriculados || [];
  const matriculadosIds = matriculados.map(c => c.id || c);
  const cursosDisponiveis = cursos.filter(c => !matriculadosIds.includes(c.id));

  const cursosDetalhados = matriculados.map(m => {
    const id = m.id || m;
    const info = cursos.find(c => c.id === id);
    const totalAulas = (info?.modulos || []).reduce((acc, mod) => acc + (mod.aulas?.length || 0), 0);
    return { ...m, id, titulo: info?.titulo || id, cor: info?.cor || '#00d4ff', totalAulas };
  });

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/alunos')}>
        <ArrowLeft size={16} /> Voltar para Alunos
      </button>

      {/* Header */}
      <div className="glass panel aluno-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>{aluno.nome}</h1>
          <p style={{ color: 'var(--gray-300)', marginBottom: '0.25rem' }}>{aluno.email}</p>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>
            Cadastrado em: {aluno.dataCriacao?.toDate?.()?.toLocaleDateString('pt-BR') || '—'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`badge badge-${aluno.status} badge-lg`}>{aluno.status}</span>
          <button
            className={`btn ${aluno.status === 'ativo' ? 'btn-danger' : 'btn-success'}`}
            onClick={toggleStatus}
            disabled={saving}
          >
            {aluno.status === 'ativo' ? <><Lock size={14} /> Bloquear</> : <><Unlock size={14} /> Desbloquear</>}
          </button>
        </div>
      </div>

      {/* Cursos */}
      <div className="glass panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Cursos Matriculados ({cursosDetalhados.length})
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddCurso(true)}>
            <Plus size={14} /> Adicionar Curso
          </button>
        </div>

        {cursosDetalhados.length === 0 ? (
          <p className="empty-text">Nenhum curso matriculado.</p>
        ) : (
          <div className="cursos-grid">
            {cursosDetalhados.map((c) => {
              const pct = Math.round(c.progresso || 0);
              const aulasFeitas = c.aulasCompletas?.length || 0;
              const isExpanded = expandedCurso === c.id;

              return (
                <div key={c.id} className="curso-card glass">
                  <div className="curso-card-top">
                    <div className="curso-cor-badge" style={{ background: c.cor }} />
                    <div style={{ flex: 1 }}>
                      <p className="curso-nome">{c.titulo}</p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>
                        {aulasFeitas} / {c.totalAulas} aulas
                      </p>
                    </div>
                    <button className="btn-icon" onClick={() => setExpandedCurso(isExpanded ? null : c.id)}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button className="btn-icon btn-danger-ghost" onClick={() => removerCurso(c.id)}>
                      <X size={15} />
                    </button>
                  </div>

                  <div className="progress-bar-wrap" style={{ margin: '0.5rem 0 0.25rem' }}>
                    <div className="progress-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--neon)' }}>{pct}% concluído</p>

                  {isExpanded && (
                    <div style={{ marginTop: '0.85rem', borderTop: '1px solid rgba(0,212,255,0.15)', paddingTop: '0.85rem' }}>
                      <p style={{ color: 'var(--gray-300)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Histórico de aulas completas:
                      </p>
                      {aulasFeitas === 0 ? (
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Nenhuma aula completada ainda.</p>
                      ) : (
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {c.aulasCompletas.map((a, j) => (
                            <li key={j} style={{ fontSize: '0.78rem', color: 'var(--gray-300)', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{a.aulaId || a.slug || `Aula ${j + 1}`}</span>
                              <span style={{ color: 'var(--gray-500)' }}>
                                {a.completadoEm?.toDate?.()?.toLocaleString('pt-BR') || '—'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal visão do aluno */}
      {/* Modal adicionar curso */}
      {showAddCurso && (
        <div className="modal-overlay">
          <div className="modal glass">
            <div className="modal-header">
              <h2>Adicionar Curso</h2>
              <button className="btn-icon" onClick={() => setShowAddCurso(false)}><X size={20} /></button>
            </div>
            {cursosDisponiveis.length === 0 ? (
              <p style={{ color: 'var(--gray-300)', marginBottom: '1rem' }}>
                O aluno já está matriculado em todos os cursos disponíveis.
              </p>
            ) : (
              <>
                <div className="form-group">
                  <label>Selecionar curso</label>
                  <select className="input" value={cursoParaAdicionar} onChange={e => setCursoParaAdicionar(e.target.value)}>
                    <option value="">— Escolha um curso —</option>
                    {cursosDisponiveis.map(c => (
                      <option key={c.id} value={c.id}>{c.titulo}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-ghost" onClick={() => setShowAddCurso(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={adicionarCurso} disabled={!cursoParaAdicionar}>
                    Matricular
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
