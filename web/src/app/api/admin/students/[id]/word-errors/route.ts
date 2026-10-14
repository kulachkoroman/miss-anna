import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMistakes } from "@/lib/words/stats";
import { dayKey } from "@/lib/words/schedule";

/**
 * Ошибки ученика в тренажёре словарных слов — таблицей для Excel.
 * Только для админа. Отдельный маршрут, а не Server Action: нужен файл
 * на скачивание.
 */

/**
 * Ячейка CSV. Значение, начинающееся с = + - @, Excel принял бы за формулу —
 * имя ученика вводит сам ученик, поэтому такие значения экранируем апострофом.
 */
function cell(value: string | number): string {
  let v = String(value);
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") return Response.json({ error: "Нет доступа" }, { status: 403 });

  const { id } = await ctx.params;
  const user = await prisma.user.findFirst({
    where: { id, role: { in: ["STUDENT", "PARENT"] } },
    select: { id: true, name: true, studentName: true, role: true },
  });
  if (!user) return Response.json({ error: "Ученик не найден" }, { status: 404 });

  const mistakes = await getMistakes(user.id);
  const studentName = user.role === "PARENT" ? user.studentName : user.name;

  const rows: (string | number)[][] = [
    ["Ученик", studentName],
    ["Дата выгрузки", formatDate(new Date())],
    [],
    ["Слово", "Колода", "Раздел", "Ошибок", "Верных ответов", "Последний неверный ответ", "Когда", "Сейчас"],
    ...mistakes.map((m) => [
      m.word,
      m.deckTitle,
      m.group,
      m.wrong,
      m.right,
      m.lastWrongGiven ?? "",
      m.lastWrongAt ? formatDate(m.lastWrongAt) : "",
      m.learned ? "выучено" : "в работе",
    ]),
  ];

  // BOM и «;» — русский Excel открывает такой файл двойным щелчком без кракозябр.
  const csv = "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
  const fileName = `Ошибки — ${studentName} — ${dayKey(new Date())}.csv`.replace(/[\\/:*?"<>|]/g, "");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="errors.csv"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "no-store",
    },
  });
}
