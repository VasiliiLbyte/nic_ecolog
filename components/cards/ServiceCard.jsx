import React from 'react';

/**
 * ServiceCard — one catalog service. Gradient dot-badge + name + short descriptor.
 * Hairline white card, lifts on hover.
 */
export function ServiceCard({ title, descriptor, dotFrom = '#ADCF7A', dotTo = '#4CB272', onClick, href, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const Tag = href ? 'a' : 'div';
  const tagProps = href ? { href } : {};
  return (
    <Tag
      {...tagProps}
      onClick={onClick}
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        padding: '26px 26px 22px',
        background: 'var(--white)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out)',
        borderColor: hover ? 'rgba(19,158,161,0.35)' : 'var(--line)',
        boxShadow: hover ? 'var(--shadow-card)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span aria-hidden="true" style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: `radial-gradient(circle, ${dotFrom}, ${dotTo})`,
          boxShadow: `0 0 12px ${dotFrom}aa`, flex: '0 0 auto',
        }} />
        <h4 style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 500, color: 'var(--ink)' }}>{title}</h4>
      </div>
      {descriptor && (
        <p style={{ margin: '10px 0 0', fontSize: 'var(--fs-sm)', color: 'var(--slate-3)', lineHeight: 1.5 }}>{descriptor}</p>
      )}
    </Tag>
  );
}
