"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { describeAnswer, getCardByPublicId, isCorrect, rightAnswer } from "@/lib/words/cards";
import { recordAnswer } from "@/lib/words/schedule";
import type { AnswerResult } from "@/lib/words/public";

const answerSchema = z.object({
  cardId: z.string().min(1).max(120),
  given: z.array(z.string().max(4)).min(1).max(2),
});

/**
 * Ответ ученика на карточку тренажёра. Кто отвечает — берём только из
 * сессии, правильность считаем здесь же: браузер не знает ответа и не
 * может записать прогресс за другого.
 */
export async function answerCardAction(cardId: string, given: string[]): Promise<AnswerResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт, чтобы прогресс сохранялся" };

  const parsed = answerSchema.safeParse({ cardId, given });
  if (!parsed.success) return { ok: false, error: "Не получилось проверить ответ" };

  const card = getCardByPublicId(parsed.data.cardId);
  if (!card) return { ok: false, error: "Такого слова нет в тренажёре" };

  const correct = isCorrect(card, parsed.data.given);
  const { learned } = await recordAnswer(user.id, card, correct, describeAnswer(card, parsed.data.given));

  return { ok: true, correct, word: card.word, right: rightAnswer(card), hint: card.hint, learned };
}
