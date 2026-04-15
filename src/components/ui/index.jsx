import { forwardRef } from 'react';

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
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    fontSize: size === 'small' ? '0.85rem' : size === 'large' ? '1.05rem' : '0.95rem',
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '11px 22px',
    width: fullWidth ? '100%' : 'auto'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
      color: '#000000',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
    },
    secondary: {
      background: 'rgba(0, 212, 255, 0.08)',
      color: 'var(--neon-primary)',
      border: '1px solid rgba(0, 212, 255, 0.25)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--neon-primary)'
    },
    danger: {
      background: 'linear-gradient(135deg, #ff4466 0%, #cc0033 100%)',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(255, 68, 102, 0.3)'
    }
  };

  const style = { ...base, ...variants[variant], ...customStyle };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
          }
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variant === 'primary'
          ? '0 0 20px rgba(0, 212, 255, 0.3)'
          : 'none';
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          outline: 'none',
          ...customStyle
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--neon-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 212, 255, 0.15)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.8rem', color: 'var(--error)' }}>{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

// Card Component (glass morphism)
export const Card = forwardRef(({
  children,
  hover = false,
  elevated = false,
  onClick,
  style: customStyle,
  ...props
}, ref) => {
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    border: '1px solid rgba(0, 212, 255, 0.12)',
    transition: 'all 0.25s ease',
    cursor: hover ? 'pointer' : 'default',
    ...customStyle
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={e => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.35)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.15)';
        }
      }}
      onMouseLeave={e => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.12)';
          e.currentTarget.style.boxShadow = 'none';
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
  const variants = {
    success: { background: 'rgba(0, 255, 136, 0.12)', color: '#00ff88', border: '1px solid rgba(0, 255, 136, 0.3)' },
    error: { background: 'rgba(255, 68, 102, 0.12)', color: '#ff4466', border: '1px solid rgba(255, 68, 102, 0.3)' },
    warning: { background: 'rgba(255, 170, 0, 0.12)', color: '#ffaa00', border: '1px solid rgba(255, 170, 0, 0.3)' },
    info: { background: 'rgba(0, 212, 255, 0.12)', color: 'var(--neon-primary)', border: '1px solid rgba(0, 212, 255, 0.3)' }
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.3px',
      ...variants[variant],
      ...customStyle
    }}>
      {children}
    </span>
  );
}

// Progress Bar Component
export function ProgressBar({ value, max = 100, showLabel = true, size = 'medium' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = size === 'small' ? '4px' : size === 'large' ? '10px' : '6px';

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        flex: 1,
        height,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: percentage === 100
            ? 'linear-gradient(90deg, #00ff88 0%, #00d4aa 100%)'
            : 'linear-gradient(90deg, #0066ff 0%, #00d4ff 100%)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.5s ease',
          boxShadow: percentage > 0 ? '0 0 8px rgba(0, 212, 255, 0.5)' : 'none'
        }} />
      </div>
      {showLabel && (
        <span style={{
          minWidth: '40px',
          fontSize: size === 'small' ? '0.7rem' : '0.8rem',
          fontWeight: '600',
          color: percentage === 100 ? '#00ff88' : 'var(--neon-primary)',
          textAlign: 'right'
        }}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// Avatar Component
export function Avatar({ name, size = 'medium' }) {
  const sizes = { small: 32, medium: 40, large: 56 };
  const fontSize = { small: '0.75rem', medium: '0.875rem', large: '1.1rem' };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div style={{
      width: `${sizes[size]}px`,
      height: `${sizes[size]}px`,
      borderRadius: 'var(--radius-full)',
      background: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
      color: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: '700',
      fontSize: fontSize[size],
      flexShrink: 0,
      boxShadow: '0 0 12px rgba(0, 212, 255, 0.3)'
    }}>
      {initials}
    </div>
  );
}

// Empty State Component
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-2xl)',
      textAlign: 'center',
      gap: 'var(--space-md)'
    }}>
      {Icon && <Icon size={48} color="rgba(0, 212, 255, 0.4)" />}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)'
      }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 200ms ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0a0a0f',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 300ms ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-lg)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
          position: 'sticky',
          top: 0,
          background: '#0a0a0f',
          zIndex: 1
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            {title}
          </h2>
          <button
            style={{
              width: '32px', height: '32px',
              borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              border: 'none', cursor: 'pointer'
            }}
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ padding: 'var(--space-lg)' }}>{children}</div>
      </div>
    </div>
  );
}

// Tabs Component
export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 'var(--radius-lg)',
      padding: '4px',
      gap: '4px',
      border: '1px solid rgba(0, 212, 255, 0.1)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isActive ? 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)' : 'transparent',
              color: isActive ? '#000000' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 12px rgba(0, 212, 255, 0.3)' : 'none'
            }}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
