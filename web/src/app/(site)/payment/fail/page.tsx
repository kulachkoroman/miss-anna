import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function PaymentFailPage() {
  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[#ffd6d6] text-3xl shadow-hard">
          ✕
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-[var(--color-ink)]">Оплата не прошла</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Платёж был отменён или не завершился. Деньги не были списаны. Вы можете попробовать
          оплатить ещё раз.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">На главную</Button>
        </div>
      </Container>
    </section>
  );
}
