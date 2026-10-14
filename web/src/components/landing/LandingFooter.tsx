import Link from "next/link";
import Container from "@/components/ui/Container";
import SocialButton from "@/components/site/SocialButton";
import { BLOG_LINKS, BLOG_NAME, LEGAL, MESSENGERS } from "@/content/site";

/**
 * Подвал лендинга: короткий. Имя блога, соцсети, реквизиты самозанятой
 * и политика — она нужна, потому что при регистрации собираются данные.
 */
export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#100c22] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      </div>

      <Container className="relative py-12 sm:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold tracking-[-0.02em]">
              {BLOG_NAME}
              <span className="text-[var(--color-accent)]">.</span>
            </p>
            <p className="mt-2 text-[0.9375rem] text-white/55">Анна Паршукова · русский язык и литература</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...MESSENGERS, ...BLOG_LINKS].map((l) => (
              <SocialButton key={l.href} brand={l.brand} href={l.href} label={l.label} variant="icon" />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8125rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {LEGAL.fullName} · {LEGAL.statusShort} · ИНН {LEGAL.inn}
          </p>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Политика обработки персональных данных
          </Link>
        </div>
      </Container>
    </footer>
  );
}
