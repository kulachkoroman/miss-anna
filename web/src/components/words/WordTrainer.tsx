"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { answerCardAction } from "@/lib/actions/words";
import { JOIN_LABELS, type AnswerResult, type JoinAnswer, type PublicCard } from "@/lib/words/public";
import { plural } from "@/lib/format";
import { EASE } from "@/lib/motion";

/**
 * Занятие в тренажёре словарных слов.
 *
 * Карточки приходят без ответов: ученик выбирает вариант, сервер проверяет
 * и сохраняет прогресс. Ошибка — слово уходит в конец занятия ещё раз
 * (повтор только для тренировки, в расписание идёт первый ответ).
 * С клавиатуры: 1/2/3 — варианты, Enter — дальше.
 */

type Item = { card: PublicCard; retry: boolean };
type Done = Extract<AnswerResult, { ok: true }>;

const JOIN_ORDER: JoinAnswer[] = ["С", "Р", "Д"];

/* Кнопка без сдвига под курсором: меняется только фон, мягко. */
const optionBase =
  "flex min-h-14 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-white px-5 font-display " +
  "font-bold text-[var(--color-ink)] shadow-hard-sm transition-[background-color,box-shadow] duration-300 ease-out " +
  "hover:bg-[var(--color-primary-tint)] active:shadow-none disabled:cursor-default " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-6 py-3 " +
  "font-bold text-white shadow-hard transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[var(--color-primary-dark)] " +
  "active:shadow-hard-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]";

