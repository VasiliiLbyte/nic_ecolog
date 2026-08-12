# Перенос nic-ecolog.ru на GitHub Pages

Сейчас: сайт на **Cloudflare** (NS `elsa`/`drew.ns.cloudflare.com`).  
Цель: отдавать сайт с **GitHub Pages**, домен `https://nic-ecolog.ru`.

Репозиторий уже готов:
- деплой: `.github/workflows/deploy-pages.yml` (push в `main`)
- сборка пишет `docs/CNAME` → `nic-ecolog.ru`
- canonical / sitemap / robots → `https://nic-ecolog.ru`

Демо без кастомного домена: https://vasiliilbyte.github.io/nic_ecolog/

---

## Часть A — что сделать в GitHub (UI, 2 минуты)

1. Откройте: https://github.com/VasiliiLbyte/nic_ecolog/settings/pages  
2. **Build and deployment → Source:** `GitHub Actions` (уже должно быть).  
3. **Custom domain:** введите `nic-ecolog.ru` → **Save**.  
4. Дождитесь зелёной галочки DNS (после части B).  
5. Включите **Enforce HTTPS** (появится после успешной проверки DNS, иногда через 5–30 мин).

Проверка API (опционально):

```bash
gh api repos/VasiliiLbyte/nic_ecolog/pages
# ожидаем: "cname": "nic-ecolog.ru"
```

---

## Часть B — DNS (главное)

### Рекомендуемый путь: DNS остаётся в Cloudflare, но **без прокси** (серое облако)

Проблемы без VPN чаще даёт **оранжевое облако Cloudflare (прокси/CDN)**, а не сам домен.  
Оставляем Cloudflare только как DNS-хостинг и указываем на GitHub.

В [Cloudflare Dashboard](https://dash.cloudflare.com) → домен `nic-ecolog.ru` → **DNS → Records**:

#### 1) Apex `nic-ecolog.ru` — записи типа **A**

Удалите старые A/AAAA/CNAME на Cloudflare Pages / Workers / чужие IP.  
Создайте **четыре** A-записи (все на `@` / `nic-ecolog.ru`):

| Type | Name | Content              | Proxy status      |
|------|------|----------------------|-------------------|
| A    | `@`  | `185.199.108.153`    | **DNS only** (серое) |
| A    | `@`  | `185.199.109.153`    | **DNS only** |
| A    | `@`  | `185.199.110.153`    | **DNS only** |
| A    | `@`  | `185.199.111.153`    | **DNS only** |

Опционально IPv6 (**AAAA**), тоже **DNS only**:

| Type | Name | Content |
|------|------|---------|
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

#### 2) `www` — **CNAME** на GitHub

| Type  | Name  | Content                         | Proxy status |
|-------|-------|---------------------------------|--------------|
| CNAME | `www` | `vasiliilbyte.github.io`        | **DNS only** |

> Имя пользователя в CNAME — **ваш** GitHub: `vasiliilbyte.github.io` (без пути `/nic_ecolog`).

#### 3) Отключить старый хостинг на Cloudflare

Если сайт жил на **Cloudflare Pages / Workers / Redirect**:
- Pages: проект → Settings → удалить Custom domain `nic-ecolog.ru` / `www`
- или отключить Worker-маршрут на этот hostname  
Иначе Cloudflare продолжит отдавать старую версию.

#### 4) SSL/TLS в Cloudflare (если DNS остаётся там)

**SSL/TLS → Overview:** режим **Full** (не Flexible).  
Раз прокси выключен (серое облако), сертификат будет выдавать уже **GitHub**.

---

### Альтернатива: уйти с Cloudflare полностью (если даже DNS/NS плохо открывается)

1. У регистратора домена (где куплен `nic-ecolog.ru`) смените **Nameservers** с Cloudflare на DNS регистратора (или другой DNS, например Reg.ru / Timeweb / Cloudflare **не** обязателен).  
2. В панели регистратора создайте те же A / AAAA / CNAME, что в таблицах выше.  
3. В Cloudflare домен можно оставить «parked» или удалить из аккаунта после смены NS.

Пропагация NS: обычно **1–24 часа** (иногда до 48).

---

## Часть C — проверка

Подождите 5–30 минут после DNS, затем:

```bash
# Должны быть IP GitHub, НЕ 104.21.* / 172.67.* (это Cloudflare)
dig +short nic-ecolog.ru A
# ожидаем что-то из: 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153

dig +short www.nic-ecolog.ru CNAME
# ожидаем: vasiliilbyte.github.io.

# Заголовки: server: GitHub.com (не cloudflare)
curl -sI https://nic-ecolog.ru/ | head -20
curl -sI https://www.nic-ecolog.ru/ | head -20
```

В браузере (лучше в режиме инкогнито / без VPN и с VPN — оба сценария):
- https://nic-ecolog.ru/
- https://nic-ecolog.ru/lab.html
- https://www.nic-ecolog.ru/ → должен открыть тот же сайт (GitHub сам редиректит www↔apex после настройки)

---

## Часть D — деплой контента

После любого изменения сайта:

```bash
cd "/Users/vasilii/Desktop/code /nic_ecolog"
git add -A
git status
git commit -m "…"   # по необходимости
git push origin main
```

Workflow **Deploy GitHub Pages** соберёт `docs/` (включая `CNAME`) и опубликует.  
Следить: https://github.com/VasiliiLbyte/nic_ecolog/actions

Локально перед пушем:

```bash
npm run pages:build
npm run pages:preview   # http://127.0.0.1:8766/
```

---

## Частые проблемы

| Симптом | Что проверить |
|---------|----------------|
| «Domain does not resolve to GitHub Pages» | A-записи не те / ещё оранжевое облако / старый CNAME на Cloudflare Pages |
| HTTPS не включается | Подождите до часа; Enforce HTTPS только после зелёного DNS |
| Открывается старый сайт | В Cloudflare ещё прокси или Pages custom domain не снят |
| 404 на `/lab.html` | Дождитесь успешного Actions deploy; проверьте артефакт |
| Почта `@nic-ecolog.ru` | **Не трогайте** MX/TXT для почты при смене A/CNAME |

---

## Краткий чеклист

- [ ] GitHub → Settings → Pages → Custom domain = `nic-ecolog.ru`
- [ ] Cloudflare DNS: 4×A (и опц. AAAA) на GitHub IP, **DNS only**
- [ ] CNAME `www` → `vasiliilbyte.github.io`, **DNS only**
- [ ] Снят custom domain со старого Cloudflare Pages/Workers
- [ ] `dig` показывает GitHub IP, `curl -sI` → `server: GitHub.com`
- [ ] Enforce HTTPS включён
- [ ] Проверены главная и `/lab.html` без VPN
