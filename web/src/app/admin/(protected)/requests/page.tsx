import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { setRequestStatusAction } from "@/lib/actions/admin/requests";

/**
 * Заявки «Узнать о платном курсе» с финала бесплатного курса.
 * Анна отвечает на почту сама, здесь отмечает, кому уже ответила.
 */
export default async function AdminRequestsPage() {
  const requests = await prisma.paidCourseRequest.findMany({
    /* "NEW" > "DONE" по алфавиту: desc ставит новые заявки наверх. */
    orderBy: [{ status: "desc" }, { createdAt: "desc" }],
    include: { user: { select: { name: true, studentName: true, phone: true } } },
  });
  const newCount = requests.filter((r) => r.status === "NEW").length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Заявки на платный курс</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Ученик оставляет имя и почту в конце бесплатного курса. Ответь на почту, затем отметь заявку обработанной.
        {newCount > 0 && <span className="font-semibold text-[var(--color-ink)]"> Новых: {newCount}.</span>}
      </p>

      {requests.length === 0 ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-[var(--color-ink)]/40 bg-white p-8 text-center text-sm text-[var(--color-ink-soft)]">
          Заявок пока нет.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {requests.map((r) => {
            const isNew = r.status === "NEW";
            return (
              <li
                key={r.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[var(--color-ink)] p-4 sm:p-5 ${
                  isNew ? "bg-white shadow-hard-sm" : "bg-[var(--color-surface-alt)] opacity-80"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--color-ink)]">
                    {r.name}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isNew ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isNew ? "Новая" : "Обработана"}
                    </span>
                  </p>
                  <a href={`mailto:${r.email}`} className="mt-1 block break-all text-sm font-medium text-[var(--color-primary)] hover:underline">
                    {r.email}
                  </a>
                  <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                    {formatDateTime(r.createdAt)}
                    {r.user && ` · аккаунт: ${r.user.studentName || r.user.name}${r.user.phone ? `, ${r.user.phone}` : ""}`}
                  </p>
                </div>
                <form action={setRequestStatusAction.bind(null, r.id, isNew ? "DONE" : "NEW")}>
                  <button
                    type="submit"
                    className={
                      isNew
                        ? "rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-1.5 text-sm font-bold text-white shadow-hard-sm"
                        : "rounded-full border-2 border-[var(--color-ink)] bg-white px-4 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
                    }
                  >
                    {isNew ? "Ответила ✓" : "Вернуть в новые"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
