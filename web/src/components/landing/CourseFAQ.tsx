import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { COURSE_FAQ } from "@/content/course";

/** Вопросы о курсе — тексты Анны из материалов курса. */
export default function CourseFAQ({
  tone = "default",
  defaultOpen = 0,
}: {
  tone?: "default" | "tint";
  defaultOpen?: number | null;
}) {
  return (
    <Section id="faq" tone={tone}>
      <Reveal>
        <SectionHeading align="center" eyebrow="Вопросы и ответы" title="Коротко о курсе" />
      </Reveal>
      <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
        <Accordion items={COURSE_FAQ} defaultOpen={defaultOpen} />
      </Reveal>
    </Section>
  );
}
