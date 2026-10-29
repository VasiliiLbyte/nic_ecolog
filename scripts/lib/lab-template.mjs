// Страница лаборатории «Аналитик Лаб» (lab.html) — в дизайн-системе главной (макет Figma «Главная — Desktop 1440 /
// Mobile 390»): шапка, меню и подвал — общие со страницами услуг (service-page-template.mjs), блоки — компоненты
// главной. Стили компонентов и карточки лаборатории сборка берёт из самой главной (homeCss, labCards), поэтому
// правка на главной сразу попадает и сюда. Тексты перенесены из прежней lab.html без изменений.
import { chromeBar, esc, footerBlock, headBlock, menuScript } from './service-page-template.mjs';

const TITLE = 'Лаборатория «Аналитик Лаб» — НИЦ «Эколог» · аккредитованная экологическая лаборатория в СПб';
const DESCRIPTION =
  'Аккредитованная экологическая лаборатория «Аналитик Лаб» (НИЦ «Эколог», Санкт-Петербург): анализ воды, воздуха, почвы, отходов, физических факторов и радиации. Полный цикл от отбора пробы до протокола. Аккредитация на 5 лет.';
const EXTRA_HEAD = `<meta name="keywords" content="экологический инжиниринг, экологический консалтинг, аккредитованная лаборатория, НДВ, НДС, ПНООЛР, проект СЗЗ, КЭР, ОВОС, ПЭК, инженерно-экологические изыскания, ESG, Санкт-Петербург">
<meta name="theme-color" content="#0A3D42">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","@id":"https://nic-ecolog.ru/lab.html#lab","name":"Аналитик Лаб","alternateName":"Лаборатория «Аналитик Лаб»","url":"https://nic-ecolog.ru/lab.html","logo":"https://nic-ecolog.ru/assets/favicon-512.png","image":"https://nic-ecolog.ru/assets/hero-mesh-poster.jpg","description":"Аккредитованная экологическая лаборатория: анализ воды, воздуха, почвы, отходов, физических факторов и радиации. Полный цикл от отбора пробы до протокола.","parentOrganization":{"@type":"Organization","name":"НИЦ «Эколог»","url":"https://nic-ecolog.ru/"},"areaServed":"RU","telephone":"+7-812-449-93-48","email":"info@nic-ecolog.ru","address":{"@type":"PostalAddress","addressLocality":"Санкт-Петербург","addressCountry":"RU"}}
</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"НИЦ «Эколог» — независимый исследовательский центр","alternateName":"Аналитик Лаб","url":"https://nic-ecolog.ru/","description":"Экологический инжиниринг и консалтинг: изыскания, собственная аккредитованная лаборатория, разрешительная документация (НДВ, НДС, ПНООЛР, СЗЗ, КЭР, ОВОС, ПЭК) и ESG.","image":"https://nic-ecolog.ru/assets/favicon-512.png","logo":"https://nic-ecolog.ru/assets/favicon-512.png","areaServed":"RU","address":{"@type":"PostalAddress","addressLocality":"Санкт-Петербург","addressCountry":"RU"},"knowsAbout":["Экологический инжиниринг","Инженерно-экологические изыскания","Аккредитованная лаборатория","Разрешительная документация","ESG"],"slogan":"Наука + экология + прикладные решения"}</script>`;

const ARROW = '<svg class="f-flow__arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M0 5H9M5.5 1.5L9 5L5.5 8.5" fill="none" stroke="#ADCF7A" stroke-width="1"/></svg>';

const STEPS = [
  ['Изыскания', 'Полевые <a href="uslugi/iei/">инженерно-экологические изыскания</a>: маршрутные наблюдения, точки отбора, привязка по координатам.', 'ИЭИ · полевой этап'],
  ['Отбор проб', 'Аккредитованный отбор проб воды, воздуха, почвы и отходов с соблюдением методик и цепочки хранения.', 'цепочка хранения проб'],
  ['Лабораторный анализ', 'Химический, физико-химический и микробиологический анализ на аттестованном оборудовании.', '120+ показателей'],
  ['Обработка данных', 'Интерпретация результатов, расчёты и протоколы испытаний с прослеживаемостью до каждой пробы.', 'протоколы испытаний'],
  ['Документация и согласование', 'Подготовка разделов и сопровождение согласований в надзорных органах — до результата.', '98% без замечаний'],
];

