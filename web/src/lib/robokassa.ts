import crypto from "node:crypto";

const PAYMENT_URL = "https://auth.robokassa.ru/Merchant/Index.aspx";

function md5(input: string) {
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

function outSum(amountRub: number) {
  return amountRub.toFixed(2);
}

export function buildPaymentUrl({
  invoiceId,
  amountRub,
  description,
  email,
}: {
  invoiceId: number;
  amountRub: number;
  description: string;
  email?: string | null;
}) {
  const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN!;
  const password1 = process.env.ROBOKASSA_PASSWORD1!;
  const sum = outSum(amountRub);

  const signature = md5(`${merchantLogin}:${sum}:${invoiceId}:${password1}`);

  const params = new URLSearchParams({
    MerchantLogin: merchantLogin,
    OutSum: sum,
    InvId: String(invoiceId),
    Description: description,
    SignatureValue: signature,
    Culture: "ru",
  });
  if (email) params.set("Email", email);
  if (process.env.ROBOKASSA_TEST_MODE === "1") params.set("IsTest", "1");

  return `${PAYMENT_URL}?${params.toString()}`;
}

/**
 * Verifies the signature on Robokassa's Result URL (server-to-server) notification.
 * Robokassa sends: OutSum, InvId, SignatureValue (+ optional Shp_ params, not used here).
 * Expected signature = md5(`${OutSum}:${InvId}:${Password2}`)
 */
export function verifyResultSignature({
  outSum: sum,
  invId,
  signature,
}: {
  outSum: string;
  invId: string;
  signature: string;
}) {
  const password2 = process.env.ROBOKASSA_PASSWORD2!;
  const expected = md5(`${sum}:${invId}:${password2}`);
  return expected.toLowerCase() === signature.toLowerCase();
}

/** Generates a numeric invoice id that fits Robokassa's InvId (32-bit unsigned) range. */
export function generateInvoiceId() {
  // Timestamp-based, kept under 2^31-1; collisions are re-tried by the caller via the DB unique constraint.
  return Number(String(Date.now()).slice(-9) + String(Math.floor(Math.random() * 10)));
}
