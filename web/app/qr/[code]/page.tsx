import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSessionByCode } from "@/lib/clubs";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/strings.uz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `QR · ${t.brand}`, robots: { index: false } };

// Sensorli doska uchun: sessiya QR kodi. Kod boshqa joyda ham ochiq emas (bazadagi checkin_code).
export default async function QrPage({ params }: PageProps<"/qr/[code]">) {
  const { code } = await params;
  const session = await getSessionByCode(code);
  if (!session) notFound();

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const svg = await QRCode.toString(`${site}/qatnashish/${code}`, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-10 text-center">
      <p className="text-lg text-muted">{session.clubs.name}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{session.topic}</h1>
      <p className="text-muted">{formatDateTime(session.starts_at)}</p>
      <div
        className="w-full max-w-sm rounded-card border border-line bg-white p-4 [&>svg]:h-auto [&>svg]:w-full"
        role="img"
        aria-label={t.club.qrLabel}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="max-w-sm text-sm text-muted">{t.club.qrHint}</p>
    </main>
  );
}
