import * as React from 'react';

export interface MetaPillProps {
  /** Mono caps label, e.g. "СРОК", "КОМУ". */
  label?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** White pill chip pairing a mono caps label with a value — used for service facts. */
export function MetaPill(props: MetaPillProps): JSX.Element;
