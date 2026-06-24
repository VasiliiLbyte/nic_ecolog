import * as React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. 'grad' = primary gradient; 'ghost' = outline on light; 'ghost-light' = translucent on dark. */
  variant?: 'grad' | 'ghost' | 'ghost-light';
  size?: 'md' | 'sm';
  /** When set, renders an <a> instead of a <button>. */
  href?: string;
  /** Append a trailing → arrow. */
  arrow?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

/**
 * Pill action button in the НИЦ «Эколог» brand.
 * Use 'grad' for the single primary CTA per view; 'ghost' for secondary on light;
 * 'ghost-light' for actions placed on dark/mesh sections.
 */
export function Button(props: ButtonProps): JSX.Element;
