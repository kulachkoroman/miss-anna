"use client";

import { useRef, type ElementType } from "react";
import { useInView } from "framer-motion";
import clsx from "clsx";

/**
 * Заголовок, который появляется по словам — приём с лендинга Давида.
 *
 * Каждое слово выезжает из-под «шторки» с небольшой задержкой. Ключевые
 * слова (highlight) красятся цветом бренда и, по желанию, получают маркер,
 * который прорисовывается после того, как доехали слова.
 *
 * Для скринридеров текст читается целиком из aria-label: разбивка на слова
 * нужна только глазу.
 */

type Tone = "primary" | "accent" | "white" | "inherit";

const tones: Record<Tone, string> = {
  primary: "text-[var(--color-primary)]",
  accent: "text-[var(--color-accent)]",
  white: "text-white",
  inherit: "",
};

type Token = { word: string; hl: boolean };

/** Разбивает текст на слова и отмечает те, что попадают в выделенную часть. */
function tokenize(text: string, highlight?: string): Token[] {
  const start = highlight ? text.indexOf(highlight) : -1;
  const end = start >= 0 && highlight ? start + highlight.length : -1;

  const raw: Array<{ word: string; from: number; to: number }> = [];
  const re = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    raw.push({ word: match[0], from: match.index, to: match.index + match[0].length });
  }

  /*
    Правило русской типографики: короткие предлоги и союзы («в», «с», «по», «и»)
    не остаются в конце строки. Склеиваем их со следующим словом через
    неразрывный пробел — дальше пара ведёт себя как одно слово.
  */
  const merged: typeof raw = [];
  for (let i = 0; i < raw.length; i++) {
    /* Тире не начинает строку: приклеиваем его к предыдущему слову. */
    if (/^[—–]$/.test(raw[i].word) && merged.length > 0) {
      const previous = merged[merged.length - 1];
      previous.word = `${previous.word} ${raw[i].word}`;
      previous.to = raw[i].to;
      continue;
    }
    const current = { ...raw[i] };
    while (current.word.length <= 2 && /^[а-яё]+$/i.test(current.word) && i + 1 < raw.length) {
      const next = raw[++i];
      current.word = `${current.word} ${next.word}`;
      current.to = next.to;
    }
    merged.push(current);
  }

  return merged.map(({ word, from, to }) => ({
    word,
    hl: start >= 0 && from < end && to > start,
  }));
}

export default function SplitText({
  text,
  as: Tag = "h2",
  highlight,
  /** Цвет выделенных слов. */
  tone = "primary",
  /** true — под выделенными словами рисуется маркер. */
  marker = false,
  /** true — анимировать сразу при загрузке (первый экран). */
  immediate = false,
  /** Задержка всей группы, мс. */
  delay = 0,
  className,
}: {
  text: string;
  as?: ElementType;
  highlight?: string;
  tone?: Tone;
  marker?: boolean;
  immediate?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35, margin: "0px 0px 15% 0px" });
  const shown = immediate || inView;

  const tokens = tokenize(text, highlight);

  /* Выделенные слова идут подряд: собираем их в одну группу, чтобы
     маркер был сплошным, а не рвался на каждом пробеле. */
  const groups: Array<{ hl: boolean; tokens: Array<Token & { index: number }> }> = [];
  tokens.forEach((token, index) => {
    const last = groups[groups.length - 1];
    if (last && last.hl === token.hl) last.tokens.push({ ...token, index });
    else groups.push({ hl: token.hl, tokens: [{ ...token, index }] });
  });

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={clsx("split", shown && "in", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {groups.map((group, g) => {
        const words = group.tokens.map((token, k) => (
          <span key={token.index}>
            <span aria-hidden className="w">
              <span className="wi" style={{ "--i": token.index } as React.CSSProperties}>
                {token.word}
              </span>
            </span>
            {/* пробел между словами, кроме последнего в группе */}
            {k < group.tokens.length - 1 ? " " : null}
          </span>
        ));

        return (
          <span key={g}>
            {g > 0 ? " " : null}
            {group.hl ? (
              <span className={clsx(tones[tone], marker && "hl")}>{words}</span>
            ) : (
              words
            )}
          </span>
        );
      })}
    </Tag>
  );
}
