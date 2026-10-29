/**
 * Minimal Markdown → HTML for blog articles (no dependencies).
 * Supports: ## / ### headings, paragraphs, "-" bullet lists, "1." ordered lists,
 * pipe tables, **bold** and [links](/path). Everything else is escaped as text.
 */
import { esc } from './service-page-template.mjs';

function inline(text) {
  let out = '';
  const re = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    out += esc(text.slice(last, m.index));
    if (m[2] !== undefined) {
      out += `<strong>${esc(m[2])}</strong>`;
    } else {
      const href = m[4];
      const external = /^https?:\/\//.test(href);
      out += `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(m[3])}</a>`;
    }
    last = m.index + m[0].length;
  }
  // Номера законов («7-ФЗ», «342-ФЗ») не рвём по дефису
  return (out + esc(text.slice(last))).replace(/(\d+-ФЗ)/g, '<span class="nw">$1</span>');
}

// Ячейка таблицы: «да» — с фирменной точкой, «нет» / «—» — приглушённо; колонка «Норма …» — ссылки на статьи закона.
function cell(text, { ref } = {}) {
  const t = text.trim();
  if (/^да$/i.test(t)) return '<td><span class="tbl-yes">да</span></td>';
  if (/^(нет|—|-)$/i.test(t)) return `<td><span class="tbl-no">${esc(t)}</span></td>`;
  return `<td${ref ? ' class="tbl-ref"' : ''}>${inline(t)}</td>`;
}

const cellsOf = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const isTableSep = (line) => /^\|?\s*:?-{2,}/.test(line.trim()) && /^[|\s:-]+$/.test(line.trim());

export function renderMarkdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const html = [];
  let para = [];
  const flush = () => {
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { flush(); continue; }

    const h = line.match(/^(#{2,3}) (.+)$/);
    if (h) {
      flush();
      const tag = h[1].length === 2 ? 'h2' : 'h3';
      html.push(`<${tag}>${inline(h[2])}</${tag}>`);
      continue;
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      flush();
      const head = cellsOf(line);
      i += 1;
      const rows = [];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
        i += 1;
        rows.push(cellsOf(lines[i]));
      }
      html.push(
        `<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>` +
          rows.map((r) => `<tr>${r.map((c, j) => cell(c, { ref: /^норма(\s|$)/i.test(head[j] || '') })).join('')}</tr>`).join('') +
          '</tbody></table></div>'
      );
      continue;
    }

    const list = line.match(/^(- |\d+\. )(.+)$/);
    if (list) {
      flush();
      const ordered = list[1] !== '- ';
      const items = [];
      // An item may continue on following indented lines ("  - sub" → nested list).
      while (i < lines.length) {
        const cur = lines[i].match(ordered ? /^\d+\. (.+)$/ : /^- (.+)$/);
        if (!cur) break;
        let item = inline(cur[1]);
        const sub = [];
        while (i + 1 < lines.length && /^\s{2,}- /.test(lines[i + 1])) {
          i += 1;
          sub.push(`<li>${inline(lines[i].replace(/^\s+- /, ''))}</li>`);
        }
        if (sub.length) item += `<ul>${sub.join('')}</ul>`;
        items.push(`<li>${item}</li>`);
        i += 1;
      }
      i -= 1;
      const tag = ordered ? 'ol' : 'ul';
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    para.push(line.trim());
  }
  flush();
  return html.join('\n');
}
