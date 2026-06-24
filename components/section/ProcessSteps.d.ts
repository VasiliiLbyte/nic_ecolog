import * as React from 'react';

export interface ProcessStep {
  title: string;
  text: string;
}

export interface ProcessStepsProps {
  /** Ordered steps; nodes auto-color along the brand ramp. */
  steps: ProcessStep[];
  style?: React.CSSProperties;
}

/** Horizontal numbered process timeline with a gradient connector line. */
export function ProcessSteps(props: ProcessStepsProps): JSX.Element;
