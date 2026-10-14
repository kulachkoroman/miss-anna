import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getDeckSummaries, getMistakes, getStreak } from "@/lib/words/stats";
import { INTERVAL_DAYS } from "@/lib/words/schedule";
import { DECKS } from "@/lib/words/cards";
import { plural } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Словарные слова" };

const startBtn =
  "inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-6 py-2.5 font-bold text-white " +
  "shadow-hard transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[var(--color-primary-dark)] active:shadow-hard-sm";

/**
 * Тренажёр словарных слов: две колоды, прогресс, «трудные слова».
 * Доступен любому зарегистрированному — запись на курс не нужна.
 */
export default async function WordsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [decks, streak, mistakes] = await Promise.all([
    getDeckSummaries(user.id),
    getStreak(user.id),
    getMistakes(user.id, 16),
  ]);
  const learned = decks.reduce((n, d) => n + d.learned, 0);
  const total = decks.reduce((n, d) => n + d.total, 0);
  const unlearnedMistakes = mistakes.filter((m) => !m.learned);

  return (
    <div className="space-y-10">
      <Reveal>
        <section className="rounded-hero border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-7 shadow-hard-lg sm:p-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge>Тренажёр</Badge>
              <h1 className="mt-4 text-h2 text-[var(--color-ink)]">Словарные слова</h1>
              <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
                5–10 минут в день. Сайт сам решает, что повторить: трудные слова возвращаются чаще,
                выученные — всё реже, пока не запомнятся насовсем.
              </p>
            </div>
            <dl className="flex gap-8">
              <div>
                <dt className="text-caption text-[var(--color-ink-muted)]">Выучено</dt>
                <dd className="font-display text-h3 font-bold text-[var(--color-ink)]">
                  {learned}
                  <span className="text-[var(--color-ink-muted)]">/{total}</span>
                </dd>
              </div>
              <div>
                <dt className="text-caption text-[var(--color-ink-muted)]">Дней подряд</dt>
                <dd className="font-display text-h3 font-bold text-[var(--color-ink)]">{streak}</dd>
              </div>
            </dl>
          </div>
        </section>
      </Reveal>

      <RevealGroup stagger={0.1} className="grid gap-6 md:grid-cols-2">
        {decks.map((d) => {
          const today = d.reviewToday + d.freshToday;
          const percent = d.total ? Math.round((d.learned / d.total) * 100) : 0;
          return (
            <RevealItem key={d.deck} className="h-full">
              <article className="flex h-full flex-col rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-6 shadow-hard sm:p-7">
                <h2 className="text-h3 text-[var(--color-ink)]">{d.title}</h2>
                <p className="mt-2 text-[0.9375rem] text-[var(--color-ink-soft)]">
                  {DECKS.find((x) => x.id === d.deck)?.description}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
                    <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="font-display text-caption font-bold text-[var(--color-ink)]">{percent}%</span>
                </div>
                <p className="mt-2 text-caption text-[var(--color-ink-soft)]">
                  Выучено {d.learned} из {d.total} · в работе {d.inProgress}
                </p>

                <div className="mt-6 flex flex-1 flex-wrap items-end justify-between gap-4 border-t-2 border-dashed border-[var(--color-border-strong)] pt-5">
                  <p className="text-[0.9375rem] text-[var(--color-ink)]">
                    {today === 0 ? (
                      <>На сегодня всё — приходите завтра</>
                    ) : (
                      <>
                        Сегодня: <b>{d.reviewToday}</b> на повтор
                        {" + "}
                        <b>{d.freshToday}</b> {plural(d.freshToday, ["новое", "новых", "новых"])}
                      </>
                    )}
                  </p>
                  {today > 0 && (
                    <Link href={`/cabinet/words/${d.deck}`} className={startBtn}>
                      <Icon name="play" className="h-4 w-4" />
                      Начать
                    </Link>
                  )}
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal>
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "target" as const, title: "Отвечайте", text: "Выберите букву или как пишется слово — слитно, раздельно, через дефис." },
            { icon: "refresh" as const, title: "Ошиблись — не страшно", text: "Слово вернётся в конце занятия и завтра, пока не запомнится." },
            {
              icon: "clock" as const,
              title: "Верно — реже",
              text: `Следующий повтор через ${INTERVAL_DAYS.slice(1).join(", ")} дней. После этого слово выучено.`,
            },
          ].map((s) => (
            <div key={s.title} className="rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-surface-alt)] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--color-ink)] bg-white text-[var(--color-primary)]">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 font-bold text-[var(--color-ink)]">{s.title}</p>
              <p className="mt-1 text-caption text-[var(--color-ink-soft)]">{s.text}</p>
            </div>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section>
          <h2 className="text-h3 text-[var(--color-ink)]">Мои трудные слова</h2>
          {unlearnedMistakes.length === 0 ? (
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Пока пусто. Здесь появятся слова, в которых вы ошибались.
            </p>
          ) : (
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {unlearnedMistakes.map((m) => (
                <li
                  key={m.cardId}
                  className="flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-white py-1.5 pl-4 pr-1.5 font-semibold text-[var(--color-ink)]"
                >
                  {m.word}
                  <span className="rounded-full bg-[#fdf0f0] px-2 py-0.5 text-caption font-bold text-[var(--color-danger)]">
                    ×{m.wrong}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>
    </div>
  );
}
