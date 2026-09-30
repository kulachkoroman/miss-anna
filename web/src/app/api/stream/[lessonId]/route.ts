import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { VIDEOS_DIR } from "@/lib/storage";

function guessVideoType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".ogg") return "video/ogg";
  return "video/mp4";
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  });
  if (!lesson || !lesson.videoPath) return new Response("Not found", { status: 404 });

  if (user.role !== "ADMIN") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: lesson.module.courseId } },
    });
    if (!enrollment) return new Response("Forbidden", { status: 403 });
  }

  const filePath = path.join(VIDEOS_DIR, lesson.videoPath);
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const contentType = guessVideoType(filePath);
  const range = request.headers.get("range");

  const baseHeaders = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  };

  if (!range) {
    const stream = fs.createReadStream(filePath);
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      status: 200,
      headers: { ...baseHeaders, "Content-Length": String(stat.size) },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  const start = match?.[1] ? parseInt(match[1], 10) : 0;
  const end = match?.[2] ? parseInt(match[2], 10) : stat.size - 1;
  const chunkSize = end - start + 1;

  const stream = fs.createReadStream(filePath, { start, end });
  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    status: 206,
    headers: {
      ...baseHeaders,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Content-Length": String(chunkSize),
    },
  });
}
