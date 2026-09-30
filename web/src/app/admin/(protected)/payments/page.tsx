import { prisma } from "@/lib/prisma";
import { formatRub, formatDateTime } from "@/lib/format";

const statusMap: Record<string, { label: string; className: string }> = {
  SUCCESS: { label: "Оплачен", className: "bg-green-100 text-green-700" },
  PENDING: { label: "Ожидание", className: "bg-amber-100 text-amber-700" },
  FAILED: { label: "Ошибка", className: "bg-red-100 text-red-700" },
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, course: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Платежи</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        История платежей, полученная от Robokassa по уведомлениям Result URL.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-[var(--color-ink)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-ink-soft)]">
              <th className="px-4 py-3 font-medium">№ заказа</th>
              <th className="px-4 py-3 font-medium">Ученик</th>
              <th className="px-4 py-3 font-medium">Курс</th>
              <th className="px-4 py-3 font-medium">Сумма</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const status = statusMap[p.status] ?? { label: p.status, className: "" };
              return (
                <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{p.invoiceId}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{p.user.name}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{p.course.title}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{formatRub(p.amountRub)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{formatDateTime(p.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payments.length === 0 && (
          <p className="p-6 text-sm text-[var(--color-ink-soft)]">Платежей пока нет.</p>
        )}
      </div>
    </div>
  );
}
