import { createContext, useContext, useState } from 'react';
<<<<<<< HEAD
import { courses, initialProgress, STUDENT_ID } from '../data/courses';
=======
import { 
  mockCursos, 
  mockProgresso, 
  mockUsers, 
  mockTurmas,
  calcularProgresso 
} from '../data/mockData';
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

const DataContext = createContext(null);

export function DataProvider({ children }) {
<<<<<<< HEAD
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

=======
  const [cursos, setCursos] = useState(mockCursos);
  const [progresso, setProgresso] = useState(mockProgresso);
  const [turmas] = useState(mockTurmas);

  // Estado dos alunos com campo bloqueado
  const [alunosState, setAlunosState] = useState(
    mockUsers.alunos.map(a => ({ ...a, bloqueado: false }))
  );
  
  // Alias para compatibilidade
  const alunos = alunosState;

  // Buscar cursos de um aluno
  const getCursosAluno = (alunoId) => {
    const progressoAluno = progresso.filter(p => p.alunoId === alunoId);
    return progressoAluno.map(p => {
      const curso = cursos.find(c => c.id === p.cursoId);
      return {
        ...curso,
        progresso: calcularProgresso(p.cursoId, alunoId),
        status: p.status,
        resultado: p.resultado,
        avaliacaoFinalFeita: p.avaliacaoFinal !== null
      };
    });
  };

  // Buscar cursos em andamento
  const getCursosEmAndamento = (alunoId) => {
    return getCursosAluno(alunoId).filter(c => c.status === 'andamento');
  };

  // Buscar cursos finalizados
  const getCursosFinalizados = (alunoId) => {
    return getCursosAluno(alunoId).filter(c => c.status === 'finalizado');
  };

  // Buscar progresso específico
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  const getProgressoCurso = (alunoId, cursoId) => {
    return progresso.find(p => p.alunoId === alunoId && p.cursoId === cursoId);
  };

<<<<<<< HEAD
=======
  // Marcar aula como assistida
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  const marcarAulaAssistida = (alunoId, cursoId, aulaId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.aulasAssistidas.includes(aulaId)) {
<<<<<<< HEAD
          return { ...p, aulasAssistidas: [...p.aulasAssistidas, aulaId] };
=======
          return {
            ...p,
            aulasAssistidas: [...p.aulasAssistidas, aulaId]
          };
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
        }
      }
      return p;
    }));
  };

<<<<<<< HEAD
=======
  // Marcar módulo como completo
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  const marcarModuloCompleto = (alunoId, cursoId, moduloId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.modulosCompletos.includes(moduloId)) {
<<<<<<< HEAD
          return { ...p, modulosCompletos: [...p.modulosCompletos, moduloId] };
=======
          return {
            ...p,
            modulosCompletos: [...p.modulosCompletos, moduloId]
          };
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
        }
      }
      return p;
    }));
  };

