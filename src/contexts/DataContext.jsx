import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, updateDoc, arrayUnion, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { courses } from '../data/courses';

const DataContext = createContext(null);

// Normaliza um documento do Firestore (formato portal-gestor) para o formato
// que o getfacil espera internamente: { title, subtitle, modules[].lessons[] }
function normalizeCurso(id, data) {
  return {
    id,
    title: data.titulo || '',
    subtitle: data.subtitulo || '',
    description: data.subtitulo || '',
    coverColor: data.cor || '#00d4ff',
    accentColor: data.cor || '#00d4ff',
    imagemCapa: data.imagemCapa || '',
    slug: data.slug || id,
    modules: (data.modulos || []).map((m, mi) => ({
      id: m.id || `m${mi}`,
      title: m.titulo || '',
      order: mi + 1,
      lessons: (m.aulas || []).map((a, ai) => ({
        id: a.id || `l${ai}`,
        title: a.titulo || '',
        url: a.arquivoUrl || '',
        tipo: a.tipo || '',
        slug: a.slug || '',
        duration: '',
        order: ai + 1,
      })),
      quiz: null,
    })),
    finalExam: null,
  };
}

function firestoreToLocal(uid, progrMap) {
  return Object.entries(progrMap || {}).map(([cursoId, p]) => ({
    alunoId: uid,
    cursoId,
    status: p.status || 'andamento',
    aulasAssistidas: p.aulasAssistidas || [],
    modulosCompletos: p.modulosCompletos || [],
    avaliacoesFeitas: p.avaliacoesFeitas || [],
    avaliacaoFinal: p.avaliacaoFinal || null,
    resultado: p.resultado || null,
    dataInicio: p.dataInicio || new Date().toISOString().split('T')[0],
    dataFim: p.dataFim || null,
  }));
}

function localToFirestore(uid, progressoArray) {
  const map = {};
  progressoArray
    .filter(p => p.alunoId === uid)
    .forEach(({ alunoId, cursoId, ...rest }) => { map[cursoId] = rest; });
  return map;
}

