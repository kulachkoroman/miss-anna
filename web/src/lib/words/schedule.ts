import { prisma } from "@/lib/prisma";
import { type Card, type DeckId, deckCards, getCard } from "@/lib/words/cards";

/**
 * Расписание тренажёра: какие слова показать ученику сегодня.
 *
 * Слово живёт на «ступенях» (box). Верный ответ поднимает его на ступень
 * и откладывает повтор: 1, 3, 7, 14, 30 дней. Ошибка возвращает на нулевую
 * ступень — слово придёт завтра. Верный ответ на 5-й ступени = выучено.
 *
 * В расписание идёт только первый ответ на слово за день: повтор ошибки
 * в конце того же занятия — тренировка, на ступени он не влияет.
 */

/** Новых слов в день на колоду. */
export const NEW_PER_DAY = 10;
/** Потолок повторений в день — чтобы после перерыва не ждала гора слов. */
export const MAX_REVIEWS_PER_DAY = 40;
/** Через сколько дней повтор, по ступени после ответа. */
export const INTERVAL_DAYS = [1, 1, 3, 7, 14, 30] as const;
export const TOP_BOX = 5;

const DAY_MS = 24 * 60 * 60 * 1000;
/** Сутки считаем по Москве: ученики Анны в основном в этом поясе. */
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Начало «сегодня» по Москве. */
export function dayStart(date = new Date()): Date {
  const shifted = date.getTime() + MSK_OFFSET_MS;
  return new Date(Math.floor(shifted / DAY_MS) * DAY_MS - MSK_OFFSET_MS);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Ключ дня «2026-10-14» по Москве. */
export function dayKey(date: Date): string {
  return new Date(date.getTime() + MSK_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * Стабильный «случайный» порядок новых слов для ученика: у каждого свой,
 * но при перезаходе тот же — иначе порция дня менялась бы от обновления.
 */
function orderKey(userId: string, cardId: string): number {
  let h = 2166136261;
  for (const ch of userId + cardId) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type TodayQueue = { review: Card[]; fresh: Card[] };

export async function getTodayQueue(userId: string, deck: DeckId): Promise<TodayQueue> {
  const now = new Date();
  const today = dayStart(now);

  const [due, startedToday, known] = await Promise.all([
    prisma.wordProgress.findMany({
      where: { userId, deck, learnedAt: null, dueAt: { lte: now }, lastAnsweredAt: { lt: today } },
      orderBy: { dueAt: "asc" },
      take: MAX_REVIEWS_PER_DAY,
      select: { cardId: true },
    }),
    prisma.wordProgress.count({ where: { userId, deck, createdAt: { gte: today } } }),
    prisma.wordProgress.findMany({ where: { userId, deck }, select: { cardId: true } }),
  ]);

  const knownIds = new Set(known.map((p) => p.cardId));
  const freshLeft = Math.max(0, NEW_PER_DAY - startedToday);
  const fresh = deckCards(deck)
    .filter((card) => !knownIds.has(card.id))
    .sort((a, b) => orderKey(userId, a.id) - orderKey(userId, b.id))
    .slice(0, freshLeft);

  const review = due.map((p) => getCard(p.cardId)).filter((card): card is Card => Boolean(card));
  return { review, fresh };
}

export type ScheduleResult = { counted: boolean; learned: boolean };

/**
 * Записывает ответ в расписание. Повторный ответ на то же слово в тот же
 * день не засчитывается (counted: false) — ни в ступени, ни в статистике.
 */
export async function recordAnswer(
  userId: string,
  card: Card,
  correct: boolean,
  given: string
): Promise<ScheduleResult> {
  const now = new Date();
  const today = dayStart(now);
  const existing = await prisma.wordProgress.findUnique({
    where: { userId_cardId: { userId, cardId: card.id } },
  });
  if (existing && existing.lastAnsweredAt >= today) return { counted: false, learned: false };

  const box = correct ? Math.min((existing?.box ?? 0) + 1, TOP_BOX) : 0;
  const learned = correct && (existing?.box ?? 0) >= TOP_BOX;
  const data = {
    box,
    dueAt: addDays(today, INTERVAL_DAYS[box]),
    lastAnsweredAt: now,
    learnedAt: learned ? now : null,
  };
  const answer = { userId, cardId: card.id, deck: card.deck, correct, given };

  try {
    const counted = await prisma.$transaction(async (tx) => {
      if (existing) {
        // Условие на lastAnsweredAt: два одновременных ответа не засчитаются оба.
        const updated = await tx.wordProgress.updateMany({
          where: { id: existing.id, lastAnsweredAt: { lt: today } },
          data: {
            ...data,
            correctCount: { increment: correct ? 1 : 0 },
            wrongCount: { increment: correct ? 0 : 1 },
          },
        });
        if (updated.count === 0) return false;
      } else {
        await tx.wordProgress.create({
          data: {
            ...data,
            userId,
            cardId: card.id,
            deck: card.deck,
            correctCount: correct ? 1 : 0,
            wrongCount: correct ? 0 : 1,
          },
        });
      }
      await tx.wordAnswer.create({ data: answer });
      return true;
    });
    if (!counted) return { counted: false, learned: false };
  } catch (error) {
    // Двойное нажатие на новое слово: запись уже создал параллельный запрос.
    if (error instanceof Error && "code" in error && error.code === "P2002") return { counted: false, learned: false };
    throw error;
  }
  return { counted: true, learned };
}
