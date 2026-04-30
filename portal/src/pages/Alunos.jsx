import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, secondaryAuth } from '../firebase';
import { collection, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Search, UserPlus, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [importData, setImportData] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const snap = await getDocs(collection(db, 'alunos'));
    setAlunos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = alunos.filter(a => {
    const q = busca.toLowerCase();
    const matchBusca = !busca || a.nome?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
    const matchFiltro = filtro === 'todos' || a.status === filtro;
    return matchBusca && matchFiltro;
  });

  const criarAluno = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.senha);
      await setDoc(doc(db, 'alunos', cred.user.uid), {
        uid: cred.user.uid,
        nome: form.nome,
        email: form.email,
        status: 'ativo',
        cursosMatriculados: [],
        dataCriacao: serverTimestamp(),
      });
      setShowModal(false);
      setForm({ nome: '', email: '', senha: '' });
      load();
    } catch (err) {
      setFormError(err.code === 'auth/email-already-in-use' ? 'Este email já está em uso.' : 'Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setImportData(data);
    };
    reader.readAsBinaryString(file);
  };

  const confirmarImport = async () => {
    setSaving(true);
    let criados = 0, erros = 0;
    for (const row of importData) {
      try {
        const cred = await createUserWithEmailAndPassword(secondaryAuth, String(row.email), String(row.senha));
        await setDoc(doc(db, 'alunos', cred.user.uid), {
          uid: cred.user.uid,
          nome: String(row.nome || ''),
          email: String(row.email),
          status: 'ativo',
          cursosMatriculados: [],
          dataCriacao: serverTimestamp(),
        });
        criados++;
      } catch {
        erros++;
      }
    }
    setImportResult({ criados, erros });
    setSaving(false);
    load();
  };

  const closeImport = () => { setShowImport(false); setImportData(null); setImportResult(null); };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Alunos</h1>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => setShowImport(true)}>
            <Upload size={15} /> Importar
          </button>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(''); }}>
            <UserPlus size={15} /> Novo Aluno
          </button>
        </div>
      </div>

      <div className="filters glass">
        <div className="search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          {['todos', 'ativo', 'bloqueado'].map(f => (
            <button key={f} className={`filter-tab ${filtro === f ? 'active' : ''}`} onClick={() => setFiltro(f)}>
              {f === 'todos' ? 'Todos' : f === 'ativo' ? 'Ativos' : 'Bloqueados'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
              <th>Cursos</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5}><p className="empty-text">Nenhum aluno encontrado.</p></td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.nome}</td>
                <td style={{ color: 'var(--gray-300)' }}>{a.email}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td style={{ color: 'var(--gray-300)' }}>{(a.cursosMatriculados || []).length}</td>
                <td>
                  <button className="btn-link" onClick={() => navigate(`/alunos/${a.id}`)}>
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal novo aluno */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal glass">
            <div className="modal-header">
              <h2>Novo Aluno</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={criarAluno}>
              <div className="form-group">
                <label>Nome completo</label>
                <input className="input" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Senha (mín. 6 caracteres)</label>
                <input type="password" className="input" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} required minLength={6} />
              </div>
              {formError && <div className="error-msg">{formError}</div>}
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Criando...' : 'Criar Aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal importação */}
      {showImport && (
        <div className="modal-overlay">
          <div className="modal modal-lg glass">
            <div className="modal-header">
              <h2>Importar Alunos em Lote</h2>
              <button className="btn-icon" onClick={closeImport}><X size={20} /></button>
            </div>

            {!importResult ? (
              <>
                <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Colunas esperadas: <strong>nome</strong>, <strong>email</strong>, <strong>senha</strong>
                </p>
                <input type="file" accept=".xlsx,.csv" onChange={handleFile} className="input" />

                {importData && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--gray-300)', fontSize: '0.875rem' }}>
                      {importData.length} linha(s) encontrada(s) — pré-visualização:
                    </p>
                    <div className="table-wrap" style={{ maxHeight: 220, overflowY: 'auto' }}>
                      <table className="table">
                        <thead><tr><th>#</th><th>Nome</th><th>Email</th></tr></thead>
                        <tbody>
                          {importData.slice(0, 20).map((r, i) => (
                            <tr key={i}><td>{i + 1}</td><td>{r.nome}</td><td>{r.email}</td></tr>
                          ))}
                          {importData.length > 20 && (
                            <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray-500)' }}>...e mais {importData.length - 20}</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-ghost" onClick={() => setImportData(null)}>Limpar</button>
                      <button className="btn btn-primary" onClick={confirmarImport} disabled={saving}>
                        {saving ? 'Importando...' : `Confirmar ${importData.length} alunos`}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: 'var(--success)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  ✓ {importResult.criados} alunos criados com sucesso
                </p>
                {importResult.erros > 0 && (
                  <p style={{ color: 'var(--danger)' }}>✗ {importResult.erros} erro(s) — emails já existentes ou inválidos</p>
                )}
                <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={closeImport}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
