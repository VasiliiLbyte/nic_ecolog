import React from 'react';

/**
 * DarkSection — reusable dark band used for Lab, ESG and Contact sections.
 * Brand gradient background + a blurred lime accent blob + optional isolines.
 * Compose any content as children; eyebrow turns lime, headings should be white.
 */
export function DarkSection({
  children,
  variant = 'esg',        // 'esg' | 'lab' | 'navy'
  blob = true,
  isolines = false,
  style = {},
  innerStyle = {},
}) {
  const bg = {
    esg: 'var(--grad-esg)',
    lab: 'var(--grad-lab)',
    navy: 'var(--navy)',
  }[variant];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-pad-y-lg) var(--section-pad-x)', background: bg, color: '#fff', ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {blob && (
          <div style={{
            position: 'absolute', top: '-28%', right: '-12%', width: '52vw', height: '52vw',
            borderRadius: '50%', background: 'radial-gradient(circle, #ADCF7A 0%, rgba(173,207,122,0) 66%)',
            filter: 'blur(95px)', opacity: 0.3,
          }} />
        )}
        {isolines && (
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-radial-gradient(ellipse 80% 120% at 80% -10%, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px)' }} />
        )}
      </div>
      <div style={{ position: 'relative', maxWidth: 'var(--container)', margin: '0 auto', ...innerStyle }}>
        {children}
      </div>
    </section>
  );
}
