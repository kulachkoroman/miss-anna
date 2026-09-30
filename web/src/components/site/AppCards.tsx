import clsx from "clsx";
import BrandIcon, { BRAND_STYLE } from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import type { BlogLink, Messenger } from "@/content/site";

/**
 * Карточки мессенджеров и соцсетей для страницы контактов.
 *
 * Каждая оформлена в духе своего приложения: Telegram — синий с пузырём
 * сообщения, VK — фирменный синий, Max — его градиент, YouTube — кадр
 * с красной кнопкой, TikTok — чёрный с двойной тенью. Так человек ещё
 * до чтения понимает, куда его переведёт ссылка.
 */

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Крупная цветная карточка мессенджера. */
export function MessengerCard({
  messenger,
  featured = false,
  className,
}: {
  messenger: Messenger;
  featured?: boolean;
  className?: string;
}) {
  const style = BRAND_STYLE[messenger.brand];

  return (
    <a
      href={messenger.href}
      {...external}
      style={{ background: style.background }}
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-panel border-2 border-[var(--color-ink)] p-7 text-white sm:p-8",
        "shadow-hard transition-[translate,box-shadow] duration-150 ease-out",
        "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg",
        className
      )}
    >
      {/* Большой значок на фоне — фактура карточки. */}
      <BrandIcon
        brand={messenger.brand}
        mono
        className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 text-white opacity-[0.1] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-110"
      />

      <div className="relative flex items-center justify-between gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
          <BrandIcon brand={messenger.brand} mono className="h-8 w-8 text-white" />
        </span>
        {featured && (
          <span className="rounded-full bg-white/20 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] ring-1 ring-white/25">
            Быстрее всего
          </span>
        )}
      </div>

      <h3 className="relative mt-6 text-h3 text-white">{messenger.label}</h3>
      <p className="relative mt-1 font-medium text-white/80">{messenger.handle}</p>
      <p className="relative mt-3 text-[0.9375rem] text-white/70">{messenger.purpose}</p>

      {/* Пример первого сообщения — снимает ступор «а что писать». */}
      {featured && (
        <div className="relative mt-7 flex flex-col gap-2" aria-hidden>
          <span className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[0.9375rem] leading-snug text-[#0f1419] shadow-subtle">
            Здравствуйте! Хочу записаться на пробный урок, 11 класс, ЕГЭ
            <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[0.6875rem] text-[#4fae4e]">
              ✓✓
            </span>
          </span>
          <span className="self-end pr-1 text-[0.6875rem] text-white/60">
            Например, так — можно без официальных формулировок
          </span>
        </div>
      )}

      <span className="relative mt-auto inline-flex items-center gap-2 pt-8 font-bold">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-white px-5 py-2.5 text-[0.9375rem] text-[#0f1419] transition-transform duration-300 group-hover:translate-x-1">
          Написать
          <Icon name="arrowUpRight" className="h-4 w-4" />
        </span>
      </span>
    </a>
  );
}

/** Карточка площадки блога. Своя «сцена» для каждой соцсети. */
export function BlogCard({ link }: { link: BlogLink }) {
  if (link.brand === "youtube") return <YouTubeCard link={link} />;
  if (link.brand === "tiktok") return <TikTokCard link={link} />;
  return <TelegramChannelCard link={link} />;
}

function CardShell({
  link,
  className,
  children,
  dark = false,
}: {
  link: BlogLink;
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <a
      href={link.href}
      {...external}
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-panel border-2 border-[var(--color-ink)] p-6 shadow-hard transition-[translate,box-shadow] duration-150 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg sm:p-7",
        dark ? "bg-[#010101] text-white" : "bg-[var(--color-surface)]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <BrandIcon brand={link.brand} className={clsx("h-9 w-9", dark && "text-white")} />
        <div className="leading-tight">
          <p className={clsx("font-bold", dark ? "text-white" : "text-[var(--color-ink)]")}>{link.label}</p>
          <p className={clsx("text-caption", dark ? "text-white/55" : "text-[var(--color-ink-muted)]")}>
            {link.handle}
          </p>
        </div>
      </div>
      {children}
    </a>
  );
}

function TelegramChannelCard({ link }: { link: BlogLink }) {
  return (
    <CardShell link={link}>
      <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl bg-[#e8f4fb] p-5">
        <p className="text-[2.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--brand-telegram)]">
          5 500+
        </p>
        <p className="mt-2 text-[0.9375rem] text-[#3b6c86]">подписчиков в канале</p>
      </div>
      <span className="btn-shine mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--brand-telegram)] px-5 py-2.5 font-bold text-white">
        Читать канал
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </span>
    </CardShell>
  );
}

function YouTubeCard({ link }: { link: BlogLink }) {
  return (
    <CardShell link={link}>
      {/* Кадр видео с кнопкой воспроизведения, как в плеере YouTube. */}
      <div className="relative mt-6 flex aspect-video flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#0f0f0f]">
        <div aria-hidden className="bg-grid-light absolute inset-0 opacity-40" />
        <span className="relative flex h-12 w-[4.25rem] items-center justify-center rounded-[14px] bg-[var(--brand-youtube)] transition-transform duration-300 group-hover:scale-110">
          <Icon name="play" className="h-6 w-6 fill-white text-white" />
        </span>
        <span aria-hidden className="absolute inset-x-4 bottom-3 h-1 rounded-full bg-white/20">
          <span className="block h-full w-1/3 rounded-full bg-[var(--brand-youtube)]" />
        </span>
      </div>
      <p className="mt-4 text-[0.9375rem] text-[var(--color-ink-soft)]">{link.note}</p>
    </CardShell>
  );
}

function TikTokCard({ link }: { link: BlogLink }) {
  return (
    <CardShell link={link} dark>
      {/* Вертикальный кадр с фирменной двойной тенью TikTok. */}
      <div className="relative mt-6 flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#161616] to-[#050505] py-8">
        <span className="absolute left-6 top-4 h-24 w-24 rounded-full bg-[var(--brand-tiktok-cyan)] opacity-25 blur-2xl" />
        <span className="absolute bottom-4 right-6 h-24 w-24 rounded-full bg-[var(--brand-tiktok-pink)] opacity-25 blur-2xl" />
        <BrandIcon
          brand="tiktok"
          className="relative h-16 w-16 text-white transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <p className="mt-4 text-[0.9375rem] text-white/65">{link.note}</p>
    </CardShell>
  );
}
