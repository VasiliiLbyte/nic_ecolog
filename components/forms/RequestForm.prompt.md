Lead-capture form and its labelled `Field` primitive — the «Оставить заявку» pattern.

```jsx
<RequestForm onSubmit={handleSubmit} />

// or build custom forms from the field primitive:
<Field label="E-mail" name="email" type="email" placeholder="you@company.ru" required />
<Field label="Сообщение" name="msg" rows={4} placeholder="…" />
```

Fields use a mono caps label, mint-fill control and a teal focus ring. Place the form inside a
`DarkSection` (or the white-card contact split) per the homepage. The parent owns submit + success state.
