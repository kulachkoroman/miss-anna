import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialButton from "@/components/site/SocialButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { BLOG_LINKS, MESSENGERS } from "@/content/site";

/**
 * Финальный призыв связаться.
 *
 * Кнопки мессенджеров — в цветах самих приложений: так сразу видно,
 * куда ведёт ссылка. Ниже — блог, для тех, кто пока не готов писать.
 */
export default function ContactsPreview() {
  return (
    <Section id="contacts" tone="dark" size="lg" className="overflow-hidden">
      <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionHeading
            align="center"
            onDark
            eyebrow="Контакты"
            title="Не знаете, с чего начать?"
            highlight="с чего начать?"
            description="Напишите — подскажу, что подойдёт: курс, индивидуальные занятия или сначала бесплатный пробный урок. Отвечаю обычно в течение дня."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {MESSENGERS.map((m) => (
            <RevealItem key={m.id}>
              <SocialButton
                brand={m.brand}
                href={m.href}
                label={`Написать в ${m.id === "vk" ? "VK" : m.label}`}
                size="lg"
                className="w-full"
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/15 pt-8 sm:flex-row sm:justify-center">
            <span className="text-caption text-white/55">Или просто посмотрите блог:</span>
            <div className="flex gap-2.5">
              {BLOG_LINKS.map((link) => (
                <SocialButton
                  key={link.href}
                  variant="icon"
                  brand={link.brand}
                  href={link.href}
                  label={`${link.label} ${link.handle}`}
                />
              ))}
            </div>
            <Link
              href="/contacts"
              className="text-caption font-semibold text-white/80 underline-offset-4 hover:underline"
            >
              Все контакты
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