export default function WordTrainer({ deckTitle, cards }: { deckTitle: string; cards: PublicCard[] }) {
  const [queue, setQueue] = useState<Item[]>(() => cards.map((card) => ({ card, retry: false })));
  const [pos, setPos] = useState(0);
  const [picks, setPicks] = useState<(string | null)[]>([]);
  const [result, setResult] = useState<Done | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [firstTry, setFirstTry] = useState({ right: 0, total: 0 });
  const [missed, setMissed] = useState<string[]>([]);
  const [learnedNow, setLearnedNow] = useState(0);

  const item = queue[pos] as Item | undefined;
  const card = item?.card;
  const finished = pos >= queue.length;

  const submit = useCallback(
    (given: string[]) => {
      if (!item) return;
      setError(null);
      startTransition(async () => {
        const res = await answerCardAction(item.card.id, given).catch(() => null);
        if (!res || !res.ok) {
          setError(res?.error ?? "Нет связи с сайтом. Проверьте интернет и нажмите ещё раз.");
          return;
        }
        setResult(res);
        if (!item.retry) {
          setFirstTry((s) => ({ right: s.right + (res.correct ? 1 : 0), total: s.total + 1 }));
          if (!res.correct) setMissed((m) => [...m, res.word]);
        }
        if (res.learned) setLearnedNow((n) => n + 1);
        if (!res.correct) setQueue((q) => [...q, { card: item.card, retry: true }]);
      });
    },
    [item]
  );

  const choose = useCallback(
    (gap: number, option: string) => {
      if (!card || result || pending) return;
      if (card.kind === "join") {
        setPicks([option]);
        submit([option]);
        return;
      }
      const next = [...(picks.length ? picks : card.options.map(() => null))];
      next[gap] = option;
      setPicks(next);
      if (next.every((p) => p !== null)) submit(next as string[]);
    },
    [card, result, pending, picks, submit]
  );

  const goNext = useCallback(() => {
    setPos((p) => p + 1);
    setPicks([]);
    setResult(null);
    setError(null);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (result && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        goNext();
        return;
      }
      if (!card || result) return;
      const n = Number(e.key);
      if (!n) return;
      if (card.kind === "join" && n <= 3) choose(0, JOIN_ORDER[n - 1]);
      if (card.kind === "gap") {
        // Пропуски по очереди: сначала первый незаполненный.
        const gap = card.options.findIndex((_, i) => !picks[i]);
        const option = card.options[gap === -1 ? 0 : gap]?.[n - 1];
        if (option) choose(gap === -1 ? 0 : gap, option);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, result, picks, choose, goNext]);

  if (queue.length === 0 || finished) {
    return <Finish deckTitle={deckTitle} firstTry={firstTry} missed={missed} learnedNow={learnedNow} empty={queue.length === 0} />;
  }

  const shown = Math.min(pos + 1, queue.length);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4 text-caption font-semibold text-[var(--color-ink-soft)]">
        <Link href="/cabinet/words" className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink)]">
          <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
          {deckTitle}
        </Link>
        <span>
          {shown} из {queue.length}
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500 ease-out"
          style={{ width: `${Math.round((pos / queue.length) * 100)}%` }}
        />
      </div>

      <motion.section
        key={pos}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE.out }}
        className="mt-6 rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-6 shadow-hard-lg sm:p-10"
      >
        <p className="text-center text-caption font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          {item!.retry
            ? "Ещё раз — это слово было с ошибкой"
            : card!.kind === "gap"
              ? "Какая буква пропущена?"
              : "Как пишется?"}
        </p>

        <WordView card={card!} picks={picks} result={result} />

        {card!.kind === "gap" && card!.note && (
          <p className="mt-2 text-center text-caption text-[var(--color-ink-muted)]">{card!.note}</p>
        )}

        {!result && (
          <div className="mt-8 space-y-4">
            {card!.kind === "join" ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {JOIN_ORDER.map((a, i) => (
                  <button key={a} type="button" disabled={pending} onClick={() => choose(0, a)} className={optionBase}>
                    <span className="mr-2 hidden text-caption text-[var(--color-ink-muted)] sm:inline">{i + 1}</span>
                    {JOIN_LABELS[a]}
                  </button>
                ))}
              </div>
            ) : (
              card!.options.map((pair, gap) => (
                <div key={gap}>
                  {card!.options.length > 1 && (
                    <p className="mb-2 text-caption font-semibold text-[var(--color-ink-soft)]">{gap + 1}-й пропуск</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {pair.map((option, i) => (
                      <button
                        key={option}
                        type="button"
                        disabled={pending}
                        onClick={() => choose(gap, option)}
                        className={clsx(
                          optionBase,
                          "text-h3",
                          picks[gap] === option && "bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary-soft)]"
                        )}
                      >
                        <span className="mr-3 hidden text-caption text-[var(--color-ink-muted)] sm:inline">{i + 1}</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-[var(--color-danger)]">{error}</p>
            <button type="button" className={primaryBtn} onClick={() => submit(picks as string[])}>
              <Icon name="refresh" className="h-4 w-4" />
              Проверить ещё раз
            </button>
          </div>
        )}

        {result && <Feedback card={card!} picks={picks} result={result} onNext={goNext} />}
      </motion.section>
    </div>
  );
}

/** Слово: при ответе — пропуски, после — правильное написание с подсветкой. */
function WordView({ card, picks, result }: { card: PublicCard; picks: (string | null)[]; result: Done | null }) {
  if (card.kind === "join") {
    return (
      <p className="mt-6 text-center font-display text-[clamp(1.75rem,1.2rem+3vw,3rem)] font-bold leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
        {result ? (
          result.word
        ) : (
          <>
            {card.before}
            <span className="text-[var(--color-primary)]">({card.paren})</span>
            {card.after}
          </>
        )}
      </p>
    );
  }
  return (
    <p className="mt-6 text-center font-display text-[clamp(1.75rem,1.2rem+3vw,3rem)] font-bold leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
      {card.segments.map((s, i) => {
        if ("text" in s) return <span key={i}>{s.text}</span>;
        const letter = result ? result.right[s.gap] : picks[s.gap];
        return (
          <span
            key={i}
            className={clsx(
              "mx-0.5 inline-block min-w-[1.1em] rounded-lg border-b-4 px-1 transition-colors duration-300",
              result
                ? "border-[var(--color-success)] bg-[#e3f6ee] text-[var(--color-success)]"
                : letter
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-ink-muted)] text-transparent"
            )}
          >
            {letter ?? "_"}
          </span>
        );
      })}
    </p>
  );
}

function Feedback({
  card,
  picks,
  result,
  onNext,
}: {
  card: PublicCard;
  picks: (string | null)[];
  result: Done;
  onNext: () => void;
}) {
  const yours =
    card.kind === "join"
      ? JOIN_LABELS[picks[0] as JoinAnswer]
      : card.segments.map((s) => ("text" in s ? s.text : picks[s.gap])).join("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE.out }}
      className="mt-8"
    >
      <div
        className={clsx(
          "rounded-card border-2 p-5 text-center",
          result.correct ? "border-[var(--color-success)] bg-[#effaf5]" : "border-[var(--color-danger)] bg-[#fdf0f0]"
        )}
      >
        <p className={clsx("font-bold", result.correct ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
          {result.correct ? (result.learned ? "Верно! Слово выучено" : "Верно!") : "Ошибка — запомните, как правильно"}
        </p>
        {card.kind === "join" && (
          <p className="mt-1 text-[var(--color-ink-soft)]">Пишется {JOIN_LABELS[result.right[0] as JoinAnswer]}.</p>
        )}
        {!result.correct && <p className="mt-1 text-caption text-[var(--color-ink-soft)]">Ваш ответ: {yours}. Слово вернётся в конце занятия и завтра.</p>}
        {result.hint && <p className="mt-3 font-hand text-2xl leading-tight text-[var(--color-ink)]">{result.hint}</p>}
      </div>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onNext} autoFocus className={primaryBtn}>
          Дальше
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function Finish({
  deckTitle,
  firstTry,
  missed,
  learnedNow,
  empty,
}: {
  deckTitle: string;
  firstTry: { right: number; total: number };
  missed: string[];
  learnedNow: number;
  empty: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE.out }}
      className="mx-auto max-w-2xl rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-8 text-center shadow-hard-lg sm:p-12"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-white shadow-hard-sm">
        <Icon name="check" className="h-7 w-7" strokeWidth={2.6} />
      </span>
      <h1 className="mt-6 text-h2 text-[var(--color-ink)]">{empty ? "На сегодня всё" : "Занятие пройдено"}</h1>
      <p className="mx-auto mt-3 max-w-md text-[var(--color-ink-soft)]">
        {empty
          ? `В колоде «${deckTitle}» сегодня нечего повторять. Новые слова и повторы появятся завтра.`
          : `Верно с первого раза: ${firstTry.right} из ${firstTry.total}.`}
        {learnedNow > 0 && ` Выучено сегодня: ${learnedNow} ${plural(learnedNow, ["слово", "слова", "слов"])}.`}
      </p>

      {missed.length > 0 && (
        <div className="mx-auto mt-8 max-w-md rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-surface-alt)] p-5 text-left">
          <p className="font-semibold text-[var(--color-ink)]">Слова с ошибкой — вернутся завтра</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {missed.map((w) => (
              <li key={w} className="rounded-full border-2 border-[var(--color-ink)] bg-white px-3 py-1 font-semibold text-[var(--color-ink)]">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/cabinet/words" className={clsx(primaryBtn, "mt-8")}>
        К словарным словам
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}
