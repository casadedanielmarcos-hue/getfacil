import { forwardRef } from 'react';

<<<<<<< HEAD
// Button Component
export const Button = forwardRef(({
  children,
  variant = 'primary',
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style: customStyle,
<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      }}
      {...props}
    >
      {children}
    </button>
  );
});
<<<<<<< HEAD
=======

>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
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
<<<<<<< HEAD
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
<<<<<<< HEAD
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
=======
        style={{ ...fieldStyle, ...customStyle }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--blue-400)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
<<<<<<< HEAD
      {error && <span style={{ fontSize: '0.8rem', color: 'var(--error)' }}>{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

// Card Component (glass morphism)
=======
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

// Card Component
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
export const Card = forwardRef(({
  children,
  hover = false,
  elevated = false,
  onClick,
  style: customStyle,
  ...props
}, ref) => {
<<<<<<< HEAD
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
=======
  const cardStyle = toStyleString(
    styles.card.base,
    hover && styles.card.hover,
    elevated && styles.card.elevated
  );
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c

  return (
    <div
      ref={ref}
      onClick={onClick}
<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
});
<<<<<<< HEAD
=======

>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
Card.displayName = 'Card';

// Badge Component
export function Badge({ children, variant = 'info', style: customStyle }) {
<<<<<<< HEAD
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
=======
  const badgeStyle = toStyleString(
    styles.badge.base,
    styles.badge[variant]
  );

  return (
    <span style={{ ...badgeStyle, ...customStyle }}>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      {children}
    </span>
  );
}

// Progress Bar Component
export function ProgressBar({ value, max = 100, showLabel = true, size = 'medium' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
<<<<<<< HEAD
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
=======
  
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    </div>
  );
}

// Avatar Component
<<<<<<< HEAD
export function Avatar({ name, size = 'medium' }) {
  const sizes = { small: 32, medium: 40, large: 56 };
  const fontSize = { small: '0.75rem', medium: '0.875rem', large: '1.1rem' };

=======
export function Avatar({ name, size = 'medium', src }) {
  const sizeMap = { small: 32, medium: 40, large: 56 };
  const fontSize = { small: '0.75rem', medium: '0.875rem', large: '1.25rem' };
  
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
}

// Empty State Component
export function EmptyState({ icon: Icon, title, description, action }) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      {action}
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
<<<<<<< HEAD
        <div style={{ padding: 'var(--space-lg)' }}>{children}</div>
=======
        <div style={bodyStyle}>
          {children}
        </div>
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
      </div>
    </div>
  );
}

// Tabs Component
export function Tabs({ tabs, activeTab, onChange }) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8981cf820b37c78f87789b52b5c7ce625bc4bd8c
    </div>
  );
}
