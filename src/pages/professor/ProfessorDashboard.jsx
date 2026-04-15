import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Badge, Tabs, EmptyState } from '../../components/ui';
import { 
  BookOpen, 
  Users, 
  Plus, 
  ChevronRight,
  BarChart3,
  GraduationCap
} from 'lucide-react';

export function ProfessorDashboard() {
  const { user } = useAuth();
  const { cursos, alunos, progresso } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cursos');

  // Filtrar cursos do professor
  const meusCursos = cursos.filter(c => c.professorId === user.id);

  // Estatísticas
  const totalAlunos = new Set(
    progresso
      .filter(p => meusCursos.some(c => c.id === p.cursoId))
      .map(p => p.alunoId)
  ).size;

  const alunosAtivos = progresso.filter(
    p => meusCursos.some(c => c.id === p.cursoId) && p.status === 'andamento'
  ).length;

  const pageStyle = {
    minHeight: '100vh',
    background: 'var(--background)',
    paddingBottom: '100px'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const greetingStyle = {
    marginBottom: 'var(--space-lg)'
  };

  const greetingTextStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--space-xs)'
  };

  const greetingNameStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-xl)'
  };

  const statCardStyle = {
    padding: 'var(--space-md)',
    textAlign: 'center'
  };

  const statIconStyle = {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--blue-100)',
    color: 'var(--blue-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto var(--space-sm)'
  };

  const statValueStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  };

  const statLabelStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  };

  const sectionStyle = {
    marginTop: 'var(--space-lg)'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-md)'
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  const coursesGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)'
  };

  const courseCardStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    cursor: 'pointer'
  };

  const courseImageStyle = {
    width: '80px',
    height: '60px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    flexShrink: 0
  };

  const courseInfoStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const courseNameStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: 'var(--text-primary)'
  };

  const courseMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  };

  const tabs = [
    { id: 'cursos', label: 'Meus Cursos' },
    { id: 'alunos', label: 'Alunos' }
  ];

  // Obter contagem de alunos por curso
  const getAlunosCurso = (cursoId) => {
    return progresso.filter(p => p.cursoId === cursoId).length;
  };

  // Lista de alunos matriculados nos cursos do professor
  const alunosDosProfessor = alunos.filter(a => 
    progresso.some(p => 
      p.alunoId === a.id && meusCursos.some(c => c.id === p.cursoId)
    )
  );

  return (
    <div style={pageStyle}>
      <Header />
      
      <div style={contentStyle}>
        <div style={greetingStyle}>
          <p style={greetingTextStyle}>Olá,</p>
          <h1 style={greetingNameStyle}>{user.nome.split(' ').slice(0, 2).join(' ')}! 👋</h1>
        </div>

        <div style={statsGridStyle}>
          <Card style={statCardStyle}>
            <div style={statIconStyle}>
              <BookOpen size={22} />
            </div>
            <div style={statValueStyle}>{meusCursos.length}</div>
            <div style={statLabelStyle}>Cursos</div>
          </Card>
          
          <Card style={statCardStyle}>
            <div style={statIconStyle}>
              <Users size={22} />
            </div>
            <div style={statValueStyle}>{totalAlunos}</div>
            <div style={statLabelStyle}>Alunos</div>
          </Card>
          
          <Card style={statCardStyle}>
            <div style={statIconStyle}>
              <BarChart3 size={22} />
            </div>
            <div style={statValueStyle}>{alunosAtivos}</div>
            <div style={statLabelStyle}>Em andamento</div>
          </Card>
          
          <Card style={statCardStyle}>
            <div style={statIconStyle}>
              <GraduationCap size={22} />
            </div>
            <div style={statValueStyle}>
              {progresso.filter(p => 
                meusCursos.some(c => c.id === p.cursoId) && 
                p.status === 'finalizado' && 
                p.resultado === 'aprovado'
              ).length}
            </div>
            <div style={statLabelStyle}>Aprovados</div>
          </Card>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={sectionStyle}>
          {activeTab === 'cursos' ? (
            <>
              <div style={sectionHeaderStyle}>
                <span style={sectionTitleStyle}>Seus Cursos</span>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => navigate('/professor/curso/novo')}
                >
                  <Plus size={16} />
                  Novo
                </Button>
              </div>

              {meusCursos.length > 0 ? (
                <div style={coursesGridStyle}>
                  {meusCursos.map(curso => (
                    <Card 
                      key={curso.id} 
                      hover 
                      onClick={() => navigate(`/professor/curso/${curso.id}`)}
                      style={courseCardStyle}
                    >
                      <img 
                        src={curso.capa} 
                        alt={curso.nome} 
                        style={courseImageStyle}
                      />
                      <div style={courseInfoStyle}>
                        <h3 style={courseNameStyle}>{curso.nome}</h3>
                        <div style={courseMetaStyle}>
                          <span>{curso.modulos.length} módulos</span>
                          <span>•</span>
                          <span>{getAlunosCurso(curso.id)} alunos</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="var(--text-muted)" style={{ alignSelf: 'center' }} />
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Nenhum curso criado"
                  description="Crie seu primeiro curso para começar"
                  action={
                    <Button onClick={() => navigate('/professor/curso/novo')}>
                      <Plus size={16} />
                      Criar Curso
                    </Button>
                  }
                />
              )}
            </>
          ) : (
            <>
              <div style={sectionHeaderStyle}>
                <span style={sectionTitleStyle}>Lista de Alunos</span>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => navigate('/professor/alunos')}
                >
                  Ver todos
                </Button>
              </div>

              {alunosDosProfessor.length > 0 ? (
                <div style={coursesGridStyle}>
                  {alunosDosProfessor.slice(0, 5).map(aluno => {
                    const progressoAluno = progresso.filter(p => 
                      p.alunoId === aluno.id && meusCursos.some(c => c.id === p.cursoId)
                    );
                    const cursosAtivos = progressoAluno.filter(p => p.status === 'andamento').length;

                    return (
                      <Card 
                        key={aluno.id} 
                        hover
                        onClick={() => navigate(`/professor/alunos?aluno=${aluno.id}`)}
                        style={{ padding: 'var(--space-md)', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                              {aluno.nome}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {aluno.turma} • {cursosAtivos} curso(s) ativo(s)
                            </div>
                          </div>
                          <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="Nenhum aluno matriculado"
                  description="Seus alunos aparecerão aqui"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