// [число (для счётчика) | текст, суффикс, подпись]
const ACCRED_STATS = [
  [5, ' лет', 'срок действия аккредитации после ребрендинга и переаттестации'],
  ['RA.RU.516478', '', 'аттестат аккредитации в национальной системе, от 25.12.2025. <a href="assets/docs/attestat-akkreditacii.pdf" download>Скачать PDF</a>'],
  [9, '', 'направлений исследований — от воды до радиации'],
  [1, ' день', 'срочный выезд на объект для отбора проб'],
];
const QUALITY_STATS = [
  [500, '+', 'показателей в области аккредитации лаборатории'],
  [100, '%', 'проб с прослеживаемостью от отбора до протокола'],
  [14, ' лет', 'экспертизы в составе НИЦ «Эколог»'],
  ['Пн–Пт', '', 'приём проб и консультации, 9:00–18:00'],
];

const DOMAINS = [
  ['<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7"/>', '01 · Вода', 'Исследование воды', 'Одна из самых широких аккредитаций по воде в Санкт-Петербурге', ['Питьевая', 'Природная', 'Сточная', 'Параллельная проба', 'Морфометрия']],
  ['<path d="M12.8 19.6A2 2 0 1 0 14 16H2m15.5-8a2.5 2.5 0 1 1 2 4H2m7.8-7.6A2 2 0 1 1 11 8H2"/>', '02 · Воздух', 'Исследование воздуха', 'Атмосфера, выбросы и рабочая зона', ['Атмосферный воздух', 'Промышленные выбросы', 'Воздух рабочей зоны']],
  ['<path d="m8 3 4 8 5-5 5 15H2z"/>', '03 · Почва', 'Почва и донные отложения', 'Химический и агрохимический состав', ['Почва', 'Донные отложения', 'Загрязняющие вещества']],
  ['<path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', '04 · Отходы', 'Отходы производства', 'Класс опасности и состав', ['Количественный анализ', 'Морфологический состав', 'Класс опасности']],
  ['<path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"/>', '05 · Физфакторы', 'Физические факторы', 'Измерения факторов физического воздействия', ['Шум / инфразвук', 'Вибрация', 'ЭМ-поля', 'Микроклимат']],
  ['<path d="M14 15.46a4 4 0 0 1-4 0l-2.47 4.29a1 1 0 0 0 .46 1.41 10 10 0 0 0 8.02 0 1 1 0 0 0 .46-1.41zM16 12a4 4 0 0 0-2-3.46l2.47-4.29a1 1 0 0 1 1.46-.3 10 10 0 0 1 4 6.94A1 1 0 0 1 21 12zm-8 0a4 4 0 0 1 2-3.46L7.53 4.25a1 1 0 0 0-1.46-.3 10 10 0 0 0-4 6.94A1 1 0 0 0 3 12z"/>', '06 · Радиация', 'Радиационные измерения', 'Дозиметрия и радон', ['МЭД / МАД', 'Плотность потока радона', 'ЭРОА радона']],
  ['<path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>', '07 · Радиометрия', 'Радиометрические исследования', 'Удельная активность радионуклидов', ['Гамма-спектрометрия', 'Радионуклиды']],
  ['<path d="M14 2v6a2 2 0 0 0 .25.96l5.5 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.75-2.96l5.5-10.08A2 2 0 0 0 10 8V2M6.45 15h11.1M8.5 2h7"/>', '08 · Токсикология', 'Токсикологические исследования', 'Биотестирование объектов среды', ['Биотестирование', 'Острая токсичность']],
  ['<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>', '09 · Комплекс', 'Комплексные анализы', 'Готовые пакеты под задачу предприятия', ['Почва. К', 'Промвыбросы. К', 'Сточная вода. К']],
];

