import { DICTIONARY_WORDS } from "@/content/words/dictionary";
import { EGE14_GROUPS } from "@/content/words/ege14";
import { WORD_HINTS } from "@/content/words/hints";

/**
 * Карточки тренажёра словарных слов, собранные из размеченных списков
 * в src/content/words. Разметка описана в самих списках.
 *
 * id карточки = колода + правильное написание. По нему хранится прогресс
 * ученика, поэтому исправление опечатки в слове начинает его «с нуля» —
 * для одного слова это нормально.
 */

export type DeckId = "dictionary" | "ege14";

export const DECKS: { id: DeckId; title: string; short: string; description: string }[] = [
  {
    id: "dictionary",
    title: "Словарные слова",
    short: "Словарные",
    description: "Буквы, которые нельзя проверить правилом: акв_рель, ко_ектив.",
  },
  {
    id: "ege14",
    title: "Слитно, раздельно, дефис",
    short: "№14 ЕГЭ",
    description: "Наречия, предлоги, союзы и частицы из задания №14: (в)плавь, (на)ощупь.",
  },
];

export function isDeckId(value: string): value is DeckId {
  return value === "dictionary" || value === "ege14";
}

/** Кусок слова: обычный текст или пропуск с номером. */
export type Segment = { text: string } | { gap: number };

export type GapCard = {
  kind: "gap";
  id: string;
  deck: "dictionary";
  /** Буква алфавита — раздел в списке. */
  group: string;
  word: string;
  segments: Segment[];
  /** Варианты для каждого пропуска, правильный — первый. */
  gaps: [string, string][];
  note?: string;
  hint?: string;
};

/** С — слитно, Р — раздельно, Д — через дефис. */
export type JoinAnswer = "С" | "Р" | "Д";

export type JoinCard = {
  kind: "join";
  id: string;
  deck: "ege14";
  /** Раздел из файла: предлоги, наречия… */
  group: string;
  word: string;
  /** Как в ЕГЭ: before + «(paren)» + after. */
  before: string;
  paren: string;
  after: string;
  answer: JoinAnswer;
  hint?: string;
};

export type Card = GapCard | JoinCard;

export const JOIN_LABELS: Record<JoinAnswer, string> = { С: "слитно", Р: "раздельно", Д: "через дефис" };

const JOIN_SEPARATOR: Record<JoinAnswer, string> = { С: "", Р: " ", Д: "-" };

function parseGapCard(raw: string): GapCard {
  const noteMatch = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const body = noteMatch ? noteMatch[1] : raw;
  const note = noteMatch ? noteMatch[2] : undefined;

  const segments: Segment[] = [];
  const gaps: [string, string][] = [];
  let word = "";
  const re = /\[([^/\]]+)\/([^\]]+)\]/g;
  let last = 0;
  for (const m of body.matchAll(re)) {
    const index = m.index ?? 0;
    if (index > last) segments.push({ text: body.slice(last, index) });
    word += body.slice(last, index) + m[1];
    segments.push({ gap: gaps.length });
    gaps.push([m[1], m[2]]);
    last = index + m[0].length;
  }
  if (last < body.length) segments.push({ text: body.slice(last) });
  word += body.slice(last);

  if (gaps.length === 0 || gaps.length > 2) throw new Error(`Словарное слово «${raw}»: нужен 1–2 пропуска`);
  if (gaps.some(([a, b]) => a === b)) throw new Error(`Словарное слово «${raw}»: варианты совпадают`);

  return {
    kind: "gap",
    id: `d:${word}`,
    deck: "dictionary",
    group: word[0].toUpperCase(),
    word,
    segments,
    gaps,
    note,
    hint: WORD_HINTS[word],
  };
}

function parseJoinCard(raw: string, group: string): JoinCard {
  const m = raw.match(/^([СРД]):(.*?)\(([^)]+)\)(.*?)(?:=(.+))?$/);
  if (!m) throw new Error(`Слово к №14 «${raw}»: не разобрать разметку`);
  const [, answer, before, paren, after, override] = m as unknown as [string, JoinAnswer, string, string, string, string?];
  const word = override ?? `${before}${paren}${JOIN_SEPARATOR[answer]}${after}`;
  return {
    kind: "join",
    id: `e:${word}`,
    deck: "ege14",
    group,
    word,
    before,
    paren,
    after,
    answer,
    hint: WORD_HINTS[word],
  };
}

function buildCards(): Card[] {
  const cards: Card[] = [
    ...DICTIONARY_WORDS.map(parseGapCard),
    ...EGE14_GROUPS.flatMap((g) => g.items.map((item) => parseJoinCard(item, g.title))),
  ];
  const seen = new Set<string>();
  for (const card of cards) {
    if (seen.has(card.id)) throw new Error(`Слово «${card.word}» повторяется в колоде`);
    seen.add(card.id);
  }
  return cards;
}

export const ALL_CARDS: Card[] = buildCards();

const CARD_BY_ID = new Map(ALL_CARDS.map((card) => [card.id, card]));

export function getCard(id: string): Card | undefined {
  return CARD_BY_ID.get(id);
}

export function deckCards(deck: DeckId): Card[] {
  return ALL_CARDS.filter((card) => card.deck === deck);
}

export function deckSize(deck: DeckId): number {
  return deckCards(deck).length;
}

/** Слово с пропусками для показа: «акв_рель». */
export function maskedWord(card: Card): string {
  if (card.kind === "join") return `${card.before}(${card.paren})${card.after}`;
  return card.segments.map((s) => ("gap" in s ? "_".repeat(card.gaps[s.gap][0].length) : s.text)).join("");
}

/** Что ответил ученик, в читаемом виде: «акварель» / «в плавь». */
export function describeAnswer(card: Card, given: string[]): string {
  if (card.kind === "join") {
    const answer = given[0] as JoinAnswer;
    if (!(answer in JOIN_SEPARATOR)) return "—";
    return `${card.before}${card.paren}${JOIN_SEPARATOR[answer]}${card.after}`;
  }
  return card.segments.map((s) => ("gap" in s ? (given[s.gap] ?? "_") : s.text)).join("");
}

/** Проверка ответа. given: для словарных — буквы по пропускам, для №14 — ["С"|"Р"|"Д"]. */
export function isCorrect(card: Card, given: string[]): boolean {
  if (card.kind === "join") return given.length === 1 && given[0] === card.answer;
  return given.length === card.gaps.length && card.gaps.every(([right], i) => given[i] === right);
}
