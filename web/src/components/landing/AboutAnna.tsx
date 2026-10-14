import Image from "next/image";
import Section from "@/components/ui/Section";
import SocialButton from "@/components/site/SocialButton";
import { Reveal } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { ABOUT, BLOG_LINKS, TELEGRAM } from "@/content/site";

/**
 * «Кто ведёт курс» — отдельная рамка, как просил Роман, но живая:
 * слева стопка фото (школьный коридор и кадр из Zoom «полароидом»),
 * справа приветствие от первого лица, короткая история Анны, её фраза
 * о подготовке, три факта и куда написать.
 * Коротко, как просила Анна: о курсе страница, о ней — один блок.
 */
export default function AboutAnna() {
  return (
    <Section id="anna" tone="tint">
      <Reveal>
        <div className="relative rounded-panel border-2 border-[var(--color-ink)] bg-white shadow-hard-lg">
          {/* Ярлычок на рамке, как закладка в тетради */}
          <span className="absolute -top-4 left-6 rotate-[-2deg] rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] shadow-hard-sm sm:left-10">
            Кто ведёт курс
          </span>

          <div className="grid gap-10 p-6 pt-10 sm:p-10 sm:pt-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start lg:gap-14 lg:p-12">
            {/* На широком экране фото едет рядом с текстом, не оставляя пустот. */}
            <div className="md:sticky md:top-28">
              <Photos />
            </div>

            <div>
              <h2 className="text-h2 text-[var(--color-ink)]">
                {ABOUT.greeting}
                <span className="text-[var(--color-accent)]">!</span>
              </h2>
              <p className="mt-3 font-semibold text-[var(--color-ink)]">{ABOUT.role}</p>

              <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-[var(--color-ink-soft)]">
                {ABOUT.story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {/* Её фраза — розовой «запиской» */}
              <figure className="relative mt-9 rotate-[-0.6deg] rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent-soft)] py-4 pl-9 pr-5 shadow-hard-sm sm:pl-11">
                {/* Кавычка — круглая наклейка поверх угла рамки */}
                <span
                  aria-hidden
                  className="absolute -left-4 -top-5 flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] shadow-hard-sm sm:-left-5 sm:-top-6 sm:h-14 sm:w-14"
                >
                  <span className="mt-5 font-display text-[2.75rem] leading-none text-white sm:mt-6 sm:text-[3.25rem]">“</span>
                </span>
                <blockquote className="font-hand text-[1.5rem] font-bold leading-[1.15] text-[var(--color-ink)] sm:text-[1.625rem]">
                  {ABOUT.quote}
                </blockquote>
              </figure>

              <dl className="mt-7 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                {ABOUT.facts.map((f) => (
                  <div
                    key={f.value}
                    className="flex items-center gap-4 rounded-2xl bg-[var(--color-surface-alt)] px-4 py-3 sm:block sm:py-3.5"
                  >
                    <dt className="w-[5.5rem] shrink-0 whitespace-nowrap font-display text-[1.25rem] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)] sm:w-auto sm:text-[1.375rem]">
                      {f.value}
                    </dt>
                    <dd className="text-caption leading-snug text-[var(--color-ink-muted)] sm:mt-1.5">{f.label}</dd>
                  </div>
                ))}
              </dl>

              {/* Контакты: четыре одинаковые карточки ровной сеткой 2×2 — как в прошлой версии, с никами */}
              <div className="mt-7 border-t-2 border-dashed border-[var(--color-border-strong)] pt-6">
                <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Вопросы о курсе и блог
                </p>
                <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                  <SocialButton
                    brand={TELEGRAM.brand}
                    href={TELEGRAM.href}
                    label="Написать мне"
                    handle={TELEGRAM.handle}
                    variant="chip"
                    className="w-full bg-[var(--color-accent-soft)]!"
                  />
                  {BLOG_LINKS.map((l) => (
                    <SocialButton key={l.href} brand={l.brand} href={l.href} label={l.label} handle={l.handle} variant="chip" className="w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** Стопка фото: портрет в школе и маленький кадр из Zoom поверх угла. */
function Photos() {
  return (
    <div className="relative mx-auto w-full max-w-[19rem] pb-10 pr-8 sm:max-w-[21rem] lg:max-w-[24rem]">
      <div className="relative aspect-[4/5] rotate-[-2deg] overflow-hidden rounded-card border-2 border-[var(--color-ink)] shadow-hard">
        <Image
          src={MEDIA.aboutPortrait.src}
          alt={MEDIA.aboutPortrait.alt}
          fill
          sizes="(max-width: 768px) 80vw, 340px"
          className="object-cover object-top"
        />
      </div>

      {/* «Полароид» с урока онлайн */}
      <div className="absolute bottom-0 right-0 w-[48%] rotate-[5deg] rounded-xl border-2 border-[var(--color-ink)] bg-white p-1.5 pb-0 shadow-hard">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={MEDIA.aboutPreview.src}
            alt={MEDIA.aboutPreview.alt}
            fill
            sizes="170px"
            className="object-cover"
          />
        </div>
        <p className="py-1.5 text-center font-hand text-[1.125rem] font-bold leading-none text-[var(--color-ink)]">
          на уроке в Zoom
        </p>
      </div>

      <span className="absolute -left-3 top-6 rotate-[-6deg] rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-3 py-1 font-hand text-[1.375rem] font-bold leading-none text-[var(--color-ink)] shadow-hard-sm">
        это я :)
      </span>
    </div>
  );
}
