import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Input, Badge, Modal, EmptyState, Tabs } from '../../components/ui';
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  UserX, 
  Ban, 
  BookPlus,
  ChevronRight,
  Users,
  Filter
} from 'lucide-react';

export function AlunosLista() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { cursos, alunos, progresso, turmas, bloquearAluno, removerMatricula, matricularAluno } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('todas');
  const [showActionsModal, setShowActionsModal] = useState(null); // alunoId
  const [showMatricularModal, setShowMatricularModal] = useState(null); // alunoId
  const [activeTab, setActiveTab] = useState('ativos');

  // Cursos do professor
  const meusCursos = cursos.filter(c => c.professorId === user.id);

  // Alunos nos cursos do professor
  const alunosDosProfessor = useMemo(() => {
    const alunoIds = new Set(
      progresso
        .filter(p => meusCursos.some(c => c.id === p.cursoId))
        .map(p => p.alunoId)
    );
    
    return alunos.filter(a => alunoIds.has(a.id)).map(aluno => {
      const progressoAluno = progresso.filter(p => 
        p.alunoId === aluno.id && meusCursos.some(c => c.id === p.cursoId)
      );
      
      return {
        ...aluno,
        cursosAtivos: progressoAluno.filter(p => p.status === 'andamento').length,
        cursosFinalizados: progressoAluno.filter(p => p.status === 'finalizado').length,
        progressoDetalhado: progressoAluno
      };
    });
  }, [alunos, progresso, meusCursos]);

  // Filtrar por busca e turma
  const alunosFiltrados = useMemo(() => {
    return alunosDosProfessor.filter(aluno => {
      const matchSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aluno.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTurma = selectedTurma === 'todas' || aluno.turma === selectedTurma;
      const matchTab = activeTab === 'ativos' ? !aluno.bloqueado : aluno.bloqueado;
      
      return matchSearch && matchTurma && matchTab;
    });
  }, [alunosDosProfessor, searchTerm, selectedTurma, activeTab]);

  // Turmas únicas
  const turmasUnicas = [...new Set(alunosDosProfessor.map(a => a.turma))];

  const handleBloquear = (alunoId) => {
    const aluno = alunos.find(a => a.id === alunoId);
    if (confirm(`Tem certeza que deseja ${aluno?.bloqueado ? 'desbloquear' : 'bloquear'} este aluno?`)) {
      bloquearAluno(alunoId, !aluno?.bloqueado);
      setShowActionsModal(null);
    }
  };

  const handleRemover = (alunoId, cursoId) => {
    if (confirm('Tem certeza que deseja remover este aluno do curso?')) {
      removerMatricula(alunoId, cursoId);
      setShowActionsModal(null);
    }
  };

  const handleMatricular = (alunoId, cursoId) => {
    matricularAluno(alunoId, cursoId);
    setShowMatricularModal(null);
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'var(--background)',
    paddingBottom: '100px'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: 'var(--space-md) var(--space-lg)',
    color: 'var(--blue-600)',
    fontWeight: '500',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: 'var(--space-lg)'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-xs)'
  };

  const subtitleStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  };

  const filtersStyle = {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-md)'
  };

  const selectStyle = {
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'white',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    cursor: 'pointer'
  };

  const alunoCardStyle = {
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-sm)'
  };

  const alunoHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)'
  };

  const avatarStyle = (bloqueado) => ({
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-full)',
    background: bloqueado 
      ? 'var(--error)' 
      : 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
    flexShrink: 0
  });

  const alunoInfoStyle = {
    flex: 1,
    minWidth: 0
  };

  const alunoNameStyle = {
    fontWeight: '600',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    marginBottom: '2px'
  };

  const alunoMetaStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const actionButtonStyle = {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border)',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-muted)'
  };

  const cursosListStyle = {
    marginTop: 'var(--space-md)',
    paddingTop: 'var(--space-md)',
    borderTop: '1px solid var(--border)'
  };

  const cursoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-xs) 0',
    fontSize: '0.85rem'
  };

  const tabs = [
    { id: 'ativos', label: `Ativos (${alunosDosProfessor.filter(a => !a.bloqueado).length})` },
    { id: 'bloqueados', label: `Bloqueados (${alunosDosProfessor.filter(a => a.bloqueado).length})` }
  ];

  // Cursos em que o aluno NÃO está matriculado
  const getCursosDisponiveis = (alunoId) => {
    const cursosMatriculados = progresso
      .filter(p => p.alunoId === alunoId)
      .map(p => p.cursoId);
    
    return meusCursos.filter(c => !cursosMatriculados.includes(c.id));
  };

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate('/professor')}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Alunos</h1>
          <p style={subtitleStyle}>{alunosDosProfessor.length} alunos matriculados</p>
        </div>

        <div style={{ marginBottom: 'var(--space-md)', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} 
          />
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              paddingLeft: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={filtersStyle}>
          <select 
            value={selectedTurma} 
            onChange={(e) => setSelectedTurma(e.target.value)}
            style={selectStyle}
          >
            <option value="todas">Todas as turmas</option>
            {turmasUnicas.map(turma => (
              <option key={turma} value={turma}>{turma}</option>
            ))}
          </select>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ marginTop: 'var(--space-lg)' }}>
          {alunosFiltrados.length > 0 ? (
            alunosFiltrados.map(aluno => (
              <Card key={aluno.id} style={alunoCardStyle}>
                <div style={alunoHeaderStyle}>
                  <div style={avatarStyle(aluno.bloqueado)}>
                    {aluno.bloqueado ? (
                      <Ban size={20} />
                    ) : (
                      aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')
                    )}
                  </div>
                  <div style={alunoInfoStyle}>
                    <div style={alunoNameStyle}>{aluno.nome}</div>
                    <div style={alunoMetaStyle}>
                      <span>{aluno.turma}</span>
                      <span>•</span>
                      <span>{aluno.cursosAtivos} curso(s) ativo(s)</span>
                    </div>
                  </div>
                  <button 
                    style={actionButtonStyle}
                    onClick={() => setShowActionsModal(aluno.id)}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                {aluno.progressoDetalhado.length > 0 && (
                  <div style={cursosListStyle}>
                    {aluno.progressoDetalhado.map(p => {
                      const curso = cursos.find(c => c.id === p.cursoId);
                      return (
                        <div key={p.cursoId} style={cursoItemStyle}>
                          <span style={{ color: 'var(--text-secondary)' }}>{curso?.nome}</span>
                          <Badge 
                            variant={
                              p.status === 'finalizado' 
                                ? (p.resultado === 'aprovado' ? 'success' : 'error')
                                : 'info'
                            }
                            size="small"
                          >
                            {p.status === 'finalizado' ? p.resultado : 'Andamento'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Users}
              title="Nenhum aluno encontrado"
              description={searchTerm ? 'Tente outra busca' : 'Não há alunos nesta categoria'}
            />
          )}
        </div>
      </div>

      {/* Modal de Ações */}
      <Modal 
        isOpen={!!showActionsModal} 
        onClose={() => setShowActionsModal(null)} 
        title="Ações do Aluno"
      >
        {showActionsModal && (() => {
          const aluno = alunos.find(a => a.id === showActionsModal);
          const cursosAluno = progresso.filter(p => 
            p.alunoId === showActionsModal && meusCursos.some(c => c.id === p.cursoId)
          );

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ 
                padding: 'var(--space-md)', 
                background: 'var(--blue-50)', 
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: '600' }}>{aluno?.nome}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{aluno?.email}</div>
              </div>

              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowActionsModal(null);
                  setShowMatricularModal(showActionsModal);
                }}
              >
                <BookPlus size={18} />
                Matricular em Curso
              </Button>

              <Button
                variant={aluno?.bloqueado ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => handleBloquear(showActionsModal)}
              >
                <Ban size={18} />
                {aluno?.bloqueado ? 'Desbloquear Aluno' : 'Bloquear Aluno'}
              </Button>

              {cursosAluno.length > 0 && (
                <>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)',
                    marginTop: 'var(--space-sm)'
                  }}>
                    Remover de curso:
                  </div>
                  {cursosAluno.map(p => {
                    const curso = cursos.find(c => c.id === p.cursoId);
                    return (
                      <Button
                        key={p.cursoId}
                        variant="secondary"
                        fullWidth
                        onClick={() => handleRemover(showActionsModal, p.cursoId)}
                        style={{ 
                          justifyContent: 'space-between',
                          color: 'var(--error)'
                        }}
                      >
                        <span>{curso?.nome}</span>
                        <UserX size={16} />
                      </Button>
                    );
                  })}
                </>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Modal Matricular */}
      <Modal 
        isOpen={!!showMatricularModal} 
        onClose={() => setShowMatricularModal(null)} 
        title="Matricular em Curso"
      >
        {showMatricularModal && (() => {
          const aluno = alunos.find(a => a.id === showMatricularModal);
          const cursosDisponiveis = getCursosDisponiveis(showMatricularModal);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ 
                padding: 'var(--space-md)', 
                background: 'var(--blue-50)', 
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: '600' }}>{aluno?.nome}</div>
              </div>

              {cursosDisponiveis.length > 0 ? (
                cursosDisponiveis.map(curso => (
                  <Button
                    key={curso.id}
                    variant="secondary"
                    fullWidth
                    onClick={() => handleMatricular(showMatricularModal, curso.id)}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>{curso.nome}</span>
                    <ChevronRight size={16} />
                  </Button>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-lg)' }}>
                  Aluno já está matriculado em todos os seus cursos
                </p>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
