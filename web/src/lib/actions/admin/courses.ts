"use server";

/* Уроки и файлы бесплатного курса. Создание курсов, модули и обложки убраны вместе
   со старым каталогом (октябрь 2026): у сайта один курс. */

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { VIDEOS_DIR, MATERIALS_DIR, ensureStorageDirs, safeFileName } from "@/lib/storage";

export async function createLessonAction(
  moduleId: string,
  courseId: string,
  formData: FormData
) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Название урока обязательно");

  const count = await prisma.lesson.count({ where: { moduleId } });
  await prisma.lesson.create({
    data: {
      moduleId,
      title,
      description: String(formData.get("description") ?? "") || null,
      order: count + 1,
    },
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLessonAction(
  lessonId: string,
  courseId: string,
  formData: FormData
) {
  await requireAdmin();
  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      /* «Перед уроком» есть не во всех формах — не затираем, если поля нет. */
      ...(formData.has("prep") ? { prep: String(formData.get("prep") ?? "").trim() || null } : {}),
    },
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLessonAction(lessonId: string, courseId: string) {
  await requireAdmin();
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (lesson?.videoPath) {
    await fs.unlink(path.join(VIDEOS_DIR, lesson.videoPath)).catch(() => {});
  }
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function moveLessonAction(
  lessonId: string,
  courseId: string,
  direction: "up" | "down"
) {
  await requireAdmin();
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return;
  const siblings = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: "asc" },
  });
  const idx = siblings.findIndex((l) => l.id === lessonId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  const other = siblings[swapIdx];
  await prisma.$transaction([
    prisma.lesson.update({ where: { id: lesson.id }, data: { order: other.order } }),
    prisma.lesson.update({ where: { id: other.id }, data: { order: lesson.order } }),
  ]);
  revalidatePath(`/admin/courses/${courseId}`);
}

/* Загрузка видео — маршрут /api/admin/lessons/[lessonId]/video (большие файлы потоком). */

export async function deleteLessonVideoAction(lessonId: string, courseId: string) {
  await requireAdmin();
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (lesson?.videoPath) {
    await fs.unlink(path.join(VIDEOS_DIR, lesson.videoPath)).catch(() => {});
  }
  await prisma.lesson.update({ where: { id: lessonId }, data: { videoPath: null } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function uploadMaterialAction(
  lessonId: string,
  courseId: string,
  formData: FormData
) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Выберите файл");
  }

  await ensureStorageDirs();
  const storedName = `${lessonId}-${Date.now()}-${safeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(MATERIALS_DIR, storedName), buffer);

  await prisma.material.create({
    data: {
      lessonId,
      fileName: file.name,
      filePath: storedName,
      mimeType: file.type || null,
      sizeBytes: file.size,
      downloadAllowed: formData.get("downloadAllowed") === "on",
    },
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function toggleMaterialDownloadAction(
  materialId: string,
  courseId: string,
  downloadAllowed: boolean
) {
  await requireAdmin();
  await prisma.material.update({ where: { id: materialId }, data: { downloadAllowed } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteMaterialAction(materialId: string, courseId: string) {
  await requireAdmin();
  const material = await prisma.material.findUnique({ where: { id: materialId } });
  if (material) {
    await fs.unlink(path.join(MATERIALS_DIR, material.filePath)).catch(() => {});
  }
  await prisma.material.delete({ where: { id: materialId } });
  revalidatePath(`/admin/courses/${courseId}`);
}
