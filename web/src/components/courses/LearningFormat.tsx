import Icon, { type IconName } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * «Как устроено обучение» — что человек реально получает после оплаты.
 *
 * Все четыре пункта описывают уже работающие возможности личного кабинета,
 * а не обещания: видео отдаётся через защищённый плеер, материалы лежат
 * в закрытом хранилище, доступ к курсу не ограничен по времени,
 * пройденные уроки отмечаются.
 *
 * Блок используется и в каталоге, и на странице курса.
 */

const points: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "play",
    title: "Видеоуроки",
    text: "Смотрите в браузере с телефона или компьютера, в любое время и сколько угодно раз.",
  },
  {
    icon: "document",
    title: "Материалы",
    text: "Конспекты, чек-листы и шаблоны к урокам — открываются прямо в кабинете.",
  },
  {
    icon: "lock",
    title: "Доступ не сгорает",
    text: "Курс остаётся в кабинете и после экзамена: вернуться к теме можно в любой момент.",
  },
  {
    icon: "check",
    title: "Отметки о прохождении",
    text: "Отмечайте пройденные уроки, чтобы не терять место в программе.",
  },
];

export default function LearningFormat({ className }: { className?: string }) {
  return (
    <RevealGroup stagger={0.1} className={className}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <RevealItem key={point.title} className="h-full">
            <div className="flex h-full flex-col rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-6 shadow-hard">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon name={point.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-h4 text-[var(--color-ink)]">{point.title}</h3>
              <p className="mt-2 text-caption leading-relaxed text-[var(--color-ink-soft)]">
                {point.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </div>
    </RevealGroup>
  );
}
