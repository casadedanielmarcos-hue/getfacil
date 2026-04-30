import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { seedCursos } from '../utils/seedCursos';
import { Users, BookOpen, UserCheck, ClipboardList, Check, X, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, cursos: 0, ativos: 0 });
  const [ultimosAlunos, setUltimosAlunos] = useState([]);
  const [cursosTop, setCursosTop] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [alunosSnap, cursosSnap, solSnap] = await Promise.all([
          getDocs(collection(db, 'alunos')),
          getDocs(collection(db, 'cursos')),
          getDocs(query(collection(db, 'solicitudes-matricula'), where('status', '==', 'pendente'))),
        ]);

        if (cursosSnap.empty) {
          await seedCursos();
        }

        const alunos = alunosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const cursos = cursosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const ativos = alunos.filter(a => a.status === 'ativo').length;
        const sorted = [...alunos].sort((a, b) => {
          const ta = a.dataCriacao?.toMillis?.() ?? 0;
          const tb = b.dataCriacao?.toMillis?.() ?? 0;
          return tb - ta;
        });

        const cursosComAlunos = cursos.map(c => ({
          ...c,
          totalAlunos: alunos.filter(a =>
            (a.cursosMatriculados || []).some(m => (m.id || m) === c.id)
          ).length,
        })).sort((a, b) => b.totalAlunos - a.totalAlunos).slice(0, 5);

        // Enrich solicitations with names from loaded data
        const sols = solSnap.docs
          .map(d => {
            const s = { id: d.id, ...d.data() };
            const alunoId = s.alunoId || s.uid || s.userId;
            const cursoId = s.cursoId || s.curso;
            const alunoInfo = alunos.find(a => a.id === alunoId);
            const cursoInfo = cursos.find(c => c.id === cursoId);
            return {
              ...s,
              alunoId,
              cursoId,
              alunoNome: s.alunoNome || s.nome || alunoInfo?.nome || '—',
              alunoEmail: s.alunoEmail || s.email || alunoInfo?.email || '—',
              cursoTitulo: s.cursoTitulo || s.titulo || cursoInfo?.titulo || cursoId || '—',
              cursoCor: cursoInfo?.cor || '#00d4ff',
            };
          })
          .sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() ?? a.dataSolicitacao?.toMillis?.() ?? 0;
            const tb = b.createdAt?.toMillis?.() ?? b.dataSolicitacao?.toMillis?.() ?? 0;
            return tb - ta;
          });

        setStats({ total: alunos.length, cursos: cursos.length, ativos });
        setUltimosAlunos(sorted.slice(0, 5));
        setCursosTop(cursosComAlunos);
        setSolicitacoes(sols);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const aprovar = async (sol) => {
    setActionLoading(sol.id);
    try {
      if (sol.alunoId && sol.cursoId) {
        const alunoRef = doc(db, 'alunos', sol.alunoId);
        const alunoDoc = await getDoc(alunoRef);
        if (alunoDoc.exists()) {
          const matriculados = alunoDoc.data().cursosMatriculados || [];
          const jaMatriculado = matriculados.some(m => (m.id || m) === sol.cursoId);
          if (!jaMatriculado) {
            const semEsseCurso = matriculados.filter(m => (m.id || m) !== sol.cursoId);
            await updateDoc(alunoRef, {
              cursosMatriculados: [...semEsseCurso, { id: sol.cursoId, progresso: 0, aulasCompletas: [] }],
              [`progresso.${sol.cursoId}`]: {
                status: 'andamento',
                aulasAssistidas: [], modulosCompletos: [],
                avaliacoesFeitas: [], avaliacaoFinal: null,
                resultado: null,
                dataInicio: new Date().toISOString().split('T')[0],
                dataFim: null,
              },
            });
          }
        }
      }
      await updateDoc(doc(db, 'solicitudes-matricula', sol.id), { status: 'aprovada' });
      setSolicitacoes(prev => prev.filter(s => s.id !== sol.id));
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const recusar = async (sol) => {
    setActionLoading(sol.id);
    try {
      await updateDoc(doc(db, 'solicitudes-matricula', sol.id), { status: 'recusada' });
      setSolicitacoes(prev => prev.filter(s => s.id !== sol.id));
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(0,212,255,0.12)' }}>
            <Users size={22} color="#00d4ff" />
          </div>
          <div>
            <p className="stat-label">Total de Alunos</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(0,136,255,0.12)' }}>
            <BookOpen size={22} color="#0088ff" />
          </div>
          <div>
            <p className="stat-label">Total de Cursos</p>
            <p className="stat-value">{stats.cursos}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(0,255,128,0.12)' }}>
            <UserCheck size={22} color="#00ff80" />
          </div>
          <div>
            <p className="stat-label">Alunos Ativos</p>
            <p className="stat-value">{stats.ativos}</p>
          </div>
        </div>
        <div
          className="stat-card glass"
          style={{ cursor: solicitacoes.length > 0 ? 'pointer' : 'default' }}
          onClick={() => solicitacoes.length > 0 && document.getElementById('sol-card')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="stat-icon" style={{ background: 'rgba(255,170,0,0.12)' }}>
            <ClipboardList size={22} color="#ffaa00" />
          </div>
          <div>
            <p className="stat-label">Solicitações Pendentes</p>
            <p className="stat-value" style={{ color: solicitacoes.length > 0 ? '#ffaa00' : 'var(--white)' }}>
              {solicitacoes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Solicitações de Matrícula */}
      <div id="sol-card" className="glass panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="panel-title" style={{ margin: 0 }}>Solicitações de Matrícula</h2>
            {solicitacoes.length > 0 && (
              <span style={{
                background: 'rgba(255,170,0,0.15)',
                border: '1px solid rgba(255,170,0,0.35)',
                color: '#ffaa00',
                borderRadius: '20px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {solicitacoes.length} pendente{solicitacoes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
            <Clock size={13} />
            Atualizado ao carregar a página
          </div>
        </div>

        {solicitacoes.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 0', color: 'var(--gray-500)' }}>
            <Check size={18} style={{ color: 'var(--success)', opacity: 0.7 }} />
            <p style={{ fontSize: '0.875rem' }}>Nenhuma solicitação pendente no momento.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Curso</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map(sol => {
                  const data = sol.createdAt || sol.dataSolicitacao || sol.timestamp;
                  const dataStr = data?.toDate?.()?.toLocaleDateString('pt-BR') ?? '—';
                  const isProcessing = actionLoading === sol.id;
                  return (
                    <tr key={sol.id}>
                      <td>
                        <p style={{ fontWeight: 500 }}>{sol.alunoNome}</p>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>{sol.alunoEmail}</p>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sol.cursoCor, flexShrink: 0 }} />
                          <span>{sol.cursoTitulo}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--gray-300)', whiteSpace: 'nowrap' }}>{dataStr}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => aprovar(sol)}
                            disabled={isProcessing}
                            title="Aprovar matrícula"
                          >
                            {isProcessing ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Check size={13} />}
                            Aprovar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => recusar(sol)}
                            disabled={isProcessing}
                            title="Recusar solicitação"
                          >
                            <X size={13} />
                            Recusar
                          </button>
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

      <div className="dashboard-grid">
        <div className="glass panel">
          <h2 className="panel-title">Últimos Alunos Cadastrados</h2>
          {ultimosAlunos.length === 0 ? (
            <p className="empty-text">Nenhum aluno cadastrado ainda.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimosAlunos.map(a => (
                  <tr key={a.id} onClick={() => navigate(`/alunos/${a.id}`)} style={{ cursor: 'pointer' }}>
                    <td>{a.nome}</td>
                    <td style={{ color: 'var(--gray-300)' }}>{a.email}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="glass panel">
          <h2 className="panel-title">Cursos com Mais Alunos</h2>
          {cursosTop.length === 0 ? (
            <p className="empty-text">Nenhum curso cadastrado ainda.</p>
          ) : (
            <div className="curso-list">
              {cursosTop.map(c => (
                <div key={c.id} className="curso-item" onClick={() => navigate(`/cursos/${c.id}`)} style={{ cursor: 'pointer', padding: '0.4rem', borderRadius: 8, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="curso-cor" style={{ background: c.cor || '#00d4ff' }} />
                  <div className="curso-info">
                    <p className="curso-nome">{c.titulo}</p>
                    <p className="curso-alunos">{c.totalAlunos} alunos matriculados</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
