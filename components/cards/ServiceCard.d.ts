import * as React from 'react';

export interface ServiceCardProps {
  /** Service name or abbreviation, e.g. "НДВ" or "Аутсорсинг эколога". */
  title: string;
  /** One-line descriptor under the title. */
  descriptor?: string;
  /** Gradient dot-badge stops. */
  dotFrom?: string;
  dotTo?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** Catalog service tile: gradient dot-badge + name + descriptor, lifts on hover. */
export function ServiceCard(props: ServiceCardProps): JSX.Element;
