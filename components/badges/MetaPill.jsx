import React from 'react';

/**
 * MetaPill — labelled fact chip (СРОК / КОМУ / etc). Mono label + value.
 */
export function MetaPill({ label, children, style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-pill)',
        padding: '10px 20px',
        fontSize: '14px',
        color: 'var(--slate-1)',
        ...style,
      }}
    >
      {label && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--slate-4)' }}>
          {label}
        </span>
      )}
      {children}
    </span>
  );
}
