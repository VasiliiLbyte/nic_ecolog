import * as React from 'react';

export interface FieldProps {
  /** Mono caps label, e.g. "ИМЯ". */
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  /** When set, renders a <textarea> with this many rows. */
  rows?: number;
  style?: React.CSSProperties;
}

/** Labelled brand input or textarea (mono label, mint fill, teal focus ring). */
export function Field(props: FieldProps): JSX.Element;

export interface RequestFormProps {
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  /** Show the privacy-policy note under the button. */
  note?: boolean;
  style?: React.CSSProperties;
}

/** The «Оставить заявку» lead form: Имя / Телефон / Задача + gradient submit. */
export function RequestForm(props: RequestFormProps): JSX.Element;
