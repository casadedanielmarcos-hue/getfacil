import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Plus, Eye, EyeOff, Users, Edit } from 'lucide-react';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    const [cursosSnap, alunosSnap] = await Promise.all([
      getDocs(collection(db, 'cursos')),
      getDocs(collection(db, 'alunos')),
    ]);
    setCursos(cursosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setAlunos(alunosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublicado = async (id, atual) => {
    await updateDoc(doc(db, 'cursos', id), { publicado: !atual });
    setCursos(prev => prev.map(c => c.id === id ? { ...c, publicado: !atual } : c));
  };

  const countAlunos = (id) =>
    alunos.filter(a => (a.cursosMatriculados || []).some(c => (c.id || c) === id)).length;

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Cursos</h1>
        <button className="btn btn-primary" onClick={() => navigate('/cursos/novo')}>
          <Plus size={15} /> Novo Curso
        </button>
      </div>

      {cursos.length === 0 ? (
        <div className="glass panel">
          <p className="empty-text">Nenhum curso cadastrado ainda.</p>
        </div>
      ) : (
        <div className="cursos-list">
          {cursos.map(c => (
            <div key={c.id} className="curso-row glass">
              <div className="curso-cor-strip" style={{ background: c.cor || '#00d4ff' }} />
              <div className="curso-row-info">
                <h3>{c.titulo}</h3>
                <p>{c.subtitulo}</p>
              </div>
              <div className="curso-row-meta">
                <span className="meta-item">
                  <Users size={13} /> {countAlunos(c.id)} alunos
                </span>
                <span className={`badge badge-${c.publicado ? 'ativo' : 'bloqueado'}`}>
                  {c.publicado ? 'Publicado' : 'Despublicado'}
                </span>
              </div>
              <div className="curso-row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => togglePublicado(c.id, c.publicado)}>
                  {c.publicado ? <><EyeOff size={13} /> Despublicar</> : <><Eye size={13} /> Publicar</>}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/cursos/${c.id}`)}>
                  Detalhes
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/cursos/${c.id}/editar`)}>
                  <Edit size={13} /> Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
