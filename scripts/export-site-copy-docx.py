#!/usr/bin/env python3
"""Export all site copy to a Word document for client review."""

from __future__ import annotations

import html as html_lib
import re
from datetime import date
from pathlib import Path

from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
HOME = ROOT / "NIC Ecolog - Главная v2.dc.html"
LAB = ROOT / "Ecolog-Lab.html"
OUT_DIR = ROOT / "exports"
OUT_FILE = OUT_DIR / "НИЦ Эколог — контент сайта для вычитки.docx"

SKIP_TAGS = {"script", "style", "svg", "noscript", "template"}
TEXT_TAGS = {
    "h1": "Заголовок H1",
    "h2": "Заголовок H2",
    "h3": "Заголовок H3",
    "h4": "Заголовок H4",
    "p": "Текст",
    "li": "Пункт списка",
    "blockquote": "Цитата",
    "figcaption": "Подпись",
    "label": "Подпись поля",
    "button": "Кнопка",
    "a": "Ссылка / CTA",
    "span": "Текст",
    "td": "Ячейка",
    "th": "Заголовок таблицы",
}


def clean_text(value: str) -> str:
    value = html_lib.unescape(value)
    value = value.replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def is_hidden(el: Tag) -> bool:
    if el.get("aria-hidden") == "true":
        return True
    if el.get("type") == "hidden":
        return True
    if el.name == "image-slot":
        return True
    parent = el.parent
    while parent and isinstance(parent, Tag):
        if parent.get("aria-hidden") == "true":
            return True
        if parent.name in SKIP_TAGS:
            return True
        parent = parent.parent
    return False


def element_label(el: Tag) -> str:
    if el.name in TEXT_TAGS:
        return TEXT_TAGS[el.name]
    if el.name == "input":
        ph = el.get("placeholder")
        return "Плейсхолдер поля" if ph else "Поле ввода"
    if el.name == "textarea":
        return "Плейсхолдер поля"
    if el.name == "option":
        return "Вариант"
    return "Текст"


def collect_blocks(container: Tag) -> list[dict]:
    blocks: list[dict] = []
    seen: set[str] = set()

    def add(kind: str, text: str, note: str = "") -> None:
        text = clean_text(text)
        if not text:
            return
        if kind == "Текст" and len(text) < 2 and not text.isdigit():
            return
        key = f"{kind}|{text}"
        if key in seen:
            return
        seen.add(key)
        blocks.append({"kind": kind, "text": text, "note": note})

    def walk(node) -> None:
        if isinstance(node, Comment):
            return
        if isinstance(node, NavigableString):
            return
        if not isinstance(node, Tag):
            return
        if node.name in SKIP_TAGS:
            return
        if is_hidden(node):
            if node.name == "image-slot":
                ph = node.get("placeholder", "изображение")
                add("Медиа", f"[Изображение: {clean_text(ph)}]")
            return

        if node.name in {"h1", "h2", "h3", "h4", "p", "blockquote", "figcaption", "label", "button", "li"}:
            text = node.get_text(" ", strip=True)
            add(element_label(node), text)
            return

        if node.name == "a" and node.get_text(strip=True):
            href = node.get("href", "")
            add("Ссылка / CTA", node.get_text(" ", strip=True), note=href)
            return

        if node.name == "input":
            ph = node.get("placeholder")
            if ph:
                add("Плейсхолдер поля", ph, note=node.get("name", ""))
            return

        if node.name == "textarea":
            ph = node.get("placeholder")
            if ph:
                add("Плейсхолдер поля", ph, note=node.get("name", ""))
            return

        for child in node.children:
            walk(child)

    walk(container)
    return blocks


def section_title(el: Tag) -> str:
    label = el.get("data-screen-label")
    sid = el.get("id", "")
    if label and sid:
        return f"{label} (#{sid})"
    if label:
        return label
    if sid:
        return f"Раздел #{sid}"
    return el.name or "Блок"


