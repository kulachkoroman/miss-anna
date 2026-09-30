"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildPaymentUrl, generateInvoiceId } from "@/lib/robokassa";
import { redirect } from "next/navigation";

export async function createPaymentAction(courseSlug: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/?auth=1`);

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.published) redirect("/courses");
  if (course.isFree) redirect(`/courses/${courseSlug}`);

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (existing) redirect(`/cabinet/courses/${courseSlug}`);

  let invoiceId = generateInvoiceId();
  for (let attempt = 0; attempt < 5; attempt++) {
    const clash = await prisma.payment.findUnique({ where: { invoiceId } });
    if (!clash) break;
    invoiceId = generateInvoiceId();
  }

  await prisma.payment.create({
    data: {
      invoiceId,
      userId: user.id,
      courseId: course.id,
      amountRub: course.priceRub,
      status: "PENDING",
    },
  });

  const url = buildPaymentUrl({
    invoiceId,
    amountRub: course.priceRub,
    description: `Оплата курса «${course.title}»`,
    email: user.email,
  });

  redirect(url);
}
