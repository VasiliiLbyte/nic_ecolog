import React from 'react';

/**
 * SectionHeader — the recurring section opener: mono eyebrow, large light title,
 * and an optional descriptor offset to the right (the brand's signature rhythm).
 */
export function SectionHeader({ eyebrow, title, description, onDark = false, style = {} }) {
  const titleColor = onDark ? '#fff' : 'var(--ink)';
  const descColor = onDark ? 'var(--text-on-dark-muted)' : 'var(--slate-2)';
  const eyeColor = onDark ? 'var(--lime)' : 'var(--teal-deep)';
  return (
    <div style={style}>
      {eyebrow && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-label)', fontWeight: 500,
          letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: eyeColor,
        }}>{eyebrow}</span>
      )}
      <h2 style={{
        margin: '20px 0 0', fontWeight: 300, fontSize: 'var(--fs-h2)',
        lineHeight: 'var(--lh-display)', letterSpacing: '-0.01em', color: titleColor,
        maxWidth: '900px', textWrap: 'balance',
      }}>{title}</h2>
      {description && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
          <p style={{ margin: 0, maxWidth: '460px', fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-body)', color: descColor }}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
