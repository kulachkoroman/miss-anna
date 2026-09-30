import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResultSignature } from "@/lib/robokassa";

async function handle(request: NextRequest) {
  let params: URLSearchParams;
  if (request.method === "POST") {
    const form = await request.formData();
    params = new URLSearchParams();
    for (const [key, value] of form.entries()) params.set(key, String(value));
  } else {
    params = request.nextUrl.searchParams;
  }

  const outSum = params.get("OutSum") ?? "";
  const invId = params.get("InvId") ?? "";
  const signature = params.get("SignatureValue") ?? "";

  if (!outSum || !invId || !signature) {
    return new NextResponse("bad request", { status: 400 });
  }

  if (!verifyResultSignature({ outSum, invId, signature })) {
    return new NextResponse("bad signature", { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { invoiceId: Number(invId) },
  });
  if (!payment) {
    return new NextResponse("payment not found", { status: 400 });
  }

  if (payment.status !== "SUCCESS") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
          rawResult: JSON.stringify(Object.fromEntries(params)),
        },
      }),
      prisma.enrollment.upsert({
        where: {
          userId_courseId: { userId: payment.userId, courseId: payment.courseId },
        },
        update: {},
        create: {
          userId: payment.userId,
          courseId: payment.courseId,
          source: "PAYMENT",
        },
      }),
    ]);
  }

  // Robokassa requires exactly this response body to acknowledge the notification.
  return new NextResponse(`OK${invId}`);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
