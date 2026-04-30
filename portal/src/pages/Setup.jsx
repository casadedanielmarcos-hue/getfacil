import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { seedGestores } from '../utils/seedGestores';
import { seedCursos } from '../utils/seedCursos';

export default function Setup() {
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const runSetup = async () => {
    setRunning(true);
    setLog([]);
    try {
      addLog('⏳ Criando gestores...');
      await seedGestores(addLog);
      addLog('⏳ Populando cursos...');
      await seedCursos(addLog);
      addLog('✅ Setup concluído!');
      setDone(true);
    } catch (err) {
      addLog('❌ Erro: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card glass">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/portal-gestor/logo-getfuturetoday.png" alt="GetFutureToday" style={{ height: 48, filter: 'drop-shadow(0 0 10px #00d4ff)' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
          Inicialização do Sistema
        </h1>
        <p style={{ color: 'var(--gray-300)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Este processo cria os gestores iniciais (Daniel e Well) e popula os 4 cursos no Firestore.
          Execute apenas uma vez.
        </p>

        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid var(--neon-border)', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--gray-300)', marginBottom: '0.4rem' }}>Gestores que serão criados:</p>
          <p style={{ fontSize: '0.82rem' }}>• daniel@getfuturetoday.com — senha: 123456 — admin</p>
          <p style={{ fontSize: '0.82rem' }}>• well@getfuturetoday.com — senha: 123456 — admin</p>
        </div>

        {log.length > 0 && (
          <div style={{ background: '#000', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {log.map((l, i) => <div key={i} style={{ color: l.startsWith('❌') ? '#ff4455' : l.startsWith('✅') ? '#00ff80' : '#aaa' }}>{l}</div>)}
          </div>
        )}

        {done ? (
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
            Ir para o Login
          </button>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={runSetup} disabled={running}>
            {running ? 'Executando...' : 'Executar Setup'}
          </button>
        )}

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
          <Link to="/login" style={{ color: 'var(--gray-500)' }}>← Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
