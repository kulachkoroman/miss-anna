import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { VIDEOS_DIR, ensureStorageDirs, safeFileName } from "@/lib/storage";

/**
 * Загрузка видео урока из админки.
 *
 * Отдельный маршрут, а не Server Action: у Server Actions лимит тела
 * запроса 1 МБ, а видеоурок весит сотни мегабайт. Файл приходит «как есть»
 * (тело запроса — сами байты, имя — в заголовке x-file-name) и пишется
 * на диск потоком, не целиком в память. Сначала во временный файл —
 * если загрузка оборвётся, старое видео урока останется на месте.
 */

const MAX_BYTES = 5 * 1024 ** 3; // 5 ГБ
const ALLOWED_EXT = new Set([".mp4", ".m4v", ".mov", ".webm"]);

export async function POST(request: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return Response.json({ error: "Нет доступа" }, { status: 403 });

  const { lessonId } = await ctx.params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
  if (!lesson) return Response.json({ error: "Урок не найден" }, { status: 404 });

  const originalName = decodeURIComponent(request.headers.get("x-file-name") ?? "video.mp4");
  const ext = path.extname(originalName).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return Response.json({ error: "Подойдут файлы MP4, MOV или WebM" }, { status: 400 });
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return Response.json({ error: "Файл больше 5 ГБ" }, { status: 413 });
  if (!request.body) return Response.json({ error: "Пустой файл" }, { status: 400 });

  await ensureStorageDirs();
  const fileName = `${lessonId}-${Date.now()}-${safeFileName(path.basename(originalName))}`;
  const finalPath = path.join(VIDEOS_DIR, fileName);
  const tempPath = `${finalPath}.part`;

  let written = 0;
  const source = Readable.fromWeb(request.body as unknown as WebReadableStream<Uint8Array>);
  source.on("data", (chunk: Buffer) => {
    written += chunk.length;
    if (written > MAX_BYTES) source.destroy(new Error("too large"));
  });

  try {
    await pipeline(source, fs.createWriteStream(tempPath));
  } catch {
    await fs.promises.unlink(tempPath).catch(() => {});
    return Response.json({ error: "Загрузка прервалась. Попробуй ещё раз." }, { status: 400 });
  }
  if (written === 0) {
    await fs.promises.unlink(tempPath).catch(() => {});
    return Response.json({ error: "Пустой файл" }, { status: 400 });
  }

  await fs.promises.rename(tempPath, finalPath);
  if (lesson.videoPath) {
    await fs.promises.unlink(path.join(VIDEOS_DIR, lesson.videoPath)).catch(() => {});
  }
  await prisma.lesson.update({ where: { id: lessonId }, data: { videoPath: fileName } });
  revalidatePath(`/admin/courses/${lesson.module.courseId}`);

  return Response.json({ ok: true });
}
