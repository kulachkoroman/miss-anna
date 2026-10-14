/**
 * Карточка в том виде, в каком она уходит в браузер ученика: без
 * правильного ответа. Ответ проверяет сервер (lib/actions/words.ts) —
 * так в статистику Анны попадают настоящие ответы.
 *
 * Файл без серверных зависимостей: его можно импортировать в клиентские
 * компоненты, не утаскивая в браузер весь список слов.
 */

/** С — слитно, Р — раздельно, Д — через дефис. */
export type JoinAnswer = "С" | "Р" | "Д";

export const JOIN_LABELS: Record<JoinAnswer, string> = { С: "слитно", Р: "раздельно", Д: "через дефис" };

/** Кусок слова: обычный текст или пропуск с номером. */
export type Segment = { text: string } | { gap: number };

export type PublicCard =
  | { kind: "gap"; id: string; segments: Segment[]; options: string[][]; note?: string }
  | { kind: "join"; id: string; before: string; paren: string; after: string };

export type AnswerResult =
  | {
      ok: true;
      correct: boolean;
      /** Правильное написание целиком. */
      word: string;
      /** Правильные буквы по пропускам или ["С"|"Р"|"Д"]. */
      right: string[];
      hint?: string;
      /** Слово только что стало выученным. */
      learned: boolean;
    }
  | { ok: false; error: string };
