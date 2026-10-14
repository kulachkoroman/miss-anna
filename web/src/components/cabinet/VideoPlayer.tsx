"use client";

import Icon from "@/components/ui/Icon";
import { LESSON_TEXTS } from "@/content/course";

/**
 * Плеер урока.
 *
 * Видео отдаётся не файлом, а через защищённый маршрут /api/stream, который
 * на каждый запрос проверяет доступ к курсу. Здесь — вторая половина той же
 * защиты: убраны кнопка скачивания, трансляция на другие устройства и
 * контекстное меню. Полностью закрыть возможность записи экрана нельзя,
 * но лёгкие способы сохранить файл перекрыты.
 */
export default function VideoPlayer({
  lessonId,
  hasVideo,
}: {
  lessonId: string;
  hasVideo: boolean;
}) {
  if (!hasVideo) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-panel border-2 border-dashed border-[var(--color-ink)]/40 bg-[var(--color-surface-alt)] text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name="play" className="h-6 w-6" />
        </span>
        <p className="font-semibold text-[var(--color-ink)]">Видео скоро появится</p>
        <p className="max-w-xs px-4 text-caption text-[var(--color-ink-muted)]">{LESSON_TEXTS.videoSoon}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-black shadow-hard">
      <video
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="aspect-video w-full"
        src={`/api/stream/${lessonId}`}
      />
    </div>
  );
}