<<<<<<< HEAD
=======
  // Salvar avaliação
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
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
<<<<<<< HEAD
          const existing = p.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);
          if (existing) {
            return {
              ...p,
              avaliacoesFeitas: p.avaliacoesFeitas.map(a =>
                a.avaliacaoId === avaliacaoId
=======
          const avaliacaoExistente = p.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);
          if (avaliacaoExistente) {
            return {
              ...p,
              avaliacoesFeitas: p.avaliacoesFeitas.map(a => 
                a.avaliacaoId === avaliacaoId 
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
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

<<<<<<< HEAD
=======
  // Dar segunda chance em avaliação
  const darSegundaChance = (alunoId, cursoId, avaliacaoId, isFinal = false) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (isFinal) {
          return {
            ...p,
            avaliacaoFinal: null,
            status: 'andamento',
            resultado: null,
            dataFim: null
          };
        } else {
          return {
            ...p,
            avaliacoesFeitas: p.avaliacoesFeitas.filter(a => a.avaliacaoId !== avaliacaoId)
          };
        }
      }
      return p;
    }));
  };

  // Adicionar curso
  const adicionarCurso = (novoCurso) => {
    const id = `c${Date.now()}`;
    setCursos(prev => [...prev, { ...novoCurso, id, modulos: [] }]);
    return id;
  };

  // Adicionar módulo a um curso
  const adicionarModulo = (cursoId, novoModulo) => {
    const id = `m${Date.now()}`;
    setCursos(prev => prev.map(c => {
      if (c.id === cursoId) {
        return {
          ...c,
          modulos: [...c.modulos, { ...novoModulo, id, aulas: [], avaliacao: null, ordem: c.modulos.length + 1 }]
        };
      }
      return c;
    }));
    return id;
  };

  // Adicionar aula a um módulo
  const adicionarAula = (cursoId, moduloId, novaAula) => {
    const id = `a${Date.now()}`;
    setCursos(prev => prev.map(c => {
      if (c.id === cursoId) {
        return {
          ...c,
          modulos: c.modulos.map(m => {
            if (m.id === moduloId) {
              return {
                ...m,
                aulas: [...m.aulas, { ...novaAula, id, ordem: m.aulas.length + 1 }]
              };
            }
            return m;
          })
        };
      }
      return c;
    }));
    return id;
  };

  // Adicionar avaliação ao módulo
  const adicionarAvaliacaoModulo = (cursoId, moduloId, avaliacao) => {
    const id = `av${Date.now()}`;
    setCursos(prev => prev.map(c => {
      if (c.id === cursoId) {
        return {
          ...c,
          modulos: c.modulos.map(m => {
            if (m.id === moduloId) {
              return { ...m, avaliacao: { ...avaliacao, id } };
            }
            return m;
          })
        };
      }
      return c;
    }));
    return id;
  };

  // Adicionar avaliação final ao curso
  const adicionarAvaliacaoFinal = (cursoId, avaliacao) => {
    const id = `avf${Date.now()}`;
    setCursos(prev => prev.map(c => {
      if (c.id === cursoId) {
        return { ...c, avaliacaoFinal: { ...avaliacao, id } };
      }
      return c;
    }));
    return id;
  };

  // Matricular aluno em curso
  const matricularAluno = (alunoId, cursoId) => {
    const jaMatriculado = progresso.some(p => p.alunoId === alunoId && p.cursoId === cursoId);
    if (!jaMatriculado) {
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
      return true;
    }
    return false;
  };

  // Remover aluno de curso (alias para compatibilidade)
  const removerAlunoCurso = (alunoId, cursoId) => {
    setProgresso(prev => prev.filter(p => !(p.alunoId === alunoId && p.cursoId === cursoId)));
  };

  const removerMatricula = removerAlunoCurso;

  // Bloquear/desbloquear aluno globalmente
  const bloquearAluno = (alunoId, bloquear = true) => {
    setAlunosState(prev => prev.map(a => 
      a.id === alunoId ? { ...a, bloqueado: bloquear } : a
    ));
  };

  const desbloquearAluno = (alunoId) => {
    bloquearAluno(alunoId, false);
  };

  const isAlunoBloqueado = (alunoId) => {
    return alunosState.find(a => a.id === alunoId)?.bloqueado || false;
  };

>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  return (
    <DataContext.Provider value={{
      cursos,
      progresso,
<<<<<<< HEAD
      ALUNO_ID,
=======
      alunos,
      turmas,
      getCursosAluno,
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      getCursosEmAndamento,
      getCursosFinalizados,
      getProgressoCurso,
      marcarAulaAssistida,
      marcarModuloCompleto,
      salvarAvaliacao,
<<<<<<< HEAD
      calcularProgresso,
      ensureMatriculado
=======
      darSegundaChance,
      adicionarCurso,
      adicionarModulo,
      adicionarAula,
      adicionarAvaliacaoModulo,
      adicionarAvaliacaoFinal,
      matricularAluno,
      removerAlunoCurso,
      removerMatricula,
      bloquearAluno,
      desbloquearAluno,
      isAlunoBloqueado,
      calcularProgresso
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
<<<<<<< HEAD
  if (!context) throw new Error('useData deve ser usado dentro de DataProvider');
=======
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  return context;
};
