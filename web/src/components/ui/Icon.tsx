import clsx from "clsx";

/**
 * Единый набор иконок сайта.
 *
 * Все иконки — контурные, в одной сетке 24×24 и одной толщине линии,
 * поэтому выглядят как один набор. Добавлять новые — только сюда.
 */

const paths = {
  check: "M4 12.5l5 5L20 6.5",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M17 7H9M17 7v8",
  chevronDown: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  play: "M8 5.5v13l11-6.5-11-6.5z",
  video:
    "M3 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM16 10.5l5-3v9l-5-3",
  send: "M21 4L3 11.5l6 2M21 4l-3 16-8-6.5M21 4L9 13.5m0 0v5.5",
  shield: "M12 3l7.5 3v5.4c0 4.3-3 8.1-7.5 9.6-4.5-1.5-7.5-5.3-7.5-9.6V6L12 3z",
  chat:
    "M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.9-.9L3 20.5l1.5-4.5A8.4 8.4 0 013 11.5 8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2",
  document:
    "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 14h6M9 17h4",
  star: "M12 3.5l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83L6.62 20.1l1.03-6L3.3 9.85l6-.87L12 3.5z",
  sparkle:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 13.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z",
  refresh: "M20 11a8 8 0 10-.9 4.6M20 5.5V11h-5.5",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  lock: "M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1zM8 11V8a4 4 0 118 0v3",
  card: "M3 9h18M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9zM6.5 15h3",
  pencil: "M4 20h4.5L19.5 9l-4.5-4.5L4 15.5V20zM13.5 6l4.5 4.5",
  graduation: "M12 4L2.5 9 12 14l9.5-5L12 4zM6.5 11.2V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.8",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={clsx("h-6 w-6 shrink-0", className)}
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
