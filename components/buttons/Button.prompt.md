Pill-shaped action button — use for every CTA; one `grad` primary per view, `ghost` for secondary, `ghost-light` on dark sections.

```jsx
<Button variant="grad" arrow href="#zayavka">Заказать исследование</Button>
<Button variant="ghost" href="#uslugi">Услуги</Button>
<Button variant="ghost-light" arrow>Услуги ESG</Button>
<Button variant="grad" size="sm" type="submit">Отправить заявку</Button>
```

Variants: `grad` (teal→ocean gradient, white text), `ghost` (petrol outline on light), `ghost-light`
(translucent + blur on dark). Sizes: `md` (default), `sm`. Set `arrow` to append `→`. Renders `<a>` when
`href` is given, otherwise `<button>`.