// Только то, чего нет в стилях главной: фон героя под id страницы, кнопки, текстовая цифра, карточки направлений, форма.
const LAB_CSS = `
#eco-root{background:#FFFFFF}
.f-sec{background:#FFFFFF}
.f-sec.f-sec--alt{background:var(--f-alt)}
#lab{background:url('assets/figma/grain-a25-d90.webp') 0 0/128px 128px repeat,#0B5C60 url('assets/figma/bg-lab.webp') center/cover no-repeat;background-blend-mode:overlay,normal;color:#FFFFFF;scroll-margin-top:0}
#lab h1.f-h2{color:#FFFFFF}
.lab-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
/* Контурная кнопка на тёмном фоне — лаймовая, как текст «АТТЕСТАТ…» */
.f-btn--ghost.lab-btn-outline{min-width:210px;box-shadow:inset 0 0 0 1px #ADCF7A;color:#ADCF7A}
.f-lab__meta a{color:inherit;text-decoration:underline;text-underline-offset:3px}
.f-stat__num--text{font-size:32px;font-weight:300;letter-spacing:0}
.f-stat__label a{color:var(--f-teal)}
.f-step p.f-step__badge{margin:12px 0 0;max-width:155px;font-size:12px;line-height:16px;color:var(--f-teal)}
.f-step p.f-step__desc{margin:16px 0 0;max-width:155px;font-size:12px;line-height:16px;color:var(--f-text)}
.f-step p.f-step__desc a{color:var(--f-teal)}
.lab-domains{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
.lab-domain{display:flex;flex-direction:column;gap:8px;padding:20px;border-radius:8px;background:var(--f-alt)}
.lab-domain .f-lab__icon{width:40px;height:40px;margin-bottom:8px}
.lab-domain .f-lab__icon svg{width:20px;height:20px;stroke:#FFFFFF;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.lab-domain__num{margin:0;font-size:12px;line-height:16px;letter-spacing:0.02em;text-transform:uppercase;color:var(--f-teal)}
.lab-domain h3{margin:0;font-family:'Onest',sans-serif;font-size:20px;line-height:28px;font-weight:600;color:var(--f-heading)}
.lab-domain__sub{margin:0;font-size:14px;line-height:20px;color:var(--f-text)}
.lab-domain__tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.lab-domain__tags span{padding:4px 10px;border-radius:5px;background:#FFFFFF;font-size:12px;line-height:16px;color:var(--f-heading)}
.lab-contacts{display:flex;flex-direction:column;gap:16px;margin-top:40px}
.lab-contacts div{display:grid;grid-template-columns:110px 1fr;gap:16px;font-size:14px;line-height:20px}
.lab-contacts dt{margin:0;color:rgba(255,255,255,0.7);font-size:12px;line-height:20px;text-transform:uppercase;letter-spacing:0.02em}
.lab-contacts dd{margin:0;color:#FFFFFF}
.lab-contacts a{color:#FFFFFF;text-decoration:none}
#lab-form{display:flex;flex-direction:column;gap:24px;padding:32px;background:var(--f-alt)}
.lab-form__fields{display:flex;flex-direction:column;gap:16px}
.lab-form__ok{margin:0;font-size:18px;font-weight:500;color:var(--f-heading)}
.lab-form__ok+p{margin:12px 0 0;font-size:14px;line-height:20px;color:var(--f-text)}
@media (max-width:1060px){
  .lab-domains{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:720px){
  #lab{padding-top:32px;background-image:url('assets/figma/grain-a25-d90.webp'),url('assets/figma/bg-lab-mobile.webp')}
  .lab-actions{flex-direction:column;align-items:stretch;width:100%}
  .lab-actions .f-btn{width:100%;height:44px}
  .f-stat__num--text{font-size:24px;line-height:72px}
  .f-step p.f-step__desc,.f-step p.f-step__badge{max-width:none}
  /* у шага здесь четыре строки (номер, заголовок, описание, подпись) — маркер тянем на все, подпись во вторую колонку */
  .f-step__marker{grid-row:1 / span 4}
  .f-step p.f-step__badge{grid-column:2;margin-top:8px}
  .f-step p.f-step__desc{margin-top:8px;line-height:18px}
  .lab-domains{grid-template-columns:1fr;margin-top:32px}
  .lab-domain{padding:16px}
  .lab-contacts{margin-top:24px}
  .lab-contacts div{grid-template-columns:1fr;gap:2px}
  #lab-form{padding:24px}
  #lab-form .f-field input{height:44px;font-size:16px}
  #lab-form .f-field textarea{height:96px;font-size:16px}
  #lab-form .f-form-actions .f-btn{width:100%;height:44px}
}`;

function stat([value, suffix, label]) {
  const isNum = typeof value === 'number';
  const num = isNum ? `<span data-count="${value}">${value}</span>` : value;
  const suf = suffix ? (suffix.trim() === '+' || suffix.trim() === '%' ? `<span class="f-stat__suf">${suffix}</span>` : suffix) : '';
  return `<div class="f-stat" data-rv="true"><div class="f-stat__num${isNum ? '' : ' f-stat__num--text'}">${num}${suf}</div><p class="f-stat__label">${label}</p></div>`;
}

function intro(eyebrow, title, lead) {
  return `<div class="f-intro">
          <p class="f-eyebrow" data-rv="true">${eyebrow}</p>
          <div class="f-intro__row">
            <h2 class="f-h2" data-rv="true">${title}</h2>
            <p class="f-lead" data-rv="true">${lead}</p>
          </div>
        </div>`;
}