def extract_meta(soup: BeautifulSoup) -> list[dict]:
    blocks = []
    title = soup.find("title")
    if title:
        blocks.append({"kind": "Meta title", "text": clean_text(title.get_text())})
    for name in ("description", "keywords"):
        tag = soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            blocks.append({"kind": f"Meta {name}", "text": clean_text(tag["content"])})
    return blocks


def extract_page(path: Path, page_name: str) -> list[dict]:
    raw = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "lxml")

    sections: list[dict] = []

    meta_blocks = extract_meta(soup)
    if meta_blocks:
        sections.append({"title": "SEO и метаданные", "blocks": meta_blocks})

    # Header / nav (outside main)
    header = soup.find("header")
    if header:
        sections.append({"title": "Шапка и навигация", "blocks": collect_blocks(header)})

    menu = soup.find(id="eco-menu") or soup.find(id="mmenu")
    if menu:
        sections.append({"title": "Мобильное меню", "blocks": collect_blocks(menu)})

    for el in soup.find_all(["section", "footer", "main"]):
        if el.name == "main":
            # children sections captured separately
            if el.find("section"):
                continue
        blocks = collect_blocks(el)
        if not blocks:
            continue
        sections.append({"title": section_title(el), "blocks": blocks})

    # Marquee (not in section)
    for div in soup.find_all("div", recursive=True):
        if div.get("aria-hidden") == "true" and "marquee" in (div.get("style") or ""):
            texts = []
            for span in div.find_all("span"):
                t = clean_text(span.get_text())
                if t and t not in texts and len(t) > 3:
                    texts.append(t)
            if texts:
                sections.insert(2, {
                    "title": "Бегущая строка",
                    "blocks": [{"kind": "Слоган", "text": t, "note": ""} for t in texts],
                })
            break

    return {"page": page_name, "source": path.name, "sections": sections}


def extract_services() -> list[dict]:
    raw = HOME.read_text(encoding="utf-8")
    m = re.search(r"services\s*=\s*\{", raw)
    if not m:
        return []

    start = m.end() - 1
    depth = 0
    end = start
    for i in range(start, len(raw)):
        ch = raw[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    blob = raw[start:end]
    # Parse service entries with regex
    entries = re.findall(
        r"'([a-z0-9-]+)':\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}",
        blob,
        flags=re.DOTALL,
    )
    sections = []
    for key, body in entries:
        def field(name: str) -> str:
            fm = re.search(rf"{name}:\s*'((?:\\'|[^'])*)'", body)
            return clean_text(fm.group(1).replace("\\'", "'")) if fm else ""

        includes = re.findall(r"'((?:\\'|[^'])*)'", body.split("includes:", 1)[1].split("],", 1)[0]) if "includes:" in body else []

        blocks = [
            {"kind": "Группа", "text": field("group")},
            {"kind": "Код услуги", "text": field("abbr")},
            {"kind": "Название", "text": field("name")},
            {"kind": "Лид", "text": field("lead")},
            {"kind": "Срок", "text": field("term")},
            {"kind": "Кому", "text": field("who")},
            {"kind": "Результат", "text": field("result")},
        ]
        for i, step in enumerate(includes, 1):
            blocks.append({"kind": f"Шаг {i}", "text": clean_text(step.replace("\\'", "'"))})

        blocks.append({
            "kind": "Шаблон",
            "text": "Почему мы: Изыскания, лаборатория и документация — одна команда. Измерения выполняет собственная аккредитованная лаборатория «Аналитик Лаб».",
        })
        blocks.append({"kind": "CTA", "text": "Обсудим вашу задачу? Вернёмся с планом работ и оценкой в течение рабочего дня."})
        blocks.append({"kind": "Кнопка", "text": "Оставить заявку"})

        sections.append({
            "title": f"Страница услуги: {field('abbr') or key}",
            "blocks": [b for b in blocks if b["text"]],
        })

    return sections


def set_doc_styles(doc: Document) -> None:
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)
    for level in range(1, 4):
        h = doc.styles[f"Heading {level}"]
        h.font.name = "Calibri"
        h.font.color.rgb = RGBColor(0x0B, 0x5C, 0x60)


