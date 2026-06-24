Two content cards: `ServiceCard` (catalog tile) and `ProjectCard` (portfolio object).

```jsx
<ServiceCard title="НДВ" descriptor="Нормативы допустимых выбросов" dotFrom="#ADCF7A" dotTo="#4CB272" href="#ndv" />

<ProjectCard
  tag="ЭКОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ"
  title="Лахта Центр"
  result="Полный цикл экологического контроля при строительстве самого высокого здания Европы."
  image="/assets/lahta.jpg"
/>
```

`ServiceCard` lifts and outlines teal on hover. `ProjectCard` scales its image on hover; omit `image`
to show the brand mint-stripe placeholder.
