import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { seedCursos } from '../utils/seedCursos';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Shield, RefreshCw, Database, Github, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Configuracoes() {
  const { gestor } = useAuth();
  const [seedLog, setSeedLog] = useState([]);
  const [seedRunning, setSeedRunning] = useState(false);

  // GitHub token state
  const [ghToken, setGhToken] = useState(localStorage.getItem('github_token') || '');
  const [showToken, setShowToken] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(!!localStorage.getItem('github_token'));
  const [tokenTesting, setTokenTesting] = useState(false);
  const [tokenStatus, setTokenStatus] = useState('');

  const runSeedCursos = async () => {
    setSeedRunning(true);
    setSeedLog([]);
    const log = (msg) => setSeedLog(prev => [...prev, msg]);
    try {
      log('Verificando coleção de cursos...');
      const snap = await getDocs(collection(db, 'cursos'));
      if (!snap.empty) {
        log(`✅ Coleção já possui ${snap.size} cursos. Seed ignorado.`);
      } else {
        log('Coleção vazia. Populando...');
        await seedCursos(log);
        log('✅ Seed de cursos concluído!');
      }
    } catch (err) {
      log('❌ Erro: ' + err.message);
    } finally {
      setSeedRunning(false);
    }
  };

  const saveGhToken = () => {
    if (ghToken.trim()) {
      localStorage.setItem('github_token', ghToken.trim());
      setTokenSaved(true);
      setTokenStatus('');
    }
  };

  const removeGhToken = () => {
    localStorage.removeItem('github_token');
    setGhToken('');
    setTokenSaved(false);
    setTokenStatus('');
  };

  const testGhToken = async () => {
    if (!ghToken.trim()) { setTokenStatus('❌ Token vazio.'); return; }
    setTokenTesting(true);
    setTokenStatus('');
    try {
      const res = await fetch('https://api.github.com/repos/casadedanielmarcos-hue/getfacil', {
        headers: { Authorization: `token ${ghToken.trim()}`, Accept: 'application/vnd.github.v3+json' },
      });
      if (res.ok) {
        const data = await res.json();
        setTokenStatus(`✅ Conectado! Repositório: ${data.full_name} (${data.visibility})`);
      } else {
        setTokenStatus(`❌ Falha: ${res.status} — verifique se o token tem permissão "repo".`);
      }
    } catch (err) {
      setTokenStatus(`❌ Erro de conexão: ${err.message}`);
    } finally {
      setTokenTesting(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Configurações</h1>

      {/* Perfil do gestor */}
      <div className="glass panel config-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Shield size={18} color="var(--neon)" />
          <h2 className="config-section-title" style={{ margin: 0 }}>Meu Perfil</h2>
        </div>
        <div className="info-row">
          <span className="info-label">Nome</span>
          <span className="info-value">{gestor?.nome || '—'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email</span>
          <span className="info-value">{gestor?.email || '—'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Perfil</span>
          <span className="info-value">
            <span className="badge badge-ativo">{gestor?.role || 'gestor'}</span>
          </span>
        </div>
        <div className="info-row" style={{ borderBottom: 'none' }}>
          <span className="info-label">UID</span>
          <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--gray-500)' }}>
            {gestor?.uid}
          </span>
        </div>
      </div>

      {/* Integração GitHub */}
      <div className="glass panel config-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Github size={18} color="var(--neon)" />
          <h2 className="config-section-title" style={{ margin: 0 }}>Integração GitHub</h2>
        </div>

        <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--neon)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            O upload de conteúdo Rise 360 envia os arquivos diretamente para o repositório <strong>getfacil</strong> no GitHub.
            Para isso funcionar, é necessário um <strong>Personal Access Token</strong> com permissão <code>repo</code>.
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
            Gere em: <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--neon)' }}>github.com/settings/tokens/new</a> — marque apenas <strong>repo</strong>.
          </p>
        </div>

        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Personal Access Token</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                className="input"
                type={showToken ? 'text' : 'password'}
                value={ghToken}
                onChange={e => { setGhToken(e.target.value); setTokenSaved(false); }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer',
                }}
              >
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={saveGhToken} disabled={!ghToken.trim() || tokenSaved}>
              {tokenSaved ? <><CheckCircle size={13} /> Salvo</> : 'Salvar'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={testGhToken} disabled={tokenTesting || !ghToken.trim()}>
              {tokenTesting ? 'Testando...' : 'Testar'}
            </button>
            {tokenSaved && (
              <button className="btn btn-ghost btn-sm" onClick={removeGhToken} style={{ color: 'var(--danger)' }}>
                Remover
              </button>
            )}
          </div>
        </div>

        {tokenStatus && (
          <div style={{
            background: tokenStatus.startsWith('✅') ? 'rgba(0,255,128,0.07)' : 'rgba(255,68,85,0.07)',
            border: `1px solid ${tokenStatus.startsWith('✅') ? 'rgba(0,255,128,0.2)' : 'rgba(255,68,85,0.2)'}`,
            borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.82rem',
            color: tokenStatus.startsWith('✅') ? '#00ff80' : '#ff4455',
            fontFamily: 'monospace',
          }}>
            {tokenStatus}
          </div>
        )}
      </div>

      {/* Ferramentas de admin */}
      {gestor?.role === 'admin' && (
        <div className="glass panel config-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Database size={18} color="var(--neon)" />
            <h2 className="config-section-title" style={{ margin: 0 }}>Ferramentas de Administração</h2>
          </div>

          <div style={{ background: 'rgba(255,170,0,0.07)', border: '1px solid rgba(255,170,0,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--warning)', fontSize: '0.82rem' }}>
              ⚠ Use estas ferramentas com cuidado. Elas modificam diretamente o banco de dados.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Seed de Cursos</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>
                  Popula a coleção "cursos" com os 4 cursos padrão se ela estiver vazia.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={runSeedCursos} disabled={seedRunning}>
                <RefreshCw size={14} /> {seedRunning ? 'Executando...' : 'Executar Seed'}
              </button>
            </div>

            {seedLog.length > 0 && (
              <div style={{ background: '#000', borderRadius: 8, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', maxHeight: 180, overflowY: 'auto' }}>
                {seedLog.map((l, i) => (
                  <div key={i} style={{ color: l.startsWith('❌') ? '#ff4455' : l.startsWith('✅') ? '#00ff80' : '#888' }}>{l}</div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <p style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Seed de Gestores</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                Para criar os gestores iniciais (Daniel e Well), acesse{' '}
                <strong style={{ color: 'var(--neon)' }}>#/setup</strong>{' '}
                ou adicione manualmente no Firebase Authentication + coleção "gestores".
              </p>
              <a href="#/setup" className="btn btn-ghost btn-sm">
                Ir para página de Setup
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sobre */}
      <div className="glass panel">
        <h2 className="config-section-title">Sobre</h2>
        <div className="info-row">
          <span className="info-label">Plataforma</span>
          <span className="info-value">GetFutureToday</span>
        </div>
        <div className="info-row">
          <span className="info-label">Versão</span>
          <span className="info-value">1.1.0</span>
        </div>
        <div className="info-row" style={{ borderBottom: 'none' }}>
          <span className="info-label">Firebase</span>
          <span className="info-value">getfuturetoday</span>
        </div>
      </div>
    </div>
  );
}