def add_cover(doc: Document) -> None:
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("НИЦ «Эколог»\nТекстовый контент сайта — для вычитки")
    run.bold = True
    run.font.size = Pt(20)
    run.font.color.rgb = RGBColor(0x0B, 0x5C, 0x60)

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = sub.add_run(f"Демо-версия · {date.today().strftime('%d.%m.%Y')}\n")
    r.font.size = Pt(11)
    r = sub.add_run("Источник: главная (index) и страница лаборатории (lab.html)")
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0x51, 0x69, 0x6B)

    doc.add_paragraph()
    doc.add_heading("Как пользоваться документом", level=2)
    for item in [
        "Текст сгруппирован по страницам и разделам сайта в порядке прокрутки.",
        "Колонка «Правки заказчика» — для ваших комментариев, замен формулировок и пометок.",
        "Помечены черновые данные: расхождения email/адреса на странице лаборатории (если остались).",
        "Медиа-блоки указаны как [Изображение: …] — подписи к фото можно предложить отдельно.",
        "В конце — полные тексты страниц услуг (открываются по клику на карточку на главной).",
    ]:
        doc.add_paragraph(item, style="List Bullet")

    doc.add_page_break()


def add_blocks_table(doc: Document, blocks: list[dict]) -> None:
    table = doc.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    widths = (Cm(3.2), Cm(10.5), Cm(5.5))
    hdr = table.rows[0].cells
    for cell, text, width in zip(hdr, ("Тип", "Текст на сайте", "Правки заказчика"), widths):
        cell.text = text
        for p in cell.paragraphs:
            for r in p.runs:
                r.bold = True
        cell.width = width

    for block in blocks:
        row = table.add_row().cells
        row[0].text = block["kind"]
        note = block.get("note") or ""
        row[1].text = block["text"] + (f"\n({note})" if note and note.startswith(("#", "tel:", "mailto:", "index", "lab")) else "")
        row[2].text = ""

    doc.add_paragraph()


def build_document() -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    home = extract_page(HOME, "Главная страница")
    lab = extract_page(LAB, "Страница лаборатории «Аналитик Лаб»")
    services = extract_services()

    doc = Document()
    set_doc_styles(doc)
    add_cover(doc)

    for page_data in (home, lab):
        doc.add_heading(page_data["page"], level=1)
        p = doc.add_paragraph(f"Файл-источник: {page_data['source']}")
        p.runs[0].italic = True
        p.runs[0].font.color.rgb = RGBColor(0x7A, 0x8E, 0x8E)

        for section in page_data["sections"]:
            doc.add_heading(section["title"], level=2)
            add_blocks_table(doc, section["blocks"])

        doc.add_page_break()

    doc.add_heading("Страницы услуг (модальные)", level=1)
    doc.add_paragraph(
        "Полные тексты, которые пользователь видит при клике на карточку услуги на главной странице."
    )
    for section in services:
        doc.add_heading(section["title"], level=2)
        add_blocks_table(doc, section["blocks"])

    doc.add_heading("Примечания для согласования", level=1)
    notes = [
        "Телефон на сайте: +7 (812) 449-93-48, email: info@nic-ecolog.ru",
        "На странице лаборатории в форме контактов могут отличаться email/адрес (info@analitik-lab.ru, ул. Дубровская, 13) — сверить с заказчиком.",
        "Номер аттестата аккредитации: RA.RU.516478 от 25.12.2025 (PDF: assets/docs/attestat-akkreditacii.pdf).",
        "Отзывы клиентов (Марина К., Дмитрий В.) — подтвердить возможность публикации или заменить.",
        "Проекты портфеля — проверить формулировки описаний и разрешения на упоминание объектов.",
    ]
    for note in notes:
        doc.add_paragraph(note, style="List Bullet")

    doc.save(OUT_FILE)
    return OUT_FILE


if __name__ == "__main__":
    path = build_document()
    print(f"Создан файл: {path}")
