import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default async function PaymentSuccessPage(
  props: PageProps<"/payment/success">
) {
  const params = await props.searchParams;
  const invId = Array.isArray(params.InvId) ? params.InvId[0] : params.InvId;
  const payment = invId
    ? await prisma.payment.findUnique({
        where: { invoiceId: Number(invId) },
        include: { course: true },
      })
    : null;

  const confirmed = payment?.status === "SUCCESS";

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-[var(--color-ink)]">
          {confirmed ? "Оплата прошла успешно" : "Оплата обрабатывается"}
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          {confirmed
            ? `Доступ к курсу «${payment?.course.title}» открыт в личном кабинете.`
            : "Мы получили ваш платёж и подтверждаем его — обычно это занимает несколько секунд. Если доступ не откроется в течение пары минут, напишите нам."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/cabinet">Перейти в личный кабинет</Button>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-full border-2 border-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[var(--color-primary-soft)]"
          >
            К каталогу курсов
          </Link>
        </div>
      </Container>
    </section>
  );
}
