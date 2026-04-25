import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { Home } from './pages/Home';
import { MeusCursos } from './pages/aluno/MeusCursos';
import { CursoView } from './pages/aluno/CursoView';
import { AulaPlayer } from './pages/aluno/AulaPlayer';
import { AvaliacaoPage } from './pages/aluno/AvaliacaoPage';
import { AvaliacaoFinal } from './pages/aluno/AvaliacaoFinal';
import { CertificadoPage } from './pages/aluno/CertificadoPage';

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <Routes>
      <Route path="/"                                          element={<LoginPage />} />
      <Route path="/home"                                      element={<P><Home /></P>} />
      <Route path="/meus-cursos"                               element={<P><MeusCursos /></P>} />
      <Route path="/curso/:cursoId"                            element={<P><CursoView /></P>} />
      <Route path="/curso/:cursoId/aula/:aulaId"               element={<P><AulaPlayer /></P>} />
      <Route path="/curso/:cursoId/avaliacao/:avaliacaoId"     element={<P><AvaliacaoPage /></P>} />
      <Route path="/curso/:cursoId/avaliacao-final"            element={<P><AvaliacaoFinal /></P>} />
      <Route path="/certificado/:cursoId"                      element={<P><CertificadoPage /></P>} />
      <Route path="*"                                          element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
