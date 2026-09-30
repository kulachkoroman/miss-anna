import Marquee from "@/components/ui/Marquee";
import { PRACTICE_SINCE } from "@/content/site";

/**
 * Узкая движущаяся полоса сразу под первым экраном.
 *
 * Здесь только подтверждённые факты — ничего рекламного и придуманного.
 * Полоса намеренно тонкая: это ритмическая пауза, а не отдельный блок.
 */
const items = [
  "3 × 100 баллов на ЕГЭ",
  `Готовлю к экзаменам с ${PRACTICE_SINCE} года`,
  "Диплом ТОГУ: русский язык и литература",
  "Занятия онлайн из любого города",
  "Бесплатный пробный урок",
  "Проверка домашних заданий с обратной связью",
  "Все ученики сдали итоговое сочинение с первой попытки",
];

export default function TrustBar() {
  return (
    <div className="bg-brand-gradient texture-grain relative z-10 py-3 text-white sm:py-3.5">
      <Marquee items={items} duration={50} className="relative" />
    </div>
  );
}
