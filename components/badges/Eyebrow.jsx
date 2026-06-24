import React from 'react';

/**
 * Eyebrow — mono, uppercase, wide-tracked section label.
 * Optional leading hairline. Sits above section titles.
 */
export function Eyebrow({ children, onDark = false, line = false, color, style = {} }) {
  const c = color || (onDark ? 'var(--lime)' : 'var(--teal-deep)');
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '13px',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-label)',
        fontWeight: 500,
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: c,
        ...style,
      }}
    >
      {line && (
        <span aria-hidden="true" style={{ width: '30px', height: '1px', background: 'currentColor', opacity: 0.6 }} />
      )}
      {children}
    </span>
  );
}
