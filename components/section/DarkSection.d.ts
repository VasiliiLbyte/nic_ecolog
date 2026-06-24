import * as React from 'react';

export interface DarkSectionProps {
  children: React.ReactNode;
  /** Background gradient. 'esg' = deep-blue→petrol; 'lab' = petrol→navy; 'navy' = flat darkest. */
  variant?: 'esg' | 'lab' | 'navy';
  /** Show the blurred lime accent blob (top-right). */
  blob?: boolean;
  /** Overlay faint topographic isolines. */
  isolines?: boolean;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
}

/** Reusable dark band for Lab / ESG / Contact sections — brand gradient + accent blob, content as children. */
export function DarkSection(props: DarkSectionProps): JSX.Element;
