import { createContext, useContext, useState } from 'react';
import { 
  mockCursos, 
  mockProgresso, 
  mockUsers, 
  mockTurmas,
  calcularProgresso 
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
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
  const getProgressoCurso = (alunoId, cursoId) => {
    return progresso.find(p => p.alunoId === alunoId && p.cursoId === cursoId);
  };

  // Marcar aula como assistida
  const marcarAulaAssistida = (alunoId, cursoId, aulaId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.aulasAssistidas.includes(aulaId)) {
          return {
            ...p,
            aulasAssistidas: [...p.aulasAssistidas, aulaId]
          };
        }
      }
      return p;
    }));
  };

  // Marcar módulo como completo
  const marcarModuloCompleto = (alunoId, cursoId, moduloId) => {
    setProgresso(prev => prev.map(p => {
      if (p.alunoId === alunoId && p.cursoId === cursoId) {
        if (!p.modulosCompletos.includes(moduloId)) {
          return {
            ...p,
            modulosCompletos: [...p.modulosCompletos, moduloId]
          };
        }
      }
      return p;
    }));
  };

  // Salvar avaliação
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
          const avaliacaoExistente = p.avaliacoesFeitas.find(a => a.avaliacaoId === avaliacaoId);
          if (avaliacaoExistente) {
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

  return (
    <DataContext.Provider value={{
      cursos,
      progresso,
      alunos,
      turmas,
      getCursosAluno,
      getCursosEmAndamento,
      getCursosFinalizados,
      getProgressoCurso,
      marcarAulaAssistida,
      marcarModuloCompleto,
      salvarAvaliacao,
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
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};
