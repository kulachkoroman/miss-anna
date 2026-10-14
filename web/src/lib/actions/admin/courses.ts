"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { VIDEOS_DIR, MATERIALS_DIR, ensureStorageDirs, safeFileName } from "@/lib/storage";

function slugify(input: string) {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
    й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
    у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
    э: "e", ю: "yu", я: "ya",
  };
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((ch) => translit[ch] ?? ch)
    .join("");
  return (
    transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `course-${Date.now()}`
  );
}

export async function createCourseAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Название обязательно");

  let slug = slugify(title);
  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const isFree = formData.get("isFree") === "on";

  const course = await prisma.course.create({
    data: {
      slug,
      title,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      forWhom: String(formData.get("forWhom") ?? "") || null,
      duration: String(formData.get("duration") ?? "") || null,
      whatsIncluded: String(formData.get("whatsIncluded") ?? "") || null,
      isFree,
      priceRub: isFree ? 0 : Number(formData.get("priceRub") ?? 0),
      published: formData.get("published") === "on",
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  await requireAdmin();

  const isFree = formData.get("isFree") === "on";

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title: String(formData.get("title") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      forWhom: String(formData.get("forWhom") ?? "") || null,
      duration: String(formData.get("duration") ?? "") || null,
      whatsIncluded: String(formData.get("whatsIncluded") ?? "") || null,
      isFree,
      priceRub: isFree ? 0 : Number(formData.get("priceRub") ?? 0),
      published: formData.get("published") === "on",
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function deleteCourseAction(courseId: string) {
  await requireAdmin();

  const paymentsCount = await prisma.payment.count({ where: { courseId } });
  if (paymentsCount > 0) {
    throw new Error(
      "У курса есть история платежей — удаление запрещено. Снимите курс с публикации вместо удаления."
    );
  }

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function createModuleAction(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Название модуля обязательно");

  const count = await prisma.module.count({ where: { courseId } });
  await prisma.module.create({ data: { courseId, title, order: count + 1 } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateModuleAction(moduleId: string, formData: FormData) {
  await requireAdmin();
  const mod = await prisma.module.update({
    where: { id: moduleId },
    data: { title: String(formData.get("title") ?? "") },
  });
  revalidatePath(`/admin/courses/${mod.courseId}`);
}

export async function deleteModuleAction(moduleId: string) {
  await requireAdmin();
  const mod = await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/admin/courses/${mod.courseId}`);
}

export async function moveModuleAction(moduleId: string, direction: "up" | "down") {
  await requireAdmin();
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) return;
  const siblings = await prisma.module.findMany({
    where: { courseId: mod.courseId },
    orderBy: { order: "asc" },
  });
  const idx = siblings.findIndex((m) => m.id === moduleId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  const other = siblings[swapIdx];
  await prisma.$transaction([
    prisma.module.update({ where: { id: mod.id }, data: { order: other.order } }),
    prisma.module.update({ where: { id: other.id }, data: { order: mod.order } }),
  ]);
  revalidatePath(`/admin/courses/${mod.courseId}`);
}

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

const PUBLIC_COVERS_DIR = path.join(process.cwd(), "public", "uploads", "covers");

export async function uploadCourseCoverAction(courseId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("cover");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Выберите изображение");
  }

  await fs.mkdir(PUBLIC_COVERS_DIR, { recursive: true });
  const fileName = `${courseId}-${Date.now()}-${safeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(PUBLIC_COVERS_DIR, fileName), buffer);

  await prisma.course.update({
    where: { id: courseId },
    data: { coverImage: `/uploads/covers/${fileName}` },
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/courses");
  revalidatePath("/");
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
