import * as React from 'react';

export interface ProjectCardProps {
  /** Photo URL; when omitted a mint diagonal-stripe placeholder is shown. */
  image?: string;
  /** Mono caps tag, e.g. "ПРОЕКТ СЗЗ · ИЗМЕРЕНИЯ". */
  tag?: string;
  title: string;
  /** Outcome / description line. */
  result?: string;
  /** Image area height in px. */
  height?: number;
  style?: React.CSSProperties;
}

/** Portfolio object card: image (or placeholder) that scales on hover + tag + title + result. */
export function ProjectCard(props: ProjectCardProps): JSX.Element;
