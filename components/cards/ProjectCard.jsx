import React from 'react';

/**
 * ProjectCard — portfolio object. Image (or mint-stripe placeholder) + mono tag + title + result line.
 */
export function ProjectCard({ image, tag, title, result, height = 300, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        background: 'var(--white)',
        transition: 'box-shadow var(--dur-fast) ease',
        boxShadow: hover ? 'var(--shadow-card)' : 'none',
        ...style,
      }}
    >
      <div style={{ height: `${height}px`, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: image ? `center/cover no-repeat url(${image})` : 'var(--placeholder)',
          transform: hover ? 'scale(1.045)' : 'none',
          transition: 'transform 0.9s var(--ease-out)',
        }} />
      </div>
      <div style={{ padding: '32px 34px 36px' }}>
        {tag && (
          <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--teal)', textTransform: 'uppercase' }}>{tag}</p>
        )}
        <h3 style={{ margin: '0 0 10px', fontSize: 'var(--fs-h3)', fontWeight: 400, color: 'var(--ink)' }}>{title}</h3>
        {result && (
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--slate-3)', lineHeight: 1.65 }}>{result}</p>
        )}
      </div>
    </div>
  );
}
