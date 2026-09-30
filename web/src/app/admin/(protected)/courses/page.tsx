import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRub } from "@/lib/format";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { modules: true, enrollments: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Курсы</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-1.5 text-sm font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          + Новый курс
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-[var(--color-ink)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-ink-soft)]">
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Цена</th>
              <th className="px-4 py-3 font-medium">Модулей</th>
              <th className="px-4 py-3 font-medium">Учеников</th>
              <th className="px-4 py-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-medium text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                  >
                    {course.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                  {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">{course._count.modules}</td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">{course._count.enrollments}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      course.published
                        ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"
                    }
                  >
                    {course.published ? "Опубликован" : "Черновик"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
