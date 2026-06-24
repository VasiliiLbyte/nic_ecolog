Reusable dark band — the shared shell behind the Lab, ESG and Contact sections. Brand gradient + a
blurred lime accent blob. Put your own content (eyebrow, white headline, columns, donut, form) inside.

```jsx
<DarkSection variant="esg">
  <SectionHeader onDark eyebrow="ESG" title="ECO IS DATA" />
  …columns / donut…
</DarkSection>

<DarkSection variant="lab" isolines>
  …«Аналитик Лаб» content…
</DarkSection>
```

Variants: `esg` (deep-blue→petrol), `lab` (petrol→navy), `navy` (flat darkest, e.g. footer-adjacent).
Use `SectionHeader onDark` inside so the eyebrow turns lime and the title goes white.