export function DataProvider({ children }) {
  const { user, addCursoMatriculado, updateProgresso } = useAuth();
  const [progresso, setProgresso] = useState([]);
  const [cursos, setCursos] = useState([]);
  const pendingSave = useRef(null);

  // Carrega cursos do Firestore e mescla com dados estáticos.
  // Cursos estáticos têm prioridade: possuem slug/tipo corretos para conteúdo
  // em public/Cursos/. Cursos do Firestore com mesmo ID/slug são ignorados.
  useEffect(() => {
    const staticIds = new Set(courses.flatMap(c => [c.id, c.slug].filter(Boolean)));

    getDocs(query(collection(db, 'cursos'), where('publicado', '==', true)))
      .then(snap => {
        const novos = snap.docs
          .map(d => normalizeCurso(d.id, d.data()))
          .filter(c => !staticIds.has(c.id));
        setCursos([...courses, ...novos]);
      })
      .catch(err => {
        console.error('Erro ao carregar cursos:', err);
        setCursos(courses);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setProgresso(firestoreToLocal(user.id, user.progresso));
    } else {
      setProgresso([]);
    }
  }, [user?.id]);

  const saveToFirestore = (userId, newProgresso) => {
    if (!userId) return;
    if (pendingSave.current) clearTimeout(pendingSave.current);
    pendingSave.current = setTimeout(async () => {
      try {
        const map = localToFirestore(userId, newProgresso);
        await updateDoc(doc(db, 'alunos', userId), { progresso: map });
        Object.entries(map).forEach(([cursoId, p]) => updateProgresso(cursoId, p));
      } catch (err) {
        console.error('Erro ao salvar progresso:', err);
      }
    }, 500);
  };

  const calcularProgresso = (cursoId, alunoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    const prog = progresso.find(p => p.cursoId === cursoId && p.alunoId === alunoId);
    if (!curso || !prog) return 0;
    const total = curso.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (total === 0) return 0;
    return Math.round((prog.aulasAssistidas.length / total) * 100);
  };

  const ensureMatriculado = async (alunoId, cursoId) => {
    const exists = progresso.some(p => p.alunoId === alunoId && p.cursoId === cursoId);
    if (exists) return;

    const newEntry = {
      alunoId, cursoId,
      status: 'andamento',
      aulasAssistidas: [], modulosCompletos: [],
      avaliacoesFeitas: [], avaliacaoFinal: null,
      resultado: null,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: null,
    };

    setProgresso(prev => [...prev, newEntry]);

    try {
      await updateDoc(doc(db, 'alunos', alunoId), {
        cursosMatriculados: arrayUnion(cursoId),
        [`progresso.${cursoId}`]: {
          status: 'andamento',
          aulasAssistidas: [], modulosCompletos: [],
          avaliacoesFeitas: [], avaliacaoFinal: null,
          resultado: null,
          dataInicio: new Date().toISOString().split('T')[0],
          dataFim: null,
        },
      });
      addCursoMatriculado(cursoId);
    } catch (err) {
      console.error('Erro ao matricular:', err);
    }
  };

  const getCursosEmAndamento = (alunoId) =>
    progresso
      .filter(p => p.alunoId === alunoId && p.status === 'andamento')
      .map(p => {
        const c = cursos.find(c => c.id === p.cursoId);
        return c ? { ...c, progresso: calcularProgresso(p.cursoId, alunoId), status: p.status } : null;
      })
      .filter(Boolean);

  const getCursosFinalizados = (alunoId) =>
    progresso
      .filter(p => p.alunoId === alunoId && p.status === 'finalizado')
      .map(p => {
        const c = cursos.find(c => c.id === p.cursoId);
        return c ? { ...c, progresso: 100, status: p.status, resultado: p.resultado } : null;
      })
      .filter(Boolean);

  const getProgressoCurso = (alunoId, cursoId) =>
    progresso.find(p => p.alunoId === alunoId && p.cursoId === cursoId);

  const marcarAulaAssistida = (alunoId, cursoId, aulaId) => {
    setProgresso(prev => {
      const updated = prev.map(p => {
        if (p.alunoId === alunoId && p.cursoId === cursoId && !p.aulasAssistidas.includes(aulaId)) {
          return { ...p, aulasAssistidas: [...p.aulasAssistidas, aulaId] };
        }
        return p;
      });
      saveToFirestore(alunoId, updated);
      return updated;
    });
  };

  const marcarModuloCompleto = (alunoId, cursoId, moduloId) => {
    setProgresso(prev => {
      const updated = prev.map(p => {
        if (p.alunoId === alunoId && p.cursoId === cursoId && !p.modulosCompletos.includes(moduloId)) {
          return { ...p, modulosCompletos: [...p.modulosCompletos, moduloId] };
        }
        return p;
      });
      saveToFirestore(alunoId, updated);
      return updated;
    });
  };

  const salvarAvaliacao = (alunoId, cursoId, avaliacaoId, nota, respostas, isFinal = false) => {
    setProgresso(prev => {
      const updated = prev.map(p => {
        if (p.alunoId !== alunoId || p.cursoId !== cursoId) return p;
        if (isFinal) {
          return {
            ...p,
            avaliacaoFinal: { nota, tentativa: 1, respostas },
            status: 'finalizado',
            resultado: nota >= 6 ? 'aprovado' : 'reprovado',
            dataFim: new Date().toISOString().split('T')[0],
          };
        }
        const ex = p.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);
        return {
          ...p,
          avaliacoesFeitas: ex
            ? p.avaliacoesFeitas.map(a =>
                a.avaliacaoId === avaliacaoId
                  ? { ...a, nota, tentativa: a.tentativa + 1, respostas }
                  : a
              )
            : [...p.avaliacoesFeitas, { avaliacaoId, nota, tentativa: 1, respostas }],
        };
      });
      saveToFirestore(alunoId, updated);
      return updated;
    });
  };

  return (
    <DataContext.Provider value={{
      cursos,
      progresso,
      getCursosEmAndamento,
      getCursosFinalizados,
      getProgressoCurso,
      marcarAulaAssistida,
      marcarModuloCompleto,
      salvarAvaliacao,
      calcularProgresso,
      ensureMatriculado,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider');
  return ctx;
};
