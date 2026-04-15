import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Header } from '../../components/ui/Header';
import { Card, Button, Modal, Input, Badge, EmptyState } from '../../components/ui';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Play,
  FileText,
  Users,
  Settings
} from 'lucide-react';

export function CursoGestao() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cursos, adicionarModulo, adicionarAula, adicionarAvaliacaoModulo, progresso, alunos } = useData();
  
  const [expandedModulo, setExpandedModulo] = useState(null);
  const [showModuloModal, setShowModuloModal] = useState(false);
  const [showAulaModal, setShowAulaModal] = useState(null); // moduloId
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(null); // moduloId
  
  // Form states
  const [moduloNome, setModuloNome] = useState('');
  const [aulaNome, setAulaNome] = useState('');
  const [aulaUrl, setAulaUrl] = useState('');
  const [aulaDuracao, setAulaDuracao] = useState('');

  const curso = cursos.find(c => c.id === cursoId);
  
  // Alunos matriculados
  const alunosMatriculados = progresso
    .filter(p => p.cursoId === cursoId)
    .map(p => ({
      ...alunos.find(a => a.id === p.alunoId),
      progresso: p
    }));

  if (!curso) {
    return <div>Curso não encontrado</div>;
  }

  const handleAddModulo = () => {
    if (moduloNome.trim()) {
      adicionarModulo(cursoId, { nome: moduloNome });
      setModuloNome('');
      setShowModuloModal(false);
    }
  };

  const handleAddAula = () => {
    if (aulaNome.trim() && aulaUrl.trim() && showAulaModal) {
      adicionarAula(cursoId, showAulaModal, {
        nome: aulaNome,
        url: aulaUrl,
        duracao: aulaDuracao || '00:00'
      });
      setAulaNome('');
      setAulaUrl('');
      setAulaDuracao('');
      setShowAulaModal(null);
    }
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

  const heroStyle = {
    position: 'relative',
    height: '150px',
    overflow: 'hidden'
  };

  const heroImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const heroOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 'var(--space-lg)'
  };

  const heroTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white'
  };

  const contentStyle = {
    padding: 'var(--space-lg)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const statsRowStyle = {
    display: 'flex',
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-xl)'
  };

  const statItemStyle = {
    flex: 1,
    textAlign: 'center',
    padding: 'var(--space-md)',
    background: 'white',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)'
  };

  const statValueStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--blue-600)'
  };

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  };

  const sectionStyle = {
    marginBottom: 'var(--space-xl)'
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

  const moduloCardStyle = {
    marginBottom: 'var(--space-md)'
  };

  const moduloHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md)',
    cursor: 'pointer'
  };

  const moduloTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const moduloNameStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'var(--text-primary)'
  };

  const moduloContentStyle = {
    padding: '0 var(--space-md) var(--space-md)',
    borderTop: '1px solid var(--border)'
  };

  const aulaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-sm) 0',
    borderBottom: '1px solid var(--border)'
  };

  const aulaIconStyle = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--blue-100)',
    color: 'var(--blue-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const actionsRowStyle = {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-md)',
    paddingTop: 'var(--space-md)',
    borderTop: '1px dashed var(--border)'
  };

  const totalAulas = curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0);

  return (
    <div style={pageStyle}>
      <Header />
      
      <button style={backButtonStyle} onClick={() => navigate('/professor')}>
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={heroStyle}>
        <img src={curso.capa} alt={curso.nome} style={heroImageStyle} />
        <div style={heroOverlayStyle}>
          <h1 style={heroTitleStyle}>{curso.nome}</h1>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={statsRowStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{curso.modulos.length}</div>
            <div style={statLabelStyle}>Módulos</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{totalAulas}</div>
            <div style={statLabelStyle}>Aulas</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{alunosMatriculados.length}</div>
            <div style={statLabelStyle}>Alunos</div>
          </div>
        </div>

        {/* Módulos */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>Módulos</span>
            <Button variant="primary" size="small" onClick={() => setShowModuloModal(true)}>
              <Plus size={16} />
              Módulo
            </Button>
          </div>

          {curso.modulos.length > 0 ? (
            curso.modulos.map((modulo, index) => {
              const isExpanded = expandedModulo === modulo.id;
              
              return (
                <Card key={modulo.id} style={moduloCardStyle}>
                  <div 
                    style={moduloHeaderStyle}
                    onClick={() => setExpandedModulo(isExpanded ? null : modulo.id)}
                  >
                    <div style={moduloTitleStyle}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--blue-600)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <span style={moduloNameStyle}>{modulo.nome}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {modulo.aulas.length} aulas
                          {modulo.avaliacao && ' • Avaliação configurada'}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>

                  {isExpanded && (
                    <div style={moduloContentStyle}>
                      {modulo.aulas.length > 0 ? (
                        modulo.aulas.map(aula => (
                          <div key={aula.id} style={aulaItemStyle}>
                            <div style={aulaIconStyle}>
                              <Play size={14} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{aula.nome}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{aula.duracao}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: 'var(--space-md) 0' }}>
                          Nenhuma aula adicionada
                        </p>
                      )}

                      {modulo.avaliacao && (
                        <div style={{ ...aulaItemStyle, background: 'var(--blue-50)', margin: 'var(--space-sm) 0', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: 'none' }}>
                          <div style={{ ...aulaIconStyle, background: 'var(--blue-600)', color: 'white' }}>
                            <FileText size={14} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{modulo.avaliacao.titulo}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {modulo.avaliacao.questoes?.length || 0} questões
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={actionsRowStyle}>
                        <Button 
                          variant="secondary" 
                          size="small" 
                          onClick={() => setShowAulaModal(modulo.id)}
                          style={{ flex: 1 }}
                        >
                          <Plus size={14} />
                          Aula
                        </Button>
                        {!modulo.avaliacao && (
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => navigate(`/professor/curso/${cursoId}/modulo/${modulo.id}/avaliacao`)}
                            style={{ flex: 1 }}
                          >
                            <FileText size={14} />
                            Avaliação
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <EmptyState
              icon={Settings}
              title="Nenhum módulo"
              description="Adicione módulos ao seu curso"
            />
          )}
        </div>

        {/* Alunos */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>Alunos Matriculados</span>
            <Button variant="secondary" size="small" onClick={() => navigate('/professor/alunos')}>
              <Users size={16} />
              Ver todos
            </Button>
          </div>

          {alunosMatriculados.length > 0 ? (
            alunosMatriculados.slice(0, 3).map(({ id, nome, turma, progresso: p }) => (
              <Card key={id} style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--blue-100)',
                    color: 'var(--blue-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.8rem'
                  }}>
                    {nome?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{nome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{turma}</div>
                  </div>
                  <Badge variant={p.status === 'finalizado' ? (p.resultado === 'aprovado' ? 'success' : 'error') : 'info'}>
                    {p.status === 'finalizado' ? p.resultado : 'Em andamento'}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <Card style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>Nenhum aluno matriculado</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal Adicionar Módulo */}
      <Modal isOpen={showModuloModal} onClose={() => setShowModuloModal(false)} title="Novo Módulo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Input
            label="Nome do Módulo"
            placeholder="Ex: Introdução ao curso"
            value={moduloNome}
            onChange={(e) => setModuloNome(e.target.value)}
          />
          <Button fullWidth onClick={handleAddModulo}>
            Adicionar Módulo
          </Button>
        </div>
      </Modal>

      {/* Modal Adicionar Aula */}
      <Modal isOpen={!!showAulaModal} onClose={() => setShowAulaModal(null)} title="Nova Aula">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Input
            label="Nome da Aula"
            placeholder="Ex: O que é programação?"
            value={aulaNome}
            onChange={(e) => setAulaNome(e.target.value)}
          />
          <Input
            label="URL do Vídeo (embed)"
            placeholder="https://www.youtube.com/embed/..."
            value={aulaUrl}
            onChange={(e) => setAulaUrl(e.target.value)}
          />
          <Input
            label="Duração"
            placeholder="Ex: 15:30"
            value={aulaDuracao}
            onChange={(e) => setAulaDuracao(e.target.value)}
          />
          <Button fullWidth onClick={handleAddAula}>
            Adicionar Aula
          </Button>
        </div>
      </Modal>
    </div>
  );
}