function pageScript() {
  return `<script>(function(){
var root=document.getElementById('eco-root');
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var fmt=function(n){return n.toLocaleString('ru-RU');};
if(!reduced&&'IntersectionObserver' in window){
 root.setAttribute('data-anim','on');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv-on');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
 [].forEach.call(document.querySelectorAll('[data-rv]'),function(el){io.observe(el);});
 var ioc=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;ioc.unobserve(e.target);var el=e.target,to=+el.getAttribute('data-count'),t0=performance.now();
  (function s(t){var p=Math.min(1,(t-t0)/1500);el.textContent=fmt(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(s);})(t0);});},{threshold:0.5});
 [].forEach.call(document.querySelectorAll('[data-count]'),function(el){el.textContent='0';ioc.observe(el);});
}
var form=document.getElementById('lab-form');
if(form)form.addEventListener('submit',function(e){
 e.preventDefault();
 var v=function(id){var el=document.getElementById(id);return (el&&el.value||'').trim();};
 var name=v('lab-name'),contact=v('lab-contact-field'),task=v('lab-task');
 if(name.length<2||!contact){alert('Заполните имя и контакт для ответа.');return;}
 var btn=form.querySelector('button[type="submit"]');if(btn){btn.disabled=true;}
 fetch('/api/send.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,contact:contact,task:task,source:'lab',website:''})})
 .then(function(r){return r.json().then(function(j){return r.ok&&j&&j.ok;});})
 .then(function(ok){
  if(!ok)throw new Error('fail');
  if(typeof ym==='function')ym(112117233,'reachGoal','form_sent');
  form.innerHTML='<p class="lab-form__ok">Заявка отправлена</p><p>Свяжемся с вами в течение рабочего дня.</p>';
 }).catch(function(){
  alert('Не удалось отправить. Позвоните +7 (812) 449-93-48 или напишите на sale@nic-ecolog.ru.');
  if(btn){btn.disabled=false;}
 });
});
})();</script>`;
}

