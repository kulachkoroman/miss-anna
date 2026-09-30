import path from "node:path";
import fs from "node:fs/promises";

export const STORAGE_ROOT = path.join(process.cwd(), "storage");
export const VIDEOS_DIR = path.join(STORAGE_ROOT, "videos");
export const MATERIALS_DIR = path.join(STORAGE_ROOT, "materials");
export const COVERS_DIR = path.join(STORAGE_ROOT, "covers");

export async function ensureStorageDirs() {
  await fs.mkdir(VIDEOS_DIR, { recursive: true });
  await fs.mkdir(MATERIALS_DIR, { recursive: true });
  await fs.mkdir(COVERS_DIR, { recursive: true });
}

export function safeFileName(original: string) {
  return original.replace(/[^a-zA-Z0-9.\-_а-яА-ЯёЁ ]/g, "_").slice(-120);
}
