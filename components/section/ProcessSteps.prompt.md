Numbered process timeline — a horizontal row of steps joined by the brand gradient line. Nodes auto-color
lime → petrol along the ramp.

```jsx
<ProcessSteps steps={[
  { title: 'Заявка и оценка задачи', text: 'Отвечаем в течение рабочего дня, фиксируем объём, сроки и стоимость.' },
  { title: 'Исходные данные',        text: 'Запрашиваем документы, при необходимости выезжаем на объект.' },
  { title: 'Эксперты и лаборатория', text: 'Полевые работы, отбор и анализ проб, расчёты и моделирование.' },
  { title: 'Согласование',           text: 'Сопровождаем документацию в надзорных органах до утверждения.' },
  { title: 'Результат',              text: 'Комплект документов и защита от штрафов, предписаний и рисков.' },
]} />
```

Designed for 4–5 steps. On narrow screens collapse the grid to one column in your page CSS.
