"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition } from "@/lib/motion";

/**
 * Переход между страницами.
 *
 * Намеренно короткий (около 0,3 с) и почти без сдвига: задача — убрать резкую
 * подмену содержимого, а не заставить человека ждать анимацию.
 *
 * key={pathname} перезапускает появление при каждой смене адреса.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
