import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import AlunoDetalhe from './pages/AlunoDetalhe';
import Cursos from './pages/Cursos';
import CursoDetalhe from './pages/CursoDetalhe';
import CursoNovo from './pages/CursoNovo';
import CursoEditar from './pages/CursoEditar';
import Configuracoes from './pages/Configuracoes';
import CursoPreview from './pages/CursoPreview';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/cursos/:id/preview" element={
            <ProtectedRoute>
              <CursoPreview />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="alunos" element={<Alunos />} />
            <Route path="alunos/:uid" element={<AlunoDetalhe />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="cursos/novo" element={<CursoNovo />} />
            <Route path="cursos/:id" element={<CursoDetalhe />} />
            <Route path="cursos/:id/editar" element={<CursoEditar />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
