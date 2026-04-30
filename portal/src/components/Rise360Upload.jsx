import { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Rise360Upload — Componente de upload de conteúdo Rise 360
 *
 * Estratégia: O conteúdo Rise 360 depende de caminhos relativos (lib/, assets/, etc.).
 * Firebase Storage não suporta caminhos relativos (cada arquivo tem URL independente).
 * Por isso, os arquivos são enviados diretamente para o repositório getfacil no GitHub,
 * na pasta public/Cursos/, onde são servidos como arquivos estáticos pelo GitHub Pages
 * preservando a estrutura de pastas e caminhos relativos.
 *
 * O componente gera a URL final do GitHub Pages que é salva no Firestore como arquivoUrl.
 */

const GITHUB_OWNER = 'casadedanielmarcos-hue';
const GITHUB_REPO = 'getfacil';
const GITHUB_BRANCH = 'main';
const GITHUB_PAGES_BASE = `https://${GITHUB_OWNER}.github.io/getfacil`;

function getGitHubToken() {
  return localStorage.getItem('github_token') || '';
}

export default function Rise360Upload({ cursoSlug, aulaSlug, aulaUrl, onUpload }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => { setDone(!!aulaUrl); }, [aulaUrl]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Selecione um arquivo .zip exportado do Rise 360.');
      return;
    }
    if (!cursoSlug || !aulaSlug) {
      setError('Defina o título do curso e da aula antes de enviar.');
      return;
    }

    const token = getGitHubToken();
    if (!token) {
      setError('Token do GitHub não configurado. Vá em Configurações para definir.');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);
    setDone(false);
    setStatusMsg('Extraindo ZIP...');

    try {
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(file);

      const entries = [];
      zip.forEach((path, entry) => { if (!entry.dir) entries.push({ path, entry }); });

      if (entries.length === 0) throw new Error('ZIP vazio ou inválido.');

      // Detectar pasta raiz comum (ex: "content/index.html" → strip "content/")
      const roots = [...new Set(entries.map(e => e.path.split('/')[0]))];
      const hasRoot = roots.length === 1 && entries.some(e => e.path.includes('/'));
      const prefix = hasRoot ? roots[0] + '/' : '';

      setFileCount(entries.length);

      // Caminho destino no repo: public/Cursos/{cursoSlug}/{aulaSlug}/
      const repoBasePath = `public/Cursos/${cursoSlug}/${aulaSlug}`;

      // ── Passo 1: Obter o SHA do último commit da branch ──
      setStatusMsg('Conectando ao GitHub...');
      const refRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`,
        { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
      );
      if (!refRes.ok) throw new Error(`Erro ao acessar repositório: ${refRes.status} — verifique o token.`);
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      // ── Passo 2: Obter a tree do último commit ──
      const commitRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
        { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
      );
      const commitData = await commitRes.json();
      const baseTreeSha = commitData.tree.sha;

      // ── Passo 3: Criar blobs para cada arquivo ──
      setStatusMsg('Enviando arquivos...');
      const treeItems = [];

      for (let i = 0; i < entries.length; i++) {
        const { path, entry } = entries[i];
        const finalPath = prefix ? path.slice(prefix.length) : path;
        if (!finalPath) continue;

        const arrayBuffer = await entry.async('arraybuffer');
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const blobRes = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
          {
            method: 'POST',
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: base64, encoding: 'base64' }),
          }
        );

        if (!blobRes.ok) {
          const errText = await blobRes.text();
          throw new Error(`Erro ao criar blob para ${finalPath}: ${blobRes.status}`);
        }

        const blobData = await blobRes.json();
        treeItems.push({
          path: `${repoBasePath}/${finalPath}`,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        });

        setProgress(Math.round(((i + 1) / entries.length) * 85));
        if ((i + 1) % 10 === 0) {
          setStatusMsg(`Enviando arquivos... ${i + 1}/${entries.length}`);
        }
      }

      // ── Passo 4: Criar nova tree ──
      setStatusMsg('Criando estrutura de pastas...');
      setProgress(88);
      const treeRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
        }
      );
      if (!treeRes.ok) throw new Error('Erro ao criar tree no GitHub.');
      const treeData = await treeRes.json();

      // ── Passo 5: Criar commit ──
      setStatusMsg('Criando commit...');
      setProgress(93);
      const newCommitRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `📚 Upload Rise 360: ${cursoSlug}/${aulaSlug}`,
            tree: treeData.sha,
            parents: [latestCommitSha],
          }),
        }
      );
      if (!newCommitRes.ok) throw new Error('Erro ao criar commit no GitHub.');
      const newCommitData = await newCommitRes.json();

      // ── Passo 6: Atualizar a referência da branch ──
      setStatusMsg('Finalizando deploy...');
      setProgress(97);
      const updateRefRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sha: newCommitData.sha }),
        }
      );
      if (!updateRefRes.ok) throw new Error('Erro ao atualizar branch no GitHub.');

      // ── Passo 7: Gerar URL final do GitHub Pages ──
      const pagesUrl = `${GITHUB_PAGES_BASE}/Cursos/${cursoSlug}/${aulaSlug}/index.html`;

      setProgress(100);
      setStatusMsg('Concluído!');
      onUpload(pagesUrl);
      setDone(true);
    } catch (err) {
      console.error('Rise360Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const clear = () => { onUpload(''); setDone(false); setProgress(0); setStatusMsg(''); };

  return (
    <div className="rise-upload">
      {/* Status */}
      <div className="rise-status">
        {done ? (
          <>
            <CheckCircle size={14} color="var(--success)" />
            <span style={{ color: 'var(--success)', fontSize: '0.78rem' }}>Conteúdo enviado</span>
            <button type="button" className="btn-icon" onClick={clear} title="Remover e reenviar">
              <X size={13} />
            </button>
          </>
        ) : uploading ? (
          <span style={{ color: 'var(--neon)', fontSize: '0.78rem' }}>
            {statusMsg || `Enviando... ${progress}%`} ({fileCount} arquivos)
          </span>
        ) : (
          <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>Sem conteúdo</span>
        )}
      </div>

      {/* Barra de progresso */}
      {uploading && (
        <div className="progress-bar-wrap" style={{ width: '100%', margin: '0.2rem 0' }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Botão upload */}
      {!done && (
        <label className={`btn btn-ghost btn-sm rise-btn ${(!cursoSlug || !aulaSlug) ? 'disabled' : ''}`}
          title={!cursoSlug ? 'Defina o título do curso primeiro' : !aulaSlug ? 'Defina o título da aula primeiro' : 'Enviar exportação Rise 360 (.zip)'}>
          <Upload size={13} />
          {uploading ? 'Enviando...' : 'Rise 360 (.zip)'}
          <input
            type="file"
            accept=".zip"
            onChange={handleFile}
            disabled={uploading || !cursoSlug || !aulaSlug}
            style={{ display: 'none' }}
          />
        </label>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
          <AlertCircle size={12} color="var(--danger)" />
          <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }} title={error}>
            {error.length > 60 ? error.slice(0, 60) + '...' : error}
          </span>
        </div>
      )}
    </div>
  );
}
