"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Загрузка видео урока с полосой прогресса.
 * Отправляет файл на /api/admin/lessons/[id]/video (там он пишется на диск
 * потоком) и после успеха обновляет страницу.
 */
export default function VideoUploader({ lessonId, hasVideo }: { lessonId: string; hasVideo: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setPercent(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/admin/lessons/${lessonId}/video`);
    xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setPercent(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setPercent(null);
      if (inputRef.current) inputRef.current.value = "";
      if (xhr.status >= 200 && xhr.status < 300) {
        router.refresh();
      } else {
        let message = "Не получилось загрузить видео.";
        try {
          message = JSON.parse(xhr.responseText).error ?? message;
        } catch {}
        setError(message);
      }
    };
    xhr.onerror = () => {
      setPercent(null);
      setError("Связь прервалась. Попробуй ещё раз.");
    };
    xhr.send(file);
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-ink)] shadow-hard-sm transition-[translate,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
        {hasVideo ? "Заменить видео" : "Загрузить видео"}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v,.webm"
          className="sr-only"
          disabled={percent !== null}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>

      {percent !== null && (
        <div className="mt-3">
          <div className="h-3 w-full max-w-sm overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
            <div className="h-full bg-[var(--color-primary)] transition-[width]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            Загружается… {percent}%. Не закрывай страницу, пока не дойдёт до конца.
          </p>
        </div>
      )}
      {error && <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">{error}</p>}
      <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
        Лучше всего MP4. Видео с iPhone (MOV) может не открыться в некоторых браузерах — тогда сохрани его в MP4.
      </p>
    </div>
  );
}
