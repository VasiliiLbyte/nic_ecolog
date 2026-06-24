import * as React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  /** Use on dark/mesh sections (switches default color to lime). */
  onDark?: boolean;
  /** Show a 30px leading hairline. */
  line?: boolean;
  /** Override color token. */
  color?: string;
  style?: React.CSSProperties;
}

/** Mono uppercase eyebrow label that precedes section titles. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
