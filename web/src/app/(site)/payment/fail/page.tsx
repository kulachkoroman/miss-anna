import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default async function PaymentFailPage(props: PageProps<"/payment/fail">) {
  const params = await props.searchParams;
  const invId = Array.isArray(params.InvId) ? params.InvId[0] : params.InvId;
  const payment = invId
    ? await prisma.payment.findUnique({
        where: { invoiceId: Number(invId) },
        include: { course: true },
      })
    : null;

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ✕
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-[var(--color-ink)]">Оплата не прошла</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Платёж был отменён или не завершился. Деньги не были списаны. Вы можете попробовать
          оплатить ещё раз.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {payment && (
            <Button href={`/courses/${payment.course.slug}`}>Повторить оплату</Button>
          )}
          {!payment && <Button href="/courses">К каталогу курсов</Button>}
        </div>
      </Container>
    </section>
  );
}
