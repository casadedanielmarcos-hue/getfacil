import { Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD

// Pages
import { Home } from './pages/Home';
=======
import { useAuth } from './contexts/AuthContext';

// Pages
import { LoginPage } from './pages/LoginPage';

// Aluno Pages
import { AlunoDashboard } from './pages/aluno/AlunoDashboard';
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
import { CursoView } from './pages/aluno/CursoView';
import { AulaPlayer } from './pages/aluno/AulaPlayer';
import { AvaliacaoPage } from './pages/aluno/AvaliacaoPage';
import { AvaliacaoFinal } from './pages/aluno/AvaliacaoFinal';
import { CertificadoPage } from './pages/aluno/CertificadoPage';

<<<<<<< HEAD
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/curso/:cursoId" element={<CursoView />} />
      <Route path="/curso/:cursoId/aula/:aulaId" element={<AulaPlayer />} />
      <Route path="/curso/:cursoId/avaliacao/:avaliacaoId" element={<AvaliacaoPage />} />
      <Route path="/curso/:cursoId/avaliacao-final" element={<AvaliacaoFinal />} />
      <Route path="/certificado/:cursoId" element={<CertificadoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
=======
// Professor Pages
import { ProfessorDashboard } from './pages/professor/ProfessorDashboard';
import { CursoGestao } from './pages/professor/CursoGestao';
import { NovoCurso } from './pages/professor/NovoCurso';
import { AlunosLista } from './pages/professor/AlunosLista';
import { AvaliacaoConfig } from './pages/professor/AvaliacaoConfig';

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.tipo !== allowedRole) {
    return <Navigate to={user?.tipo === 'professor' ? '/professor' : '/aluno'} replace />;
  }

  return children;
}

// Redirect based on user type
function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user?.tipo === 'professor' ? '/professor' : '/aluno'} replace />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Home Redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Aluno Routes */}
      <Route
        path="/aluno"
        element={
          <ProtectedRoute allowedRole="aluno">
            <AlunoDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/curso/:cursoId"
        element={
          <ProtectedRoute allowedRole="aluno">
            <CursoView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/curso/:cursoId/aula/:aulaId"
        element={
          <ProtectedRoute allowedRole="aluno">
            <AulaPlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/curso/:cursoId/avaliacao/:avaliacaoId"
        element={
          <ProtectedRoute allowedRole="aluno">
            <AvaliacaoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/curso/:cursoId/avaliacao-final"
        element={
          <ProtectedRoute allowedRole="aluno">
            <AvaliacaoFinal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/certificado/:cursoId"
        element={
          <ProtectedRoute allowedRole="aluno">
            <CertificadoPage />
          </ProtectedRoute>
        }
      />

      {/* Professor Routes */}
      <Route
        path="/professor"
        element={
          <ProtectedRoute allowedRole="professor">
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/curso/novo"
        element={
          <ProtectedRoute allowedRole="professor">
            <NovoCurso />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/curso/:cursoId"
        element={
          <ProtectedRoute allowedRole="professor">
            <CursoGestao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/curso/:cursoId/modulo/:moduloId/avaliacao"
        element={
          <ProtectedRoute allowedRole="professor">
            <AvaliacaoConfig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/alunos"
        element={
          <ProtectedRoute allowedRole="professor">
            <AlunosLista />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<HomeRedirect />} />
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    </Routes>
  );
}

export default App;
