import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DECKS, isDeckId, toPublicCard } from "@/lib/words/cards";
import { getTodayQueue } from "@/lib/words/schedule";
import WordTrainer from "@/components/words/WordTrainer";

export const metadata: Metadata = { title: "Занятие — словарные слова" };

/** Занятие на сегодня: сначала повторы, потом новые слова. */
export default async function WordsSessionPage(props: PageProps<"/cabinet/words/[deck]">) {
  const { deck } = await props.params;
  if (!isDeckId(deck)) notFound();
  const user = await getCurrentUser();
  if (!user) return null;

  const { review, fresh } = await getTodayQueue(user.id, deck);
  const title = DECKS.find((d) => d.id === deck)!.title;

  return <WordTrainer deckTitle={title} cards={[...review, ...fresh].map(toPublicCard)} />;
}
