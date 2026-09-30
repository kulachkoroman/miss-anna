"use client";

import Icon from "@/components/ui/Icon";

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
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name="play" className="h-6 w-6" />
        </span>
        <p className="text-[var(--color-ink-soft)]">Видео для этого урока пока не загружено</p>
        <p className="max-w-xs text-caption text-[var(--color-ink-muted)]">
          Материалы урока, если они есть, доступны ниже.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-panel bg-black shadow-lift">
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
