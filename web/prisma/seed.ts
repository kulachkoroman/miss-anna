import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "anna@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-admin-123";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      role: "ADMIN",
      accountType: "STUDENT_SELF",
      name: "Анна Паршукова",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      studentName: "Анна Паршукова",
      consentPersonalData: true,
    },
  });
  console.log(`Admin user ready: ${adminEmail} / ${adminPassword}`);

  const freeCourse = await prisma.course.upsert({
    where: { slug: "itogovoe-sochinenie" },
    update: {},
    create: {
      slug: "itogovoe-sochinenie",
      title: "Итоговое сочинение: допуск к ЕГЭ с первого раза",
      shortDescription:
        "Разбираем требования и структуру итогового сочинения, чтобы получить «зачёт» с первой попытки.",
      description:
        "Итоговое сочинение — обязательный допуск к ЕГЭ для всех 11-классников. Курс разбирает требования к работе, структуру сочинения по всем открытым направлениям, разбор типичных ошибок и примеры аргументации на основе литературных произведений. После курса вы будете точно знать, как писать сочинение, чтобы получить «зачёт» с первого раза и без стресса.",
      whatsIncluded:
        "Видеоуроки по структуре и требованиям;Разбор аргументов и литературных примеров;Чек-лист самопроверки перед экзаменом;Материалы для скачивания",
      forWhom:
        "Ученикам 11 класса, которым предстоит писать итоговое сочинение в этом учебном году",
      duration: "3 модуля, доступ без ограничения по времени",
      isFree: true,
      priceRub: 0,
      published: true,
      order: 1,
      modules: {
        create: [
          {
            title: "Модуль 1. Структура и требования",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Критерии зачёта: что проверяют эксперты",
                  order: 1,
                  description:
                    "Разбираем формальные и содержательные требования к итоговому сочинению.",
                },
                {
                  title: "Композиция сочинения: вступление, аргументы, заключение",
                  order: 2,
                  description:
                    "Как выстроить сочинение так, чтобы оно точно соответствовало структуре.",
                },
              ],
            },
          },
          {
            title: "Модуль 2. Аргументация и примеры",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Как подобрать литературный аргумент под тему",
                  order: 1,
                },
                {
                  title: "Разбор готовых аргументов по открытым направлениям",
                  order: 2,
                },
              ],
            },
          },
          {
            title: "Модуль 3. Типичные ошибки и разбор работ",
            order: 3,
            lessons: {
              create: [
                {
                  title: "Разбор реальных работ учеников: что исправить",
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const paidCourse = await prisma.course.upsert({
    where: { slug: "sochinenie-ege-maksimum" },
    update: {},
    create: {
      slug: "sochinenie-ege-maksimum",
      title: "Сочинение ЕГЭ на максимум",
      shortDescription:
        "Готовимся к заданию 27 ЕГЭ по русскому языку — от структуры до максимального балла по критериям.",
      description:
        "Курс посвящён написанию сочинения (задание 27) на самом ЕГЭ по русскому языку — том задании, которое приносит больше всего баллов и вызывает больше всего сложностей. Разбираем формулировку проблемы, комментарий с опорой на текст, позицию автора, собственную аргументацию и типичные ошибки, из-за которых снижают баллы. Практика построена на реальных текстах из ЕГЭ прошлых лет.",
      whatsIncluded:
        "Видеоуроки по каждому критерию оценивания;Разбор сочинений на реальных текстах ЕГЭ;Практические задания с проверкой;Материалы и шаблоны для скачивания",
      forWhom:
        "Ученикам 9–11 классов, которые готовятся к ЕГЭ по русскому языку и хотят получить максимум баллов за сочинение",
      duration: "5 модулей, доступ без ограничения по времени",
      isFree: false,
      priceRub: 4990,
      published: true,
      order: 2,
      modules: {
        create: [
          {
            title: "Модуль 1. Формулировка проблемы",
            order: 1,
            lessons: {
              create: [
                { title: "Как найти и точно сформулировать проблему текста", order: 1 },
              ],
            },
          },
          {
            title: "Модуль 2. Комментарий с опорой на текст",
            order: 2,
            lessons: {
              create: [
                { title: "Два примера-иллюстрации и смысловая связь между ними", order: 1 },
              ],
            },
          },
          {
            title: "Модуль 3. Позиция автора и собственное мнение",
            order: 3,
            lessons: {
              create: [{ title: "Как не потерять баллы на этом критерии", order: 1 }],
            },
          },
          {
            title: "Модуль 4. Аргументация своей позиции",
            order: 4,
            lessons: {
              create: [{ title: "Подбор аргументов: жизненный и литературный опыт", order: 1 }],
            },
          },
          {
            title: "Модуль 5. Практика и разбор ошибок",
            order: 5,
            lessons: {
              create: [
                { title: "Разбор сочинений учеников на реальных текстах ЕГЭ", order: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Courses ready: ${freeCourse.slug}, ${paidCourse.slug}`);

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        {
          studentName: "Мария",
          studentGrade: "11 класс",
          text: "Готовилась к итоговому сочинению по курсу Анны — написала на «зачёт» без единого замечания. Всё объясняется понятно, по шагам.",
          published: true,
          order: 1,
        },
        {
          studentName: "Артём",
          studentGrade: "10 класс",
          text: "Начал заниматься заранее, чтобы не гнаться перед самим ЕГЭ. Анна сразу видит пробелы и объясняет так, что запоминается с первого раза.",
          published: true,
          order: 2,
        },
        {
          studentName: "Родитель ученицы, 9 класс",
          studentGrade: null,
          text: "Дочь стала увереннее в своих силах уже после нескольких занятий. Домашние задания и разбор ошибок — большой плюс.",
          published: true,
          order: 3,
        },
      ],
    });
    console.log("Placeholder reviews created — replace with real ones from the admin panel.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