export function renderLabPage({ homeCss, labCards }) {
  const steps = STEPS.map(([title, desc, badge], i) => `<div class="f-step" data-rv="true"><div class="f-step__marker" aria-hidden="true"><span></span></div><p class="f-step__num">${String(i + 1).padStart(2, '0')}</p><h3>${title}</h3><p class="f-step__desc">${desc}</p><p class="f-step__badge">${badge}</p></div>`).join('\n          ');
  const domains = DOMAINS.map(([svg, num, title, sub, tags], i) => `<article class="lab-domain" data-rv="true">
            <span class="f-lab__icon${i % 2 ? '' : ' f-lab__icon--green'}" aria-hidden="true"><svg viewBox="0 0 24 24">${svg}</svg></span>
            <p class="lab-domain__num">${num}</p>
            <h3>${title}</h3>
            <p class="lab-domain__sub">${sub}</p>
            <div class="lab-domain__tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          </article>`).join('\n          ');

  return `${headBlock({ title: TITLE, description: DESCRIPTION, canonical: 'https://nic-ecolog.ru/lab.html', depth: 0, extraHead: `${EXTRA_HEAD}\n<style>${homeCss}\n${LAB_CSS}</style>` })}
<body>
${chromeBar({ depth: 0, homeHref: 'index.html', crumbsHtml: '' })}
<main id="eco-root">
    <section id="lab" class="f-sec" data-screen-label="Лаборатория Аналитик Лаб">
      <div class="f-wrap f-lab">
        <div class="f-lab__content">
          <div class="f-lab__intro">
            <p class="f-eyebrow" data-rv="true">Собственная аккредитованная лаборатория</p>
            <h1 class="f-h2" data-rv="true">«Аналитик Лаб»&nbsp;— лаборатория в составе центра</h1>
            <p class="f-lead" data-rv="true">Редкость для рынка: отбор и анализ проб, изыскания, документация и согласование — в одной команде и по одному адресу. Без субподряда, без потери качества данных и сроков.</p>
          </div>
          <div class="f-flow" data-rv="true">
            <span class="f-flow__step">Изыскания</span>
            ${ARROW}
            <span class="f-flow__step">Лабораторный анализ</span>
            ${ARROW}
            <span class="f-flow__step">Документация</span>
            ${ARROW}
            <span class="f-flow__step f-flow__step--final">Согласование</span>
          </div>
          <p class="f-lab__meta" data-rv="true"><a href="assets/docs/attestat-akkreditacii.pdf" download>АТТЕСТАТ RA.RU.516478</a>    |    РЕЕСТР АККРЕДИТОВАННЫХ ЛИЦ</p>
          <div class="lab-actions" data-rv="true">
            <a class="f-btn f-btn--green" href="#lab-contact">Запросить КП</a>
            <a class="f-btn f-btn--ghost lab-btn-outline" href="#process">Полный цикл работ</a>
          </div>
        </div>
        <div class="f-lab__grid">
          ${labCards.join('\n          ')}
        </div>
      </div>
    </section>

    <section id="process" class="f-sec" data-screen-label="Полный цикл">
      <div class="f-wrap">
        ${intro('Полный цикл', 'От пробы до протокола', 'Пять этапов в одной команде: полевые изыскания, аккредитованный отбор, лабораторный анализ, обработка данных и сопровождение документации до согласования.')}
        <div class="f-steps">
          ${steps}
        </div>
      </div>
    </section>

    <section id="accred" class="f-sec f-sec--alt" data-screen-label="Аккредитация">
      <div class="f-wrap">
        ${intro('Аккредитация и доверие', 'Аттестат аккредитации — подтверждённая компетентность', 'Лаборатория аккредитована в национальной системе и работает по актуальным методикам. Аккредитация подтверждена на 5 лет; область регулярно расширяется — последними добавлены измерения по металлам и физическим факторам.')}
        <div class="f-stats">
          ${ACCRED_STATS.map(stat).join('\n          ')}
        </div>
      </div>
    </section>

    <section id="domains" class="f-sec" data-screen-label="Что мы исследуем">
      <div class="f-wrap">
        ${intro('Что мы исследуем', 'Девять направлений — один протокол доверия', 'Полный спектр объектов окружающей среды и факторов воздействия. Каждая проба сопровождается прослеживаемостью — от точки отбора до подписанного протокола.')}
        <div class="lab-domains">
          ${domains}
        </div>
      </div>
    </section>

    <section id="quality" class="f-sec f-sec--alt" data-screen-label="Приборная база">
      <div class="f-wrap">
        ${intro('Приборная база и качество', 'Современное оборудование и внутренний контроль качества', 'Актуальный приборный парк, аттестованные методики и многоступенчатый контроль качества на каждом этапе. Результат — протоколы, которые принимаются надзорными органами без замечаний.')}
        <div class="f-stats">
          ${QUALITY_STATS.map(stat).join('\n          ')}
        </div>
      </div>
    </section>

    <section id="lab-contact" class="f-sec" data-screen-label="Запрос в лабораторию">
      <div class="f-wrap">
        <div class="f-request" data-rv="true">
          <div class="f-request__panel">
            <p class="f-eyebrow" style="color:#ADCF7A;margin-bottom:24px">Запрос в лабораторию</p>
            <h2 class="f-h2">Коммерческое предложение за 1 рабочий день</h2>
            <p class="f-lead">Опишите задачу — рассчитаем объём анализов, сроки и стоимость, при необходимости организуем срочный выезд для отбора проб.</p>
            <dl class="lab-contacts">
              <div><dt>Телефон</dt><dd><a href="tel:+78124499348">+7 (812) 449-93-48</a></dd></div>
              <div><dt>Почта</dt><dd><a href="mailto:info@analitik-lab.ru">info@analitik-lab.ru</a></dd></div>
              <div><dt>Адрес</dt><dd>192102, Санкт-Петербург, ул. Дубровская, д. 13, литера А, пом. 27</dd></div>
              <div><dt>Часы работы</dt><dd>Пн – Пт · 9:00 – 18:00</dd></div>
            </dl>
          </div>
          <form id="lab-form" novalidate>
            <div class="lab-form__fields">
              <div class="f-field"><label for="lab-name">Имя</label><input type="text" id="lab-name" name="name" autocomplete="name" placeholder="Как к вам обращаться" required></div>
              <div class="f-field"><label for="lab-contact-field">Телефон или e-mail</label><input type="text" id="lab-contact-field" name="contact" placeholder="Для ответа с КП" required></div>
              <div class="f-field"><label for="lab-task">Что нужно исследовать</label><textarea id="lab-task" name="task" placeholder="Например: анализ сточной воды по 12 показателям, выезд на объект в Колпино" required></textarea></div>
            </div>
            <div class="f-form-actions">
              <button type="submit" class="f-btn f-btn--sm">Получить предложение</button>
              <p class="f-consent">Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
</main>
${footerBlock({ depth: 0, homeHref: 'index.html' })}
${menuScript()}
${pageScript()}
</body>
</html>
`;
}
