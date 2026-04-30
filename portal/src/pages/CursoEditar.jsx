import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import IconPicker from '../components/IconPicker';
import Rise360Upload from '../components/Rise360Upload';
import { getSlug } from '../utils/slug';

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function CursoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    titulo: '', subtitulo: '', cor: '#0088ff', icone: 'book', imagemCapa: '', publicado: false,
  });
  const [modulos, setModulos] = useState([]);

  // ── Drag state ──
  const [dragModIdx, setDragModIdx] = useState(null);
  const [dragOverModIdx, setDragOverModIdx] = useState(null);
  const [dragAula, setDragAula] = useState(null);
  const [dragOverAula, setDragOverAula] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'cursos', id)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          titulo: d.titulo || '', subtitulo: d.subtitulo || '',
          cor: d.cor || '#0088ff', icone: d.icone || 'book',
          imagemCapa: d.imagemCapa || '', publicado: d.publicado || false,
        });
        setModulos((d.modulos || []).map(m => ({
          ...m,
          id: m.id || uid(),
          open: false,
          aulas: (m.aulas || []).map(a => ({ ...a, id: a.id || uid() })),
        })));
      }
      setLoading(false);
    });
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Módulos CRUD ──
  const addModulo = () =>
    setModulos(m => [...m, { id: uid(), titulo: 'Novo Módulo', aulas: [], open: true }]);

  const removeModulo = (mid) => {
    if (!confirm('Remover este módulo e todas as suas aulas?')) return;
    setModulos(m => m.filter(x => x.id !== mid));
  };

  const updateModulo = (mid, k, v) =>
    setModulos(m => m.map(x => x.id === mid ? { ...x, [k]: v } : x));

  const toggleModulo = (mid) =>
    setModulos(m => m.map(x => x.id === mid ? { ...x, open: !x.open } : x));

  // ── Aulas CRUD ──
  const addAula = (mid) =>
    setModulos(m => m.map(x => x.id === mid
      ? { ...x, aulas: [...x.aulas, { id: uid(), titulo: 'Nova Aula', tipo: 'rise360', arquivoUrl: '' }] }
      : x));

  const removeAula = (mid, aid) =>
    setModulos(m => m.map(x => x.id === mid
      ? { ...x, aulas: x.aulas.filter(a => a.id !== aid) }
      : x));

  const updateAula = (mid, aid, k, v) =>
    setModulos(m => m.map(x => x.id === mid
      ? { ...x, aulas: x.aulas.map(a => a.id === aid ? { ...a, [k]: v } : a) }
      : x));

  // ── Drag & Drop — Módulos ──
  const onModDragStart = (e, idx) => {
    setDragModIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onModDragOver = (e, idx) => {
    e.preventDefault();
    if (idx !== dragModIdx) setDragOverModIdx(idx);
  };
  const onModDrop = (e, idx) => {
    e.preventDefault();
    if (dragModIdx === null || dragModIdx === idx) return;
    setModulos(prev => {
      const arr = [...prev];
      const [item] = arr.splice(dragModIdx, 1);
      arr.splice(idx, 0, item);
      return arr;
    });
    setDragModIdx(null); setDragOverModIdx(null);
  };
  const onModDragEnd = () => { setDragModIdx(null); setDragOverModIdx(null); };

  // ── Drag & Drop — Aulas ──
  const onAulaDragStart = (e, modIdx, aulaIdx) => {
    e.stopPropagation();
    setDragAula({ modIdx, aulaIdx });
    e.dataTransfer.effectAllowed = 'move';
  };
  const onAulaDragOver = (e, modIdx, aulaIdx) => {
    e.preventDefault(); e.stopPropagation();
    if (dragAula?.modIdx === modIdx) setDragOverAula({ modIdx, aulaIdx });
  };
  const onAulaDrop = (e, modIdx, aulaIdx) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragAula || dragAula.modIdx !== modIdx || dragAula.aulaIdx === aulaIdx) return;
    setModulos(prev => prev.map((m, mi) => {
      if (mi !== modIdx) return m;
      const aulas = [...m.aulas];
      const [item] = aulas.splice(dragAula.aulaIdx, 1);
      aulas.splice(aulaIdx, 0, item);
      return { ...m, aulas };
    }));
    setDragAula(null); setDragOverAula(null);
  };
  const onAulaDragEnd = () => { setDragAula(null); setDragOverAula(null); };

  // ── Upload capa ──
  const handleCapa = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const r = ref(storage, `capas/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      set('imagemCapa', await getDownloadURL(r));
    } catch (err) {
      setError('Erro no upload da capa: ' + err.message);
    } finally {
      setUploadingImg(false);
    }
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) { setError('Título obrigatório.'); return; }
    setSaving(true); setError('');
    try {
      await updateDoc(doc(db, 'cursos', id), {
        ...form,
        modulos: modulos.map(({ open, ...m }) => ({
          ...m,
          aulas: m.aulas.map(a => ({
            ...a,
            slug: a.slug || getSlug(a.titulo),
            tipo: a.tipo || 'rise360',
          })),
        })),
      });
      navigate(`/cursos/${id}`);
    } catch (err) {
      setError('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  // O slug do curso é o próprio ID do documento no Firestore
  const cursoSlug = id;

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate(`/cursos/${id}`)}>
        <ArrowLeft size={16} /> Voltar
      </button>
      <h1 className="page-title">Editar Curso</h1>

      <form onSubmit={handleSubmit}>
        {/* ── Informações gerais ── */}
        <div className="glass panel" style={{ marginBottom: '1.25rem' }}>
          <h2 className="panel-title">Informações Gerais</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Título *</label>
              <input className="input" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Subtítulo</label>
              <input className="input" value={form.subtitulo} onChange={e => set('subtitulo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cor principal</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="color" className="input" style={{ width: 56, flexShrink: 0, padding: '0.25rem' }}
                  value={form.cor} onChange={e => set('cor', e.target.value)} />
                <input className="input" value={form.cor} onChange={e => set('cor', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Ícone</label>
              <IconPicker value={form.icone} onChange={v => set('icone', v)} />
            </div>
            <div className="form-group">
              <label>Imagem de Capa <span style={{ color: 'var(--gray-500)' }}>(PNG/JPG — ideal 1080×1350px)</span></label>
              <input type="file" accept="image/*" className="input" onChange={handleCapa} />
              {uploadingImg && <p style={{ color: 'var(--neon)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Fazendo upload...</p>}
              {form.imagemCapa && <img src={form.imagemCapa} alt="Capa" style={{ marginTop: '0.5rem', height: 80, borderRadius: 8, objectFit: 'cover' }} />}
            </div>
            <div className="form-group">
              <label>Publicação</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                {[{ v: true, l: 'Publicado' }, { v: false, l: 'Despublicado' }].map(({ v, l }) => (
                  <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--gray-300)' }}>
                    <input type="radio" checked={form.publicado === v} onChange={() => set('publicado', v)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Módulos e Aulas ── */}
        <div className="glass panel" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="panel-title" style={{ margin: 0 }}>Módulos e Aulas</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addModulo}>
              <Plus size={14} /> Adicionar Módulo
            </button>
          </div>

          {modulos.length === 0 ? (
            <p className="empty-text" style={{ padding: '1.5rem 0' }}>Nenhum módulo. Clique em "Adicionar Módulo".</p>
          ) : (
            <div className="modules-list">
              {modulos.map((m, mi) => (
                <div
                  key={m.id}
                  draggable
                  onDragStart={e => onModDragStart(e, mi)}
                  onDragOver={e => onModDragOver(e, mi)}
                  onDrop={e => onModDrop(e, mi)}
                  onDragEnd={onModDragEnd}
                  className={`module-item ${dragModIdx === mi ? 'dragging' : ''} ${dragOverModIdx === mi ? 'drag-over' : ''}`}
                >
                  <div className="module-header">
                    <span className="grip-handle"><GripVertical size={16} /></span>
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem', minWidth: 18 }}>{mi + 1}.</span>
                    <input
                      className="module-title-input"
                      value={m.titulo}
                      onChange={e => updateModulo(m.id, 'titulo', e.target.value)}
                      placeholder="Título do módulo"
                    />
                    <button type="button" className="btn-icon" onClick={() => toggleModulo(m.id)}>
                      {m.open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button type="button" className="btn-icon btn-danger-ghost" onClick={() => removeModulo(m.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {m.open && (
                    <div className="aulas-list">
                      {m.aulas.map((a, ai) => {
                        const isAulaDragging = dragAula?.modIdx === mi && dragAula?.aulaIdx === ai;
                        const isAulaOver = dragOverAula?.modIdx === mi && dragOverAula?.aulaIdx === ai;
                        const aulaSlugVal = a.slug || getSlug(a.titulo);
                        return (
                          <div
                            key={a.id}
                            draggable
                            onDragStart={e => onAulaDragStart(e, mi, ai)}
                            onDragOver={e => onAulaDragOver(e, mi, ai)}
                            onDrop={e => onAulaDrop(e, mi, ai)}
                            onDragEnd={onAulaDragEnd}
                            className={`aula-item ${isAulaDragging ? 'dragging' : ''} ${isAulaOver ? 'drag-over' : ''}`}
                          >
                            <span className="grip-handle"><GripVertical size={14} /></span>
                            <span style={{ color: 'var(--gray-500)', fontSize: '0.72rem', minWidth: 16 }}>{ai + 1}.</span>
                            <input
                              className="aula-title-input"
                              value={a.titulo}
                              onChange={e => updateAula(m.id, a.id, 'titulo', e.target.value)}
                              placeholder="Título da aula"
                              style={{ flex: 2 }}
                            />
                            <Rise360Upload
                              cursoSlug={cursoSlug}
                              aulaSlug={aulaSlugVal}
                              aulaUrl={a.arquivoUrl || a.arquivoPath}
                              onUpload={url => updateAula(m.id, a.id, 'arquivoUrl', url)}
                            />
                            <button type="button" className="btn-icon btn-danger-ghost" onClick={() => removeAula(m.id, a.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                      <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.3rem' }} onClick={() => addAula(m.id)}>
                        <Plus size={13} /> Aula
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(`/cursos/${id}`)}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving || uploadingImg}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
