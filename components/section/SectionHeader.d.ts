import * as React from 'react';

export interface SectionHeaderProps {
  /** Mono caps eyebrow, e.g. "ПОРТФЕЛЬ". */
  eyebrow?: string;
  title: React.ReactNode;
  /** Optional descriptor, rendered offset to the right per brand rhythm. */
  description?: React.ReactNode;
  /** Use on dark/mesh sections. */
  onDark?: boolean;
  style?: React.CSSProperties;
}

/** Standard section opener: eyebrow + large light title + right-offset descriptor. */
export function SectionHeader(props: SectionHeaderProps): JSX.Element;
