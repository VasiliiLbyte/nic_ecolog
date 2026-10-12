/* НИЦ «Эколог» — поведение страниц: шапка, мобильное меню, появление секций,
   оверлей услуги на главной, форма заявки (api/send.php). Без зависимостей. */
(function () {
  'use strict';
  var doc = document;
  var body = doc.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var METRIKA_ID = 112117233;

  // Блокировка прокрутки страницы, пока открыт полноэкранный слой.
  var locks = 0;
  function lock() { if (locks++ === 0) body.classList.add('is-locked'); }
  function unlock() { if (locks > 0 && --locks === 0) body.classList.remove('is-locked'); }

  // ---------- Шапка: тень и компактная высота после прокрутки ----------
  var hdr = doc.querySelector('[data-hdr]');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Мобильное меню ----------
  var menu = doc.getElementById('nm');
  var burger = doc.querySelector('[data-menu-open]');
  var menuReturn = null;
  function openMenu() {
    if (!menu) return;
    menuReturn = doc.activeElement;
    menu.classList.add('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    lock();
    var c = menu.querySelector('[data-menu-close]');
    if (c) c.focus();
  }
  function closeMenu(restoreFocus) {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    unlock();
    if (restoreFocus !== false && menuReturn && menuReturn.focus) menuReturn.focus();
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-close]')) closeMenu();
      else if (e.target.closest('a')) closeMenu(false);
    });
  }

  // ---------- Появление секций ----------
  // Прячем только то, что ниже первого экрана, и только когда скрипт уже работает.
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove('is-pending'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    doc.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('is-pending');
        io.observe(el);
      }
    });
  }

  // ---------- Оверлей услуги (главная) ----------
  var modal = doc.getElementById('svc-modal');
  var dataEl = doc.getElementById('svc-data');
  var services = {};
  try { services = dataEl ? JSON.parse(dataEl.textContent) : {}; } catch (e) { services = {}; }
  // Услуги со своей SEO-страницей /uslugi/<slug>/ — смежные ведут туда, а не в оверлей.
  var PAGES = { ndv: 'ndv', szz: 'proekt-szz', ovos: 'ovos', pek: 'pek', iei: 'iei', autsorsing: 'autsorsing-ekologa', 'nvos-plata': 'plata-nvos' };
  var modalReturn = null;
  var openId = null;

  function q(sel) { return modal.querySelector(sel); }
  function setText(sel, text) { var el = q(sel); if (el) el.textContent = text || ''; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function fillService(id) {
    var s = services[id];
    setText('[data-svc-crumb]', s.abbr);
    setText('[data-svc-group]', s.group);
    setText('[data-svc-name]', s.name);
    var lead = q('[data-svc-lead]');
    lead.innerHTML = '';
    [s.lead, s.lead2].forEach(function (t) {
      if (!t) return;
      var p = doc.createElement('p'); p.textContent = t; lead.appendChild(p);
    });
    setText('[data-svc-term]', s.term);
    setText('[data-svc-who]', cap(s.who));
    setText('[data-svc-result]', s.result);
    setText('[data-svc-why]', s.whyUs || 'Изыскания, лаборатория и документация — одна команда. Измерения выполняет собственная аккредитованная лаборатория «Аналитик Лаб», поэтому данные не теряются на стыках подрядчиков.');
    var inc = q('[data-svc-includes]');
    inc.innerHTML = '';
    (s.includes || []).forEach(function (t, i) {
      var li = doc.createElement('li');
      var n = doc.createElement('span'); n.textContent = (i < 9 ? '0' : '') + (i + 1);
      var tx = doc.createElement('p'); tx.textContent = t;
      li.appendChild(n); li.appendChild(tx); inc.appendChild(li);
    });
    var rel = q('[data-svc-related]');
    rel.innerHTML = '';
    (s.related || []).filter(function (r) { return services[r]; }).forEach(function (r) {
      var el;
      if (PAGES[r]) {
        el = doc.createElement('a');
        el.href = 'uslugi/' + PAGES[r] + '/';
      } else {
        el = doc.createElement('button');
        el.type = 'button';
        el.setAttribute('data-svc', r);
      }
      el.className = 'chip';
      el.textContent = services[r].abbr + ' →';
      rel.appendChild(el);
    });
    q('[data-svc-related-wrap]').hidden = !rel.children.length;
  }

  function openService(id, fromHistory) {
    if (!modal || !services[id]) return;
    if (!openId) { modalReturn = doc.activeElement; lock(); }
    openId = id;
    fillService(id);
    modal.hidden = false;
    modal.scrollTop = 0;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    if (!fromHistory) history.pushState({ svc: id }, '', '#usluga-' + id);
    var b = q('button[data-svc-close]');
    if (b) b.focus({ preventScroll: true });
  }

  function closeService(fromHistory, then) {
    if (!openId) return;
    openId = null;
    modal.classList.remove('is-open');
    unlock();
    setTimeout(function () { if (!openId) modal.hidden = true; }, reduced ? 0 : 260);
    if (!fromHistory && history.state && history.state.svc) {
      history.back();
    }
    if (then) then();
    else if (modalReturn && modalReturn.focus) modalReturn.focus({ preventScroll: true });
  }

  if (modal) {
    doc.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-svc]');
      if (opener) { e.preventDefault(); openService(opener.getAttribute('data-svc')); return; }
      if (!openId) return;
      if (e.target.closest('[data-svc-close]')) {
        e.preventDefault();
        closeService(false, function () {
          var u = doc.getElementById('uslugi');
          if (u && modalReturn && !u.contains(modalReturn)) u.scrollIntoView();
          else if (modalReturn && modalReturn.focus) modalReturn.focus({ preventScroll: true });
        });
      } else if (e.target.closest('[data-svc-form]')) {
        closeService(false, function () {
          var z = doc.getElementById('zayavka');
          if (z) z.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
          var f = doc.getElementById('f-name');
          if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, reduced ? 0 : 500);
        });
      } else if (e.target.closest('[data-svc-home]')) {
        e.preventDefault();
        closeService(false, function () { window.scrollTo(0, 0); });
      }
    });
    window.addEventListener('popstate', function (e) {
      var id = e.state && e.state.svc;
      if (id && services[id]) openService(id, true);
      else if (openId) closeService(true);
    });
    var m = location.hash.match(/^#usluga-([\w-]+)$/);
    if (m && services[m[1]]) {
      history.replaceState(null, '', location.pathname + location.search);
      openService(m[1]);
    }
  }

  // Esc закрывает меню или оверлей; Tab не выходит за пределы открытого слоя.
  doc.addEventListener('keydown', function (e) {
    var layer = openId ? modal : (menu && menu.classList.contains('is-open') ? menu : null);
    if (!layer) return;
    if (e.key === 'Escape') {
      if (openId) closeService(); else closeMenu();
    } else if (e.key === 'Tab') {
      var f = layer.querySelectorAll('a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- Форма заявки ----------
  doc.querySelectorAll('form[data-source]').forEach(function (form) {
    var err = form.querySelector('[data-form-error]');
    var nameEl = form.querySelector('[name="name"]');
    var phoneEl = form.querySelector('[name="phone"]');
    var taskEl = form.querySelector('[name="task"]');
    var hpEl = form.querySelector('[name="website"]');
    function mark(el, bad) { if (!el) return; if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
    function showError(text) { if (!err) return; err.textContent = text; err.classList.toggle('is-shown', !!text); }
    [nameEl, phoneEl].forEach(function (el) {
      if (el) el.addEventListener('input', function () { if (el.value.trim()) mark(el, false); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameOk = nameEl && nameEl.value.trim().length > 1;
      var phoneOk = phoneEl && phoneEl.value.replace(/\D/g, '').length >= 10;
      mark(nameEl, !nameOk);
      mark(phoneEl, !phoneOk);
      var errors = [];
      if (!nameOk) errors.push('укажите имя');
      if (!phoneOk) errors.push('укажите корректный телефон');
      if (errors.length) {
        showError('Проверьте поля: ' + errors.join(', ') + '.');
        (nameOk ? phoneEl : nameEl).focus();
        return;
      }
      showError('');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('/api/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameEl.value.trim(),
          phone: phoneEl.value.trim(),
          task: taskEl ? taskEl.value.trim() : '',
          source: form.getAttribute('data-source') || 'site',
          website: hpEl ? hpEl.value : ''
        })
      }).then(function (res) {
        return res.json().catch(function () { return { ok: false }; }).then(function (p) {
          if (!res.ok || !p.ok) throw new Error('send_failed');
        });
      }).then(function () {
        if (typeof window.ym === 'function') window.ym(METRIKA_ID, 'reachGoal', 'form_sent');
        var fields = form.querySelector('[data-form-fields]');
        var ok = form.querySelector('[data-form-ok]');
        if (fields) fields.hidden = true;
        if (ok) { ok.classList.add('is-shown'); ok.focus(); }
      }).catch(function () {
        showError('Не удалось отправить заявку. Позвоните +7 (812) 449-93-48 или напишите на info@nic-ecolog.ru.');
        if (btn) btn.disabled = false;
      });
    });
  });
})();
