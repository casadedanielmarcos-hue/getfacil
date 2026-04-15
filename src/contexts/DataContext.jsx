import { createContext, useContext, useState } from 'react';
import { courses, initialProgress, STUDENT_ID } from '../data/courses';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [cursos] = useState(courses);
  const [progresso, setProgresso] = useState(initialProgress);

  const ALUNO_ID = STUDENT_ID;

  const calcularProgresso = (cursoId, alunoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    const prog = progresso.find(p => p.cursoId === cursoId && p.alunoId === alunoId);
    if (!curso || !prog) return 0;
    const totalAulas = curso.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalAulas === 0) return 0;
    return Math.round((prog.aulasAssistidas.length / totalAulas) * 100);
  };

  // Auto-enroll student when they access a course
  const ensureMatriculado = (alunoId, cursoId) => {
    const exists = progresso.some(p => p.alunoId === alunoId && p.cursoId === cursoId);
    if (!exists) {
      setProgresso(prev => [...prev, {
        alunoId,
        cursoId,
        status: 'andamento',
        aulasAssistidas: [],
        modulosCompletos: [],
        avaliacoesFeitas: [],
        avaliacaoFinal: null,
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: null
      }]);
    }
  };

  const getCursosEmAndamento = (alunoId) => {
    return progresso
      .filter(p => p.alunoId === alunoId && p.status === 'andamento')
      .map(p => {
        const curso = cursos.find(c => c.id === p.cursoId);
        if (!curso) return null;
        return {
          ...curso,
          progresso: calcularProgresso(p.cursoId, alunoId),
          status: p.status
        };
      })
      .filter(Boolean);
  };

  const getCursosFinalizados = (alunoId) => {
    return progresso
      .filter(p => p.alunoId === alunoId && p.status === 'finalizado')
      .map(p => {
        const curso = cursos.find(c => c.id === p.cursoId);
        if (!curso) return null;
        return {
          ...curso,
          progresso: 100,
          status: p.status,
          resultado: p.resultado
        };
      })
      .filter(Boolean);
  };

  const getProgressoCurso = (alunoId, cursoId) => {
    return progresso.find(p => p.alunoId === alunoId && p.cursoId === cursoId);
  };

  const marcarAulaAssistida = (alunoId, cursoId, aulaId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.aulasAssistidas.includes(aulaId)) {
          return { ...p, aulasAssistidas: [...p.aulasAssistidas, aulaId] };
        }
      }
      return p;
    }));
  };

  const marcarModuloCompleto = (alunoId, cursoId, moduloId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.modulosCompletos.includes(moduloId)) {
          return { ...p, modulosCompletos: [...p.modulosCompletos, moduloId] };
        }
      }
      return p;
    }));
  };

  const salvarAvaliacao = (alunoId, cursoId, avaliacaoId, nota, respostas, isFinal = false) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (isFinal) {
          const resultado = nota >= 6 ? 'aprovado' : 'reprovado';
          return {
            ...p,
            avaliacaoFinal: { nota, tentativa: 1, respostas },
            status: 'finalizado',
            resultado,
            dataFim: new Date().toISOString().split('T')[0]
          };
        } else {
          const existing = p.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);
          if (existing) {
            return {
              ...p,
              avaliacoesFeitas: p.avaliacoesFeitas.map(a =>
                a.avaliacaoId === avaliacaoId
                  ? { ...a, nota, tentativa: a.tentativa + 1, respostas }
                  : a
              )
            };
          } else {
            return {
              ...p,
              avaliacoesFeitas: [...p.avaliacoesFeitas, { avaliacaoId, nota, tentativa: 1, respostas }]
            };
          }
        }
      }
      return p;
    }));
  };

  return (
    <DataContext.Provider value={{
      cursos,
      progresso,
      ALUNO_ID,
      getCursosEmAndamento,
      getCursosFinalizados,
      getProgressoCurso,
      marcarAulaAssistida,
      marcarModuloCompleto,
      salvarAvaliacao,
      calcularProgresso,
      ensureMatriculado
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser usado dentro de DataProvider');
  return context;
};
