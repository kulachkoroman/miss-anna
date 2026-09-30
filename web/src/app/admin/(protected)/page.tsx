import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRub, formatDateTime } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [studentsCount, coursesCount, successPayments, recentPayments] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["STUDENT", "PARENT"] } } }),
    prisma.course.count(),
    prisma.payment.findMany({ where: { status: "SUCCESS" } }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true, course: true },
    }),
  ]);

  const revenue = successPayments.reduce((sum, p) => sum + p.amountRub, 0);

  const stats = [
    { label: "Учеников и родителей", value: studentsCount },
    { label: "Курсов", value: coursesCount },
    { label: "Оплаченных заказов", value: successPayments.length },
    { label: "Выручка", value: formatRub(revenue) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Обзор</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-2xl font-extrabold text-[var(--color-ink)]">{s.value}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            Последние платежи
          </h2>
          <Link href="/admin/payments" className="text-sm text-[var(--color-primary)] hover:underline">
            Все платежи →
          </Link>
        </div>
        {recentPayments.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">Платежей пока нет.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-t border-[var(--color-border)]">
                  <td className="py-2.5 text-[var(--color-ink)]">{p.user.name}</td>
                  <td className="py-2.5 text-[var(--color-ink-soft)]">{p.course.title}</td>
                  <td className="py-2.5 font-medium">{formatRub(p.amountRub)}</td>
                  <td className="py-2.5 text-[var(--color-ink-soft)]">{formatDateTime(p.createdAt)}</td>
                  <td className="py-2.5">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    SUCCESS: "Оплачен",
    PENDING: "Ожидание",
    FAILED: "Ошибка",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
