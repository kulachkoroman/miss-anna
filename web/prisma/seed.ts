import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { COURSE_HERO, COURSE_LESSONS, COURSE_SEO, FREE_COURSE_SLUG } from "../src/content/course";

const prisma = new PrismaClient();

/**
 * Наполнение базы.
 *
 * 1. Администратор (Анна) — данные входа из .env.
 * 2. Бесплатный курс по итоговому сочинению: шесть уроков и тексты к ним
 *    (конспекты, ответы, темы пробника, маршрут). Тексты лежат в
 *    prisma/course-content — это файлы из материалов Анны от 12 октября 2026.
 *
 * Повторный запуск безопасен: если уроки курса уже совпадают с программой,
 * они не трогаются (и правки Анны из админки не затираются); тексты
 * создаются, только если у курса их ещё нет.
 */

const CONTENT_DIR = join(__dirname, "course-content");
const read = (file: string) => readFileSync(join(CONTENT_DIR, file), "utf8").replace(/\r\n/g, "\n").trim();
const pad = (n: number) => String(n).padStart(2, "0");

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "anna@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-admin-123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      role: "ADMIN",
      accountType: "STUDENT_SELF",
      name: "Анна Паршукова",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      studentName: "Анна Паршукова",
      consentPersonalData: true,
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);
}

async function seedFreeCourse() {
  const course = await prisma.course.upsert({
    where: { slug: FREE_COURSE_SLUG },
    update: {
      title: COURSE_HERO.title,
      shortDescription: COURSE_SEO.description,
      description: COURSE_HERO.text,
      isFree: true,
      priceRub: 0,
      published: true,
    },
    create: {
      slug: FREE_COURSE_SLUG,
      title: COURSE_HERO.title,
      shortDescription: COURSE_SEO.description,
      description: COURSE_HERO.text,
      duration: "6 видеоуроков, до 20 часов вместе с чтением и практикой",
      isFree: true,
      priceRub: 0,
      published: true,
      order: 1,
    },
    include: { modules: { include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  /* Совпадает ли то, что в базе, с программой Анны? */
  const existing = course.modules.flatMap((m) => m.lessons).map((l) => l.title);
  const expected = COURSE_LESSONS.map((l) => l.title);
  const matches = existing.length === expected.length && existing.every((t, i) => t === expected[i]);

  if (!matches) {
    /* Старая тестовая программа: убираем её целиком (вместе с прогрессом
       по старым урокам и их текстами) и создаём уроки Анны. */
    await prisma.courseDoc.deleteMany({ where: { courseId: course.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Уроки",
        order: 1,
        lessons: {
          create: COURSE_LESSONS.map((l) => ({
            title: l.title,
            order: l.number,
            description: l.text,
            prep: l.prep,
          })),
        },
      },
    });
    console.log(`Course "${FREE_COURSE_SLUG}": lessons rebuilt from Anna's program`);
  } else {
    console.log(`Course "${FREE_COURSE_SLUG}": lessons already match, left as is`);
  }

  if ((await prisma.courseDoc.count({ where: { courseId: course.id } })) === 0) {
    const lessons = await prisma.lesson.findMany({
      where: { module: { courseId: course.id } },
      orderBy: { order: "asc" },
    });

    const docs: Array<{ lessonId: string | null; kind: string; title: string; body: string; order: number }> = [
      { lessonId: null, kind: "ROUTE", title: "Маршрут и список чтения", body: read("00 Маршрут и чтение.md"), order: 0 },
    ];
    lessons.forEach((lesson, i) => {
      const n = pad(i + 1);
      docs.push({ lessonId: lesson.id, kind: "NOTES", title: "Конспект и задания", body: read(`${n} Конспект и задания.md`), order: 1 });
      docs.push({ lessonId: lesson.id, kind: "ANSWERS", title: "Ответы и самопроверка", body: read(`${n} Ответы.md`), order: 2 });
      if (i + 1 === 6) {
        docs.push({ lessonId: lesson.id, kind: "MOCK", title: "Темы пробника", body: read("06 Темы пробника.md"), order: 3 });
      }
    });

    await prisma.courseDoc.createMany({ data: docs.map((d) => ({ ...d, courseId: course.id })) });
    console.log(`Course texts created: ${docs.length}`);
  }
}

async function main() {
  await seedAdmin();
  await seedFreeCourse();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
