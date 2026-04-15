import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { GraduationCap, User, BookOpen } from 'lucide-react';

export function LoginPage() {
  const [userType, setUserType] = useState(null); // 'aluno' ou 'professor'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, senha, userType);
    
    if (result.success) {
      navigate(userType === 'aluno' ? '/aluno' : '/professor');
    } else {
      setError(result.error);
    }
  };

  const containerStyle = {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-lg)',
    background: 'linear-gradient(135deg, var(--blue-50) 0%, var(--blue-100) 50%, white 100%)'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 'var(--space-xl)',
    animation: 'slideUp 500ms ease'
  };

  const logoIconStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    borderRadius: 'var(--radius-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginBottom: 'var(--space-md)',
    boxShadow: 'var(--shadow-lg), 0 8px 32px rgba(37, 99, 235, 0.3)'
  };

  const logoTextStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-800) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    marginTop: 'var(--space-xs)'
  };

  const cardContainerStyle = {
    width: '100%',
    maxWidth: '400px',
    animation: 'slideUp 600ms ease'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: 'var(--space-lg)'
  };

  const typeSelectionStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-lg)'
  };

  const typeCardStyle = (isSelected, type) => ({
    padding: 'var(--space-lg)',
    borderRadius: 'var(--radius-lg)',
    border: `2px solid ${isSelected ? 'var(--blue-500)' : 'var(--border)'}`,
    background: isSelected ? 'var(--blue-50)' : 'white',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textAlign: 'center'
  });

  const typeIconStyle = (isSelected) => ({
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-full)',
    background: isSelected 
      ? 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)'
      : 'var(--blue-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isSelected ? 'white' : 'var(--blue-600)',
    transition: 'all var(--transition-fast)'
  });

  const typeLabelStyle = (isSelected) => ({
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    color: isSelected ? 'var(--blue-700)' : 'var(--text-secondary)'
  });

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)'
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#991b1b',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    textAlign: 'center'
  };

  const demoInfoStyle = {
    marginTop: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--blue-50)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textAlign: 'center'
  };

  // Se não selecionou tipo, mostra seleção
  if (!userType) {
    return (
      <div style={containerStyle}>
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>
            <GraduationCap size={40} />
          </div>
          <h1 style={logoTextStyle}>Get Fácil</h1>
          <p style={subtitleStyle}>Sua plataforma de cursos</p>
        </div>

        <div style={cardContainerStyle}>
          <Card elevated style={{ padding: 'var(--space-xl)' }}>
            <h2 style={titleStyle}>Como deseja entrar?</h2>
            
            <div style={typeSelectionStyle}>
              <div
                style={typeCardStyle(false, 'aluno')}
                onClick={() => setUserType('aluno')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--blue-300)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={typeIconStyle(false)}>
                  <User size={24} />
                </div>
                <span style={typeLabelStyle(false)}>Sou Aluno</span>
              </div>

              <div
                style={typeCardStyle(false, 'professor')}
                onClick={() => setUserType('professor')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--blue-300)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={typeIconStyle(false)}>
                  <BookOpen size={24} />
                </div>
                <span style={typeLabelStyle(false)}>Sou Professor</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Formulário de login
  return (
    <div style={containerStyle}>
      <div style={logoContainerStyle}>
        <div style={logoIconStyle}>
          <GraduationCap size={40} />
        </div>
        <h1 style={logoTextStyle}>Get Fácil</h1>
        <p style={subtitleStyle}>Sua plataforma de cursos</p>
      </div>

      <div style={cardContainerStyle}>
        <Card elevated style={{ padding: 'var(--space-xl)' }}>
          <div style={typeSelectionStyle}>
            <div
              style={typeCardStyle(userType === 'aluno', 'aluno')}
              onClick={() => setUserType('aluno')}
            >
              <div style={typeIconStyle(userType === 'aluno')}>
                <User size={24} />
              </div>
              <span style={typeLabelStyle(userType === 'aluno')}>Aluno</span>
            </div>

            <div
              style={typeCardStyle(userType === 'professor', 'professor')}
              onClick={() => setUserType('professor')}
            >
              <div style={typeIconStyle(userType === 'professor')}>
                <BookOpen size={24} />
              </div>
              <span style={typeLabelStyle(userType === 'professor')}>Professor</span>
            </div>
          </div>

          <form style={formStyle} onSubmit={handleLogin}>
            {error && <div style={errorStyle}>{error}</div>}
            
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Button type="submit" fullWidth size="large" style={{ marginTop: 'var(--space-sm)' }}>
              Entrar
            </Button>
          </form>

          <div style={demoInfoStyle}>
            <strong>Demo:</strong><br />
            Aluno: maria@email.com / 123456<br />
            Professor: roberto@email.com / 123456
          </div>
        </Card>
      </div>
    </div>
  );
}
