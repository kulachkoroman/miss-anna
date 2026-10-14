import Section from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { COURSE_PROBLEM } from "@/content/course";

/**
 * «Знакомо? Если трудно понять, что писать» — сразу под первым экраном.
 * Отвечает на вопрос «кому и зачем этот курс» до того, как человек
 * дойдёт до программы. Тёмная полоса отделяет первый экран от остальной страницы.
 */
export default function CourseProblem() {
  return (
    <Section tone="ink" size="sm">
      <div className="grid gap-6 py-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <p className="font-hand text-[1.75rem] font-bold leading-none text-[var(--color-accent)]">{COURSE_PROBLEM.eyebrow}</p>
          <h2 className="mt-3 text-h2 text-white">{COURSE_PROBLEM.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-4 text-lead text-white/75">
            {COURSE_PROBLEM.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
