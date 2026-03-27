import { forwardRef } from 'react';

// Estilos compartilhados
const styles = {
  button: {
    base: `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: var(--radius-md);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.95rem;
      transition: all var(--transition-fast);
      cursor: pointer;
      border: none;
      outline: none;
      white-space: nowrap;
    `,
    primary: `
      background: linear-gradient(135deg, var(--blue-600) 0%, var(--blue-700) 100%);
      color: white;
      box-shadow: var(--shadow-md), 0 2px 8px rgba(37, 99, 235, 0.3);
    `,
    secondary: `
      background: white;
      color: var(--blue-700);
      border: 2px solid var(--blue-200);
    `,
    ghost: `
      background: transparent;
      color: var(--blue-600);
    `,
    danger: `
      background: linear-gradient(135deg, var(--error) 0%, #dc2626 100%);
      color: white;
      box-shadow: var(--shadow-md);
    `,
    small: `
      padding: 8px 16px;
      font-size: 0.85rem;
    `,
    large: `
      padding: 16px 32px;
      font-size: 1.1rem;
    `,
    fullWidth: `
      width: 100%;
    `,
    disabled: `
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `
  },
  input: {
    wrapper: `
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    `,
    label: `
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    `,
    field: `
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 1rem;
      background: white;
      color: var(--text-primary);
      transition: all var(--transition-fast);
      outline: none;
    `,
    error: `
      border-color: var(--error);
    `,
    errorText: `
      font-size: 0.8rem;
      color: var(--error);
    `
  },
  card: {
    base: `
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
      transition: all var(--transition-fast);
    `,
    hover: `
      cursor: pointer;
    `,
    elevated: `
      box-shadow: var(--shadow-md);
    `
  },
  badge: {
    base: `
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `,
    success: `
      background: #dcfce7;
      color: #166534;
    `,
    error: `
      background: #fee2e2;
      color: #991b1b;
    `,
    warning: `
      background: #fef3c7;
      color: #92400e;
    `,
    info: `
      background: var(--blue-100);
      color: var(--blue-800);
    `
  }
};

// Converter objeto de estilo para string CSS
const toStyleString = (...styleStrings) => {
  return styleStrings
    .filter(Boolean)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .split(';')
    .filter(Boolean)
    .map(s => s.trim())
    .reduce((acc, style) => {
      const [prop, value] = style.split(':').map(s => s.trim());
      if (prop && value) {
        // Converter kebab-case para camelCase
        const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[camelProp] = value;
      }
      return acc;
    }, {});
};

// Button Component
export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style: customStyle,
  ...props 
}, ref) => {
  const buttonStyle = toStyleString(
    styles.button.base,
    styles.button[variant],
    size === 'small' && styles.button.small,
    size === 'large' && styles.button.large,
    fullWidth && styles.button.fullWidth,
    disabled && styles.button.disabled
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...buttonStyle, ...customStyle }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variant === 'primary' 
          ? 'var(--shadow-md), 0 2px 8px rgba(37, 99, 235, 0.3)'
          : 'var(--shadow-md)';
      }}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// Input Component
export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  style: customStyle,
  ...props
}, ref) => {
  const wrapperStyle = toStyleString(styles.input.wrapper);
  const labelStyle = toStyleString(styles.input.label);
  const fieldStyle = toStyleString(
    styles.input.field,
    error && styles.input.error
  );
  const errorStyle = toStyleString(styles.input.errorText);

  return (
    <div style={wrapperStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...fieldStyle, ...customStyle }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--blue-400)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

// Card Component
export const Card = forwardRef(({
  children,
  hover = false,
  elevated = false,
  onClick,
  style: customStyle,
  ...props
}, ref) => {
  const cardStyle = toStyleString(
    styles.card.base,
    hover && styles.card.hover,
    elevated && styles.card.elevated
  );

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ ...cardStyle, ...customStyle }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'var(--blue-200)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Badge Component
export function Badge({ children, variant = 'info', style: customStyle }) {
  const badgeStyle = toStyleString(
    styles.badge.base,
    styles.badge[variant]
  );

  return (
    <span style={{ ...badgeStyle, ...customStyle }}>
      {children}
    </span>
  );
}

// Progress Bar Component
export function ProgressBar({ value, max = 100, showLabel = true, size = 'medium' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const containerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const trackStyle = {
    flex: 1,
    height: size === 'small' ? '6px' : size === 'large' ? '12px' : '8px',
    backgroundColor: 'var(--blue-100)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden'
  };

  const barStyle = {
    width: `${percentage}%`,
    height: '100%',
    background: percentage === 100 
      ? 'linear-gradient(90deg, var(--success) 0%, #059669 100%)'
      : 'linear-gradient(90deg, var(--blue-400) 0%, var(--blue-600) 100%)',
    borderRadius: 'var(--radius-full)',
    transition: 'width var(--transition-slow)'
  };

  const labelStyle = {
    minWidth: '45px',
    fontSize: size === 'small' ? '0.75rem' : '0.875rem',
    fontWeight: '600',
    color: percentage === 100 ? 'var(--success)' : 'var(--blue-600)',
    textAlign: 'right'
  };

  return (
    <div style={containerStyle}>
      <div style={trackStyle}>
        <div style={barStyle} />
      </div>
      {showLabel && <span style={labelStyle}>{Math.round(percentage)}%</span>}
    </div>
  );
}

// Avatar Component
export function Avatar({ name, size = 'medium', src }) {
  const sizeMap = { small: 32, medium: 40, large: 56 };
  const fontSize = { small: '0.75rem', medium: '0.875rem', large: '1.25rem' };
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const style = {
    width: `${sizeMap[size]}px`,
    height: `${sizeMap[size]}px`,
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: fontSize[size],
    flexShrink: 0,
    overflow: 'hidden'
  };

  if (src) {
    return (
      <div style={style}>
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return <div style={style}>{initials}</div>;
}

// Empty State Component
export function EmptyState({ icon: Icon, title, description, action }) {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-2xl)',
    textAlign: 'center',
    gap: 'var(--space-md)'
  };

  const iconStyle = {
    width: '64px',
    height: '64px',
    color: 'var(--blue-300)',
    marginBottom: 'var(--space-sm)'
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  const descStyle = {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    maxWidth: '280px'
  };

  return (
    <div style={style}>
      {Icon && <Icon style={iconStyle} />}
      <h3 style={titleStyle}>{title}</h3>
      {description && <p style={descStyle}>{description}</p>}
      {action}
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 0,
    animation: 'fadeIn 200ms ease'
  };

  const contentStyle = {
    background: 'white',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideUp 300ms ease'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-lg)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1
  };

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  const closeStyle = {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--blue-50)',
    color: 'var(--blue-600)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  };

  const bodyStyle = {
    padding: 'var(--space-lg)'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <button style={closeStyle} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Tabs Component
export function Tabs({ tabs, activeTab, onChange }) {
  const containerStyle = {
    display: 'flex',
    background: 'var(--blue-50)',
    borderRadius: 'var(--radius-lg)',
    padding: '4px',
    gap: '4px'
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    background: isActive ? 'white' : 'transparent',
    color: isActive ? 'var(--blue-700)' : 'var(--text-secondary)',
    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
  });

  return (
    <div style={containerStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={tabStyle(activeTab === tab.id)}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
