/**
 * Выгружает разметку тренажёра словарных слов в таблицу для проверки Анной.
 * Запуск: npx tsx scripts/export-words-check.ts <путь к .csv>
 * Заодно проверяет разметку: при ошибке в списках упадёт с понятным текстом.
 */
import { writeFileSync } from "node:fs";
import { ALL_CARDS, DECKS, JOIN_LABELS, maskedWord } from "@/lib/words/cards";

const out = process.argv[2];
if (!out) throw new Error("Укажите путь к .csv");

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
const rows = [["Колода", "Раздел", "Как видит ученик", "Варианты ответа", "Правильный ответ", "Пояснение", "Замечание Анны"]];

for (const card of ALL_CARDS) {
  const deck = DECKS.find((d) => d.id === card.deck)!.short;
  if (card.kind === "gap") {
    rows.push([
      deck,
      card.group,
      maskedWord(card),
      card.gaps.map(([a, b]) => `${a} / ${b}`).join(";  "),
      card.word,
      card.note ?? "",
      "",
    ]);
  } else {
    rows.push([deck, card.group, maskedWord(card), "слитно / раздельно / через дефис", `${card.word} (${JOIN_LABELS[card.answer]})`, "", ""]);
  }
}

// BOM и «;» — чтобы русский Excel открыл файл двойным щелчком без кракозябр.
writeFileSync(out, "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n"), "utf8");

for (const deck of DECKS) console.log(`${deck.title}: ${ALL_CARDS.filter((c) => c.deck === deck.id).length}`);
console.log(`Сохранено: ${out}`);
