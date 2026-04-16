import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Home } from './pages/Home';
import { CursoView } from './pages/aluno/CursoView';
import { AulaPlayer } from './pages/aluno/AulaPlayer';
import { AvaliacaoPage } from './pages/aluno/AvaliacaoPage';
import { AvaliacaoFinal } from './pages/aluno/AvaliacaoFinal';
import { CertificadoPage } from './pages/aluno/CertificadoPage';

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
    </Routes>
  );
}

export default App;
