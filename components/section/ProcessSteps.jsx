import React from 'react';

/**
 * ProcessSteps — horizontal numbered timeline with a gradient connector line.
 * Each step shows a colored node, a mono number, a title and a short description.
 * Falls back to a stacked layout on narrow screens (set columns to control desktop count).
 */
const NODE_COLORS = ['#ADCF7A', '#4CB272', '#139EA1', '#1C6BA2', '#0B5C60'];

export function ProcessSteps({ steps = [], style = {} }) {
  const n = steps.length || 5;
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '36px', ...style }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '5px', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg,#ADCF7A,#4CB272,#139EA1,#1C6BA2,#0B5C60)', opacity: 0.45,
      }} />
      {steps.map((s, i) => {
        const c = NODE_COLORS[i % NODE_COLORS.length];
        return (
          <div key={i} style={{ position: 'relative', paddingTop: '32px' }}>
            <span aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, width: '11px', height: '11px', borderRadius: '50%',
              background: c, boxShadow: `0 0 0 4px ${c}40`,
            }} />
            <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-4)' }}>
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 500, color: 'var(--ink)' }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--slate-3)', lineHeight: 1.65 }}>{s.text}</p>
          </div>
        );
      })}
    </div>
  );
}
