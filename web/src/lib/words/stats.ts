import { prisma } from "@/lib/prisma";
import { DECKS, type DeckId, deckSize, getCard } from "@/lib/words/cards";
import { NEW_PER_DAY, MAX_REVIEWS_PER_DAY, addDays, dayKey, dayStart } from "@/lib/words/schedule";

/**
 * Статистика тренажёра — одна и та же для кабинета ученика и для админки,
 * чтобы Анна видела ровно те цифры, что и ученик.
 */

export type DeckSummary = {
  deck: DeckId;
  title: string;
  total: number;
  learned: number;
  /** Начаты, но ещё не выучены. */
  inProgress: number;
  /** Сколько слов ждёт сегодня: повторы + новые. */
  reviewToday: number;
  freshToday: number;
};

export async function getDeckSummaries(userId: string): Promise<DeckSummary[]> {
  const now = new Date();
  const today = dayStart(now);
  const rows = await prisma.wordProgress.findMany({
    where: { userId },
    select: { deck: true, learnedAt: true, dueAt: true, lastAnsweredAt: true, createdAt: true },
  });

  return DECKS.map(({ id, title }) => {
    const mine = rows.filter((r) => r.deck === id);
    const learned = mine.filter((r) => r.learnedAt).length;
    const due = mine.filter((r) => !r.learnedAt && r.dueAt <= now && r.lastAnsweredAt < today).length;
    const startedToday = mine.filter((r) => r.createdAt >= today).length;
    const total = deckSize(id);
    return {
      deck: id,
      title,
      total,
      learned,
      inProgress: mine.length - learned,
      reviewToday: Math.min(due, MAX_REVIEWS_PER_DAY),
      freshToday: Math.min(Math.max(0, NEW_PER_DAY - startedToday), total - mine.length),
    };
  });
}

export type DayActivity = { day: string; correct: number; wrong: number };

/** Ответы по дням за последние `days` дней (сегодня — последний). */
export async function getActivity(userId: string, days = 14): Promise<DayActivity[]> {
  const from = addDays(dayStart(), -(days - 1));
  const answers = await prisma.wordAnswer.findMany({
    where: { userId, createdAt: { gte: from } },
    select: { createdAt: true, correct: true },
  });
  const result: DayActivity[] = Array.from({ length: days }, (_, i) => ({
    day: dayKey(addDays(from, i)),
    correct: 0,
    wrong: 0,
  }));
  const byDay = new Map(result.map((d) => [d.day, d]));
  for (const a of answers) {
    const d = byDay.get(dayKey(a.createdAt));
    if (d) d[a.correct ? "correct" : "wrong"] += 1;
  }
  return result;
}

/** Сколько дней подряд ученик занимался — по сегодня или по вчера включительно. */
export async function getStreak(userId: string): Promise<number> {
  const answers = await prisma.wordAnswer.findMany({
    where: { userId, createdAt: { gte: addDays(dayStart(), -365) } },
    select: { createdAt: true },
  });
  const days = new Set(answers.map((a) => dayKey(a.createdAt)));
  let cursor = dayStart();
  if (!days.has(dayKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export type Mistake = {
  cardId: string;
  word: string;
  deckTitle: string;
  group: string;
  wrong: number;
  right: number;
  learned: boolean;
  /** Что ученик написал в последней ошибке: «в плавь». */
  lastWrongGiven: string | null;
  lastWrongAt: Date | null;
};

/** Слова с ошибками: сначала самые частые, при равенстве — недавние. */
export async function getMistakes(userId: string, limit?: number): Promise<Mistake[]> {
  const [progress, wrongAnswers] = await Promise.all([
    prisma.wordProgress.findMany({
      where: { userId, wrongCount: { gt: 0 } },
      orderBy: [{ wrongCount: "desc" }, { lastAnsweredAt: "desc" }],
      take: limit,
    }),
    prisma.wordAnswer.findMany({
      where: { userId, correct: false },
      orderBy: { createdAt: "desc" },
      select: { cardId: true, given: true, createdAt: true },
    }),
  ]);

  const lastWrong = new Map<string, { given: string; createdAt: Date }>();
  for (const a of wrongAnswers) if (!lastWrong.has(a.cardId)) lastWrong.set(a.cardId, a);

  return progress.flatMap((p) => {
    const card = getCard(p.cardId);
    if (!card) return [];
    const last = lastWrong.get(p.cardId);
    return [
      {
        cardId: p.cardId,
        word: card.word,
        deckTitle: DECKS.find((d) => d.id === card.deck)!.short,
        group: card.group,
        wrong: p.wrongCount,
        right: p.correctCount,
        learned: Boolean(p.learnedAt),
        lastWrongGiven: last?.given ?? null,
        lastWrongAt: last?.createdAt ?? null,
      },
    ];
  });
}

export type UserWordsOverview = { learned: number; started: number; mistakes: number; lastActiveAt: Date | null };

/** Короткая сводка по многим ученикам сразу — для списка в админке. */
export async function getWordsOverview(userIds: string[]): Promise<Map<string, UserWordsOverview>> {
  const [all, learned] = await Promise.all([
    prisma.wordProgress.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { _all: true },
      _sum: { wrongCount: true },
      _max: { lastAnsweredAt: true },
    }),
    prisma.wordProgress.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, learnedAt: { not: null } },
      _count: { _all: true },
    }),
  ]);
  const learnedBy = new Map(learned.map((r) => [r.userId, r._count._all]));
  return new Map(
    all.map((r) => [
      r.userId,
      {
        started: r._count._all,
        learned: learnedBy.get(r.userId) ?? 0,
        mistakes: r._sum.wrongCount ?? 0,
        lastActiveAt: r._max.lastAnsweredAt,
      },
    ])
  );
}
