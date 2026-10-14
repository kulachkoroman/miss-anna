import { Fragment } from "react";
import clsx from "clsx";

/**
 * Текст курса (конспект, ответы, темы пробника) — из упрощённого markdown.
 *
 * Формат материалов Анны простой, поэтому без библиотеки:
 *   «# Урок 1 Главное»   — начало части урока, крупная плашка;
 *   «# Заголовок»        — заголовок раздела;
 *   «1.1. Текст»         — задание с номером;
 *   «А. Вариант»         — вариант ответа внутри задания;
 *   «Мой ответ: ____»    — строка для записи в тетради;
 *   «1. Тема»            — пункт нумерованного списка (темы пробника);
 *   остальные строки     — абзацы. Ссылки становятся кликабельными.
 */

type Block =
  | { type: "part"; text: string }
  | { type: "heading"; text: string }
  | { type: "task"; num: string; text: string; options: string[]; blanks: string[] }
  | { type: "item"; num: string; text: string }
  | { type: "p"; text: string };

const TASK = /^(\d+\.\d+\.)\s+(.*)$/;
const OPTION = /^([А-ЯЁA-Z])\.\s+(.*)$/;
const ITEM = /^(\d+)\.\s+(.*)$/;
const BLANK = /^(.*?):\s*_{5,}\s*$/;

function parse(body: string): Block[] {
  const blocks: Block[] = [];
  let task: Extract<Block, { type: "task" }> | null = null;

  for (const raw of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("# ")) {
      task = null;
      const text = line.slice(2).trim();
      blocks.push({ type: /^Урок \d/.test(text) ? "part" : "heading", text });
      continue;
    }

    const t = line.match(TASK);
    if (t) {
      task = { type: "task", num: t[1].replace(/\.$/, ""), text: t[2], options: [], blanks: [] };
      blocks.push(task);
      continue;
    }

    if (task) {
      const o = line.match(OPTION);
      if (o) {
        task.options.push(line);
        continue;
      }
      const b = line.match(BLANK);
      if (b) {
        task.blanks.push(b[1]);
        continue;
      }
    }

    const it = line.match(ITEM);
    if (it) {
      task = null;
      blocks.push({ type: "item", num: it[1], text: it[2] });
      continue;
    }

    task = null;
    blocks.push({ type: "p", text: line });
  }
  return blocks;
}

/** Ссылки в тексте — кликабельные, открываются в новой вкладке. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-semibold text-[var(--color-primary)] underline decoration-2 underline-offset-2"
          >
            {part.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

export default function CourseText({ body, className }: { body: string; className?: string }) {
  const blocks = parse(body);

  return (
    <div className={clsx("text-[1.0625rem] leading-[1.75] text-[var(--color-ink-soft)]", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "part":
            return (
              <p
                key={i}
                className={clsx(
                  "inline-flex rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-4 py-1.5 font-display text-[0.875rem] font-bold text-[var(--color-ink)]",
                  i > 0 && "mt-12"
                )}
              >
                {b.text}
              </p>
            );
          case "heading":
            return (
              <h2 key={i} className="mt-9 text-h4 text-[var(--color-ink)] first:mt-0">
                {b.text}
              </h2>
            );
          case "task":
            return (
              <div key={i} className="mt-5 rounded-card border-2 border-[var(--color-ink)] bg-white p-5 shadow-hard-sm">
                <p>
                  <span className="mr-2 inline-flex rounded-lg bg-[var(--color-primary)] px-2 py-0.5 font-display text-[0.8125rem] font-bold text-white">
                    {b.num}
                  </span>
                  <span className="text-[var(--color-ink)]">
                    <Linkified text={b.text} />
                  </span>
                </p>
                {b.options.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-l-2 border-[var(--color-accent)] pl-4">
                    {b.options.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                )}
                {b.blanks.map((label) => (
                  <div key={label} className="mt-3">
                    <p className="text-caption font-semibold text-[var(--color-ink-muted)]">{label} — запиши в тетради</p>
                    <div className="mt-1.5 h-9 rounded-lg border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-alt)]" />
                  </div>
                ))}
              </div>
            );
          case "item":
            return (
              <p key={i} className="mt-3 flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-white font-display text-[0.8125rem] font-bold text-[var(--color-ink)]">
                  {b.num}
                </span>
                <span className="pt-0.5 font-medium text-[var(--color-ink)]">
                  <Linkified text={b.text} />
                </span>
              </p>
            );
          default:
            return (
              <p key={i} className="mt-4 first:mt-0">
                <Linkified text={b.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
