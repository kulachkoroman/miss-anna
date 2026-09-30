"use client";

import { useState } from "react";
import type { Course } from "@prisma/client";

const inputClasses =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]";
const labelClasses = "block text-sm font-medium text-[var(--color-ink)] mb-1.5";

export default function CourseForm({
  action,
  course,
}: {
  action: (formData: FormData) => void;
  course?: Course;
}) {
  const [isFree, setIsFree] = useState(course?.isFree ?? false);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={labelClasses}>Название курса</label>
        <input name="title" defaultValue={course?.title} required className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Короткое описание (для карточки)</label>
        <textarea
          name="shortDescription"
          defaultValue={course?.shortDescription}
          rows={2}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses}>Полное описание</label>
        <textarea
          name="description"
          defaultValue={course?.description}
          rows={5}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses}>Что входит (через точку с запятой)</label>
        <textarea
          name="whatsIncluded"
          defaultValue={course?.whatsIncluded ?? ""}
          rows={2}
          placeholder="Видеоуроки;Материалы для скачивания;Разбор ошибок"
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses}>Для кого этот курс</label>
        <textarea name="forWhom" defaultValue={course?.forWhom ?? ""} rows={2} className={inputClasses} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Длительность</label>
          <input name="duration" defaultValue={course?.duration ?? ""} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Порядок на странице (меньше — раньше)</label>
          <input
            name="order"
            type="number"
            defaultValue={course?.order ?? 0}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input
            type="checkbox"
            name="isFree"
            defaultChecked={course?.isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          Бесплатный курс
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input type="checkbox" name="published" defaultChecked={course?.published ?? true} />
          Опубликован
        </label>
      </div>

      {!isFree && (
        <div>
          <label className={labelClasses}>Цена, ₽</label>
          <input
            name="priceRub"
            type="number"
            min={0}
            defaultValue={course?.priceRub ?? 0}
            className={inputClasses}
          />
        </div>
      )}

      <button
        type="submit"
        className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
      >
        Сохранить
      </button>
    </form>
  );
}
