import { prisma } from "@/lib/prisma";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { createReviewAction, updateReviewAction, deleteReviewAction } from "@/lib/actions/admin/reviews";

const inputClasses =
  "w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]";
const smallButton =
  "rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]";
const dangerButton =
  "rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Отзывы</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Опубликованные отзывы выводятся в блоке «Отзывы» на главной странице.
      </p>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <form
            key={review.id}
            action={updateReviewAction.bind(null, review.id)}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 space-y-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="studentName" defaultValue={review.studentName} className={inputClasses} placeholder="Имя" />
              <input
                name="studentGrade"
                defaultValue={review.studentGrade ?? ""}
                className={inputClasses}
                placeholder="Класс / статус (необязательно)"
              />
            </div>
            <textarea name="text" defaultValue={review.text} rows={3} className={inputClasses} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <input type="checkbox" name="published" defaultChecked={review.published} />
                Опубликован
              </label>
              <div className="flex gap-2">
                <button type="submit" className={smallButton}>Сохранить</button>
                <button
                  type="submit"
                  formAction={deleteReviewAction.bind(null, review.id)}
                  className={dangerButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Добавить отзыв
        </h2>
        <form action={createReviewAction} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="studentName" required className={inputClasses} placeholder="Имя" />
            <input name="studentGrade" className={inputClasses} placeholder="Класс / статус (необязательно)" />
          </div>
          <textarea name="text" required rows={3} className={inputClasses} placeholder="Текст отзыва" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input type="checkbox" name="published" defaultChecked />
              Опубликовать сразу
            </label>
            <button
              type="submit"
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:scale-[1.03]"
            >
              + Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
