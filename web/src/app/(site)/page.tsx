import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import AboutPreview from "@/components/home/AboutPreview";
import Results from "@/components/site/Results";
import ForWhom from "@/components/site/ForWhom";
import CoursesPreview from "@/components/home/CoursesPreview";
import ClassesPreview from "@/components/home/ClassesPreview";
import ChooseFormat from "@/components/home/ChooseFormat";
import HowItWorks from "@/components/home/HowItWorks";
import Quote from "@/components/ui/Quote";
import Reviews from "@/components/home/Reviews";
import FAQ from "@/components/home/FAQ";
import ContactsPreview from "@/components/home/ContactsPreview";
import { FEAR_QUOTE } from "@/content/site";

/**
 * Порядок блоков главной.
 *
 * Логика чтения: кто я → чего добиваются ученики → кому это подходит →
 * что есть → что выбрать → как начать → слово Анны → отзывы → вопросы →
 * как связаться.
 *
 * Фоны секций чередуются (светлый, холодный, тёмный), и два одинаковых
 * по устройству блока не стоят рядом — иначе страница читается как одна
 * длинная лента карточек.
 */
export default async function HomePage() {
  const [courses, reviews] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
    prisma.review.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <AboutPreview />
      <Results />
      <ForWhom />
      <CoursesPreview courses={courses} />
      <ClassesPreview />
      <ChooseFormat courses={courses} />
      <Quote quote={{ text: FEAR_QUOTE.text, caption: "Анна Паршукова" }} eyebrow={FEAR_QUOTE.caption} />
      <HowItWorks />
      <Reviews reviews={reviews} />
      <FAQ />
      <ContactsPreview />
    </>
  );
}
