import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, plural } from "@/lib/format";
import { setPersonalStudentAction } from "@/lib/actions/admin/students";
import { getActivity, getDeckSummaries, getMistakes, getStreak } from "@/lib/words/stats";

/**
 * Статистика ученика по тренажёру словарных слов: прогресс по колодам,
 * активность за две недели и слова с ошибками (их можно скачать таблицей).
 */
export default async function AdminStudentWordsPage(props: PageProps<"/admin/students/[id]">) {
  const { id } = await props.params;
  const user = await prisma.user.findFirst({
    where: { id, role: { in: ["STUDENT", "PARENT"] } },
    select: { id: true, name: true, studentName: true, role: true, phone: true, email: true, isPersonalStudent: true },
  });
  if (!user) notFound();

  const [decks, activity, streak, mistakes] = await Promise.all([
    getDeckSummaries(user.id),
    getActivity(user.id, 14),
    getStreak(user.id),
    getMistakes(user.id),
  ]);
  const maxDay = Math.max(1, ...activity.map((d) => d.correct + d.wrong));
  const activeDays = activity.filter((d) => d.correct + d.wrong > 0).length;

  return (
    <div className="max-w-5xl">
      <Link href="/admin/students" className="text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
        ← Ученики
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">
            {user.role === "PARENT" ? `${user.studentName} (родитель: ${user.name})` : user.name}
          </h1>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {[user.phone, user.email].filter(Boolean).join(" · ") || "Без контактов"}
          </p>
        </div>
        <form action={setPersonalStudentAction.bind(null, user.id, !user.isPersonalStudent)}>
          <button
            type="submit"
            className="rounded-full border-2 border-[var(--color-ink)] bg-white px-4 py-1.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-primary-tint)]"
          >
            {user.isPersonalStudent ? "Мой ученик ✓ — снять метку" : "Отметить: мой ученик"}
          </button>
        </form>
      </div>

      <h2 className="mt-8 text-lg font-bold text-[var(--color-ink)]">Словарные слова</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {decks.map((d) => {
          const percent = d.total ? Math.round((d.learned / d.total) * 100) : 0;
          return (
            <div key={d.deck} className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5">
              <p className="font-semibold text-[var(--color-ink)]">{d.title}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
                  <div className="h-full bg-[var(--color-primary)]" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-sm font-bold">{percent}%</span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-[var(--color-ink-muted)]">Выучено</dt>
                  <dd className="font-bold">{d.learned} из {d.total}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--color-ink-muted)]">В работе</dt>
                  <dd className="font-bold">{d.inProgress}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--color-ink-muted)]">Ждёт сегодня</dt>
                  <dd className="font-bold">{d.reviewToday + d.freshToday}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold text-[var(--color-ink)]">Занятия за 2 недели</p>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {activeDays} {plural(activeDays, ["день", "дня", "дней"])} с занятиями · подряд сейчас: {streak}
          </p>
        </div>
        <div className="mt-4 flex h-28 items-end gap-1.5">
          {activity.map((d) => {
            const total = d.correct + d.wrong;
            return (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${d.day}: верно ${d.correct}, ошибок ${d.wrong}`}>
                <div className="flex w-full max-w-7 flex-col-reverse overflow-hidden rounded-md" style={{ height: `${(total / maxDay) * 100}%` }}>
                  <div className="bg-[var(--color-success)]" style={{ flexGrow: d.correct }} />
                  <div className="bg-[var(--color-danger)]" style={{ flexGrow: d.wrong }} />
                </div>
                <span className="text-[10px] text-[var(--color-ink-muted)]">{Number(d.day.slice(8))}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-[var(--color-success)]" /> верно
          <span className="ml-3 mr-1 inline-block h-2 w-2 rounded-sm bg-[var(--color-danger)]" /> ошибка — по первому ответу на слово за день
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-ink)]">Ошибки · {mistakes.length}</h2>
        {mistakes.length > 0 && (
          <a
            href={`/api/admin/students/${user.id}/word-errors`}
            className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            Скачать ошибки (Excel)
          </a>
        )}
      </div>

      {mistakes.length === 0 ? (
        <p className="mt-3 text-[var(--color-ink-soft)]">Ошибок пока нет.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-[var(--color-ink)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b-2 border-[var(--color-ink)] bg-[var(--color-bg)] text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
              <tr>
                <th className="px-4 py-2.5">Слово</th>
                <th className="px-4 py-2.5">Колода</th>
                <th className="px-4 py-2.5">Ошибок</th>
                <th className="px-4 py-2.5">Верно</th>
                <th className="px-4 py-2.5">Последний неверный ответ</th>
                <th className="px-4 py-2.5">Сейчас</th>
              </tr>
            </thead>
            <tbody>
              {mistakes.map((m) => (
                <tr key={m.cardId} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-[var(--color-ink)]">{m.word}</td>
                  <td className="px-4 py-2.5 text-[var(--color-ink-soft)]">{m.deckTitle}</td>
                  <td className="px-4 py-2.5 font-bold text-[var(--color-danger)]">{m.wrong}</td>
                  <td className="px-4 py-2.5">{m.right}</td>
                  <td className="px-4 py-2.5 text-[var(--color-ink-soft)]">
                    {m.lastWrongGiven ?? "—"}
                    {m.lastWrongAt && <span className="ml-1 text-xs text-[var(--color-ink-muted)]">({formatDate(m.lastWrongAt)})</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    {m.learned ? (
                      <span className="rounded-full bg-[#e3f6ee] px-2 py-0.5 text-xs font-semibold text-[var(--color-success)]">выучено</span>
                    ) : (
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]">в работе</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
