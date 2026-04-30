import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { X, Search, ChevronDown } from 'lucide-react';

const ICONS = [
  ['palette', 'Palette'], ['cpu', 'Cpu'], ['wifi-off', 'WifiOff'], ['layout', 'Layout'],
  ['book', 'Book'], ['graduation-cap', 'GraduationCap'], ['code', 'Code'], ['database', 'Database'],
  ['globe', 'Globe'], ['zap', 'Zap'], ['pen-tool', 'PenTool'], ['image', 'Image'],
  ['video', 'Video'], ['music', 'Music'], ['camera', 'Camera'], ['mic', 'Mic'],
  ['headphones', 'Headphones'], ['monitor', 'Monitor'], ['smartphone', 'Smartphone'], ['tablet', 'Tablet'],
  ['mail', 'Mail'], ['message-circle', 'MessageCircle'], ['send', 'Send'], ['bell', 'Bell'],
  ['calendar', 'Calendar'], ['clock', 'Clock'], ['map-pin', 'MapPin'], ['compass', 'Compass'],
  ['navigation', 'Navigation'], ['flag', 'Flag'], ['heart', 'Heart'], ['star', 'Star'],
  ['award', 'Award'], ['target', 'Target'], ['trending-up', 'TrendingUp'], ['bar-chart', 'BarChart'],
  ['pie-chart', 'PieChart'], ['activity', 'Activity'], ['shield', 'Shield'], ['lock', 'Lock'],
  ['unlock', 'Unlock'], ['key', 'Key'], ['settings', 'Settings'], ['wrench', 'Wrench'],
  ['users', 'Users'], ['user-plus', 'UserPlus'], ['briefcase', 'Briefcase'], ['folder', 'Folder'],
  ['file-text', 'FileText'], ['layers', 'Layers'],
];

function getIcon(name) {
  return LucideIcons[name] || LucideIcons[name + 'Icon'] || null;
}

export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const SelectedIcon = value ? getIcon(ICONS.find(([k]) => k === value)?.[1] || '') : null;

  const filtered = ICONS.filter(([key]) =>
    !search || key.includes(search.toLowerCase())
  );

  const close = () => { setOpen(false); setSearch(''); };

  return (
    <>
      <button
        type="button"
        className="input icon-picker-btn"
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textAlign: 'left' }}
      >
        {SelectedIcon
          ? <SelectedIcon size={18} color="var(--neon)" />
          : <span style={{ width: 18, height: 18, display: 'inline-block' }} />
        }
        <span style={{ flex: 1, color: value ? 'var(--white)' : 'var(--gray-500)' }}>
          {value || 'Selecionar ícone...'}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--gray-500)', flexShrink: 0 }} />
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal modal-lg glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Escolher Ícone</h2>
              <button className="btn-icon" onClick={close}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--neon-border)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
              <Search size={15} color="var(--gray-500)" />
              <input
                autoFocus
                className="search-input"
                placeholder="Buscar ícone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="icon-grid">
              {filtered.map(([key, name]) => {
                const Icon = getIcon(name);
                if (!Icon) return null;
                const selected = value === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`icon-option ${selected ? 'selected' : ''}`}
                    onClick={() => { onChange(key); close(); }}
                    title={key}
                  >
                    <Icon size={22} />
                    <span className="icon-option-label">{key}</span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p style={{ gridColumn: '1/-1', color: 'var(--gray-500)', textAlign: 'center', padding: '2rem 0' }}>
                  Nenhum ícone encontrado.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
