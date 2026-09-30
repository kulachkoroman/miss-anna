import Image from "next/image";
import clsx from "clsx";
import Container from "@/components/ui/Container";
import SplitText from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";

/**
 * Крупная цитата Анны во всю ширину.
 *
 * Показывается только если текст цитаты действительно есть: слова от лица
 * Анны нельзя написать за неё. Текст появляется по словам, под ним —
 * маленькое фото и подпись, чтобы было видно, чьи это слова.
 *
 *   gradient — фирменный фиолетовый фон;
 *   light    — светлый фон, для страниц, где рядом уже есть тёмные блоки.
 */
export default function Quote({
  quote,
  eyebrow,
  tone = "gradient",
}: {
  quote: { text: string; caption?: string } | null;
  eyebrow?: string;
  tone?: "gradient" | "light";
}) {
  if (!quote) return null;
  const dark = tone === "gradient";

  return (
    <section
      className={clsx(
        "relative overflow-hidden py-20 sm:py-28",
        dark ? "bg-brand-gradient texture-grain text-white" : "bg-[var(--color-bg)]"
      )}
    >
      {dark && (
        <div aria-hidden className="bg-dots-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      )}
      <Container className="relative">
        <figure className="mx-auto max-w-4xl">
          <Reveal>
            <span
              aria-hidden
              className={clsx(
                "block font-serif text-[7rem] leading-[0.6]",
                dark ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"
              )}
            >
              &laquo;
            </span>
            {eyebrow && (
              <p className={clsx("eyebrow mt-4", dark && "eyebrow-on-dark")}>{eyebrow}</p>
            )}
          </Reveal>

          <SplitText
            as="blockquote"
            text={quote.text}
            className={clsx(
              "mt-6 text-balance text-[clamp(1.5rem,1.05rem+2vw,2.625rem)] font-bold leading-[1.18] tracking-[-0.025em]",
              dark ? "text-white" : "text-[var(--color-ink)]"
            )}
          />

          {quote.caption && (
            <Reveal delay={0.3}>
              <figcaption className="mt-9 flex items-center gap-4">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/40">
                  <Image
                    src={MEDIA.aboutPortrait.src}
                    alt=""
                    fill
                    sizes="128px"
                    className="scale-[2.4] object-cover"
                    style={{ objectPosition: "52% 27%", transformOrigin: "52% 27%" }}
                  />
                </span>
                <span className="leading-tight">
                  <span className={clsx("block font-bold", dark ? "text-white" : "text-[var(--color-ink)]")}>
                    Анна Паршукова
                  </span>
                  {quote.caption !== "Анна Паршукова" && (
                    <span className={clsx("mt-1 block text-caption", dark ? "text-white/60" : "text-[var(--color-ink-muted)]")}>
                      {quote.caption}
                    </span>
                  )}
                </span>
              </figcaption>
            </Reveal>
          )}
        </figure>
      </Container>
    </section>
  );
}
