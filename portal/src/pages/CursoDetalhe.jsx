import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Edit, UserPlus, X, Eye, EyeOff } from 'lucide-react';

export default function CursoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [alunoParaAdd, setAlunoParaAdd] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [cursoDoc, alunosSnap] = await Promise.all([
      getDoc(doc(db, 'cursos', id)),
      getDocs(collection(db, 'alunos')),
    ]);
    if (cursoDoc.exists()) setCurso({ id: cursoDoc.id, ...cursoDoc.data() });
    setAlunos(alunosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const matriculados = alunos.filter(a =>
    (a.cursosMatriculados || []).some(c => (c.id || c) === id)
  );
  const naoMatriculados = alunos.filter(a =>
    !(a.cursosMatriculados || []).some(c => (c.id || c) === id)
  );

  const removerAluno = async (alunoId) => {
    if (!confirm('Remover este aluno do curso?')) return;
    const aluno = alunos.find(a => a.id === alunoId);
    const novos = (aluno.cursosMatriculados || []).filter(c => (c.id || c) !== id);
    await updateDoc(doc(db, 'alunos', alunoId), { cursosMatriculados: novos });
    load();
  };

  const adicionarAluno = async () => {
    if (!alunoParaAdd) return;
    const aluno = alunos.find(a => a.id === alunoParaAdd);
    const cursosAtual = aluno.cursosMatriculados || [];
    const semEsseCurso = cursosAtual.filter(c => (c.id || c) !== id);
    await updateDoc(doc(db, 'alunos', alunoParaAdd), {
      cursosMatriculados: [...semEsseCurso, { id, progresso: 0, aulasCompletas: [] }],
      [`progresso.${id}`]: {
        status: 'andamento',
        aulasAssistidas: [], modulosCompletos: [],
        avaliacoesFeitas: [], avaliacaoFinal: null,
        resultado: null,
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: null,
      },
    });
    setShowAdd(false);
    setAlunoParaAdd('');
    load();
  };

  const togglePublicado = async () => {
    await updateDoc(doc(db, 'cursos', id), { publicado: !curso.publicado });
    setCurso({ ...curso, publicado: !curso.publicado });
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!curso) return <div className="page"><p>Curso não encontrado.</p></div>;

  const totalAulas = (curso.modulos || []).reduce((acc, m) => acc + (m.aulas?.length || 0), 0);

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/cursos')}>
        <ArrowLeft size={16} /> Voltar para Cursos
      </button>

      {/* Header */}
      <div className="glass panel curso-detail-header" style={{ marginBottom: '1.25rem', padding: 0, overflow: 'hidden' }}>
        <div className="curso-cor-strip-v" style={{ background: curso.cor || '#00d4ff', minHeight: 100 }} />
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>{curso.titulo}</h1>
          <p style={{ color: 'var(--gray-300)', marginBottom: '0.75rem' }}>{curso.subtitulo}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge badge-${curso.publicado ? 'ativo' : 'bloqueado'}`}>
              {curso.publicado ? 'Publicado' : 'Despublicado'}
            </span>
            <span style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>
              {(curso.modulos || []).length} módulos · {totalAulas} aulas
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/cursos/${id}/preview`)}
            title="Visualizar curso como aluno"
          >
            <Eye size={13} /> Testar como Aluno
          </button>
          <button className="btn btn-ghost btn-sm" onClick={togglePublicado}>
            {curso.publicado ? <><EyeOff size={13} /> Despublicar</> : <><Eye size={13} /> Publicar</>}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/cursos/${id}/editar`)}>
            <Edit size={13} /> Editar
          </button>
        </div>
      </div>

      {/* Módulos */}
      {(curso.modulos || []).length > 0 && (
        <div className="glass panel" style={{ marginBottom: '1.25rem' }}>
          <h2 className="panel-title">Conteúdo do Curso</h2>
          {curso.modulos.map((m, mi) => (
            <div key={m.id || mi} style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.3rem', color: 'var(--gray-100)' }}>
                {m.titulo}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingLeft: '0.75rem' }}>
                {(m.aulas || []).map((a, ai) => (
                  <span key={a.id || ai} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--gray-700)', borderRadius: 6, padding: '0.25rem 0.6rem', fontSize: '0.78rem', color: 'var(--gray-300)' }}>
                    {a.titulo}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alunos matriculados */}
      <div className="glass panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Alunos Matriculados ({matriculados.length})
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <UserPlus size={14} /> Adicionar Aluno
          </button>
        </div>

        {matriculados.length === 0 ? (
          <p className="empty-text">Nenhum aluno matriculado.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Nome</th><th>Email</th><th>Progresso</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {matriculados.map(a => {
                  const mat = (a.cursosMatriculados || []).find(c => (c.id || c) === id);
                  const pct = Math.round(mat?.progresso || 0);
                  return (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.nome}</td>
                      <td style={{ color: 'var(--gray-300)' }}>{a.email}</td>
                      <td style={{ minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="progress-bar-wrap" style={{ flex: 1 }}>
                            <div className="progress-bar" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--neon)', minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-link" onClick={() => navigate(`/alunos/${a.id}`)}>Ver aluno</button>
                          <button className="btn-link btn-danger-text" onClick={() => removerAluno(a.id)}>Remover</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal adicionar aluno */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal glass">
            <div className="modal-header">
              <h2>Adicionar Aluno ao Curso</h2>
              <button className="btn-icon" onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>
            {naoMatriculados.length === 0 ? (
              <p style={{ color: 'var(--gray-300)' }}>Todos os alunos já estão matriculados.</p>
            ) : (
              <>
                <div className="form-group">
                  <label>Selecionar aluno</label>
                  <select className="input" value={alunoParaAdd} onChange={e => setAlunoParaAdd(e.target.value)}>
                    <option value="">— Escolha um aluno —</option>
                    {naoMatriculados.map(a => (
                      <option key={a.id} value={a.id}>{a.nome} — {a.email}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={adicionarAluno} disabled={!alunoParaAdd}>
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
