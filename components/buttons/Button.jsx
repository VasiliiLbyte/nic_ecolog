import React from 'react';

/**
 * Button — НИЦ «Эколог» primary action.
 * Renders an <a> when href is set, else a <button>. Pill shape, three variants.
 */
export function Button({
  children,
  variant = 'grad',      // 'grad' | 'ghost' | 'ghost-light'
  size = 'md',           // 'md' | 'sm'
  href,
  arrow = false,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const pad = size === 'sm' ? '12px 24px' : '17px 30px';
  const fs = size === 'sm' ? '14px' : '16px';

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: 'var(--r-pill)',
    fontFamily: 'var(--font-body)',
    fontSize: fs,
    fontWeight: 500,
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) ease, border-color var(--dur-fast) ease',
    padding: pad,
  };

  const variants = {
    grad: {
      color: '#fff',
      background: 'var(--grad-brand)',
      boxShadow: '0 10px 26px -10px rgba(19,158,161,0.55)',
    },
    ghost: {
      color: 'var(--teal-deep)',
      background: 'transparent',
      borderColor: 'var(--line-strong)',
    },
    'ghost-light': {
      color: '#fff',
      background: 'rgba(255,255,255,0.10)',
      borderColor: 'rgba(255,255,255,0.32)',
      backdropFilter: 'blur(6px)',
    },
  };

  const Tag = href ? 'a' : 'button';
  const tagProps = href ? { href } : { type };

  return (
    <Tag
      {...tagProps}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Tag>
  );
}
