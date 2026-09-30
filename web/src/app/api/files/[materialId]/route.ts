import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { MATERIALS_DIR } from "@/lib/storage";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ materialId: string }> }
) {
  const { materialId } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { lesson: { include: { module: true } } },
  });
  if (!material) return new Response("Not found", { status: 404 });

  if (user.role !== "ADMIN") {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId: material.lesson.module.courseId },
      },
    });
    if (!enrollment) return new Response("Forbidden", { status: 403 });
  }

  const filePath = path.join(MATERIALS_DIR, material.filePath);
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const disposition = material.downloadAllowed
    ? `attachment; filename="${encodeURIComponent(material.fileName)}"`
    : `inline; filename="${encodeURIComponent(material.fileName)}"`;

  const stream = fs.createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": material.mimeType || "application/octet-stream",
      "Content-Length": String(stat.size),
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-store",
    },
  });
}
