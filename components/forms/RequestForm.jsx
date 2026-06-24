import React from 'react';

/**
 * Field — a labelled input/textarea in the brand form style.
 * Mono caps label, mint-fill control, teal focus ring.
 */
export function Field({ label, name, type = 'text', placeholder, required = false, rows, style = {} }) {
  const controlStyle = {
    background: 'var(--bg-2)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-xs)',
    padding: '16px 18px',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--ink-2)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    width: '100%',
    boxSizing: 'border-box',
    ...(rows ? { resize: 'vertical' } : {}),
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      <label htmlFor={name} style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', color: 'var(--slate-4)', textTransform: 'uppercase' }}>
        {label}
      </label>
      {rows ? (
        <textarea id={name} name={name} rows={rows} placeholder={placeholder} required={required}
          style={controlStyle}
          style-focus="border-color:#139EA1;box-shadow:0 0 0 3px rgba(19,158,161,0.15)" />
      ) : (
        <input id={name} name={name} type={type} placeholder={placeholder} required={required}
          style={controlStyle}
          style-focus="border-color:#139EA1;box-shadow:0 0 0 3px rgba(19,158,161,0.15)" />
      )}
    </div>
  );
}

/**
 * RequestForm — the «Оставить заявку» lead form. Имя / Телефон / Задача + submit.
 * Pass onSubmit; the parent owns success state.
 */
export function RequestForm({ onSubmit, submitLabel = 'Отправить заявку', note = true, style = {} }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', ...style }}>
      <Field label="Имя" name="name" placeholder="Как к вам обращаться" required />
      <Field label="Телефон" name="phone" type="tel" placeholder="+7 (___) ___-__-__" required />
      <Field label="Задача" name="task" rows={4} placeholder="Например: нужен проект СЗЗ для производственной площадки" />
      <button type="submit" style={{
        marginTop: '6px', background: 'var(--grad-brand)', color: '#fff', fontFamily: 'var(--font-body)',
        fontSize: '16px', fontWeight: 500, border: 'none', borderRadius: 'var(--r-pill)', padding: '18px 38px', cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }} style-hover="transform:translateY(-2px);box-shadow:0 16px 36px rgba(19,158,161,0.35)">
        {submitLabel}
      </button>
      {note && (
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--slate-5)', lineHeight: 1.6 }}>
          Нажимая кнопку, вы соглашаетесь с <a href="#" style={{ color: 'var(--teal)' }}>политикой конфиденциальности</a>.
        </p>
      )}
    </form>
  );
}
