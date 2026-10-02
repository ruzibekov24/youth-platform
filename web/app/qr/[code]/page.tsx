import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSessionByCode } from "@/lib/clubs";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import "@/components/app/app.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `QR · ${t.brand}`, robots: { index: false } };

// Sensorli doska uchun: sessiya QR kodi (bazadagi checkin_code). Tashkilotchi sessiyada ochib qo'yadi.
export default async function QrPage(props: PageProps<"/qr/[code]">) {
  const { code } = await props.params;
  const session = await getSessionByCode(code);
  if (!session) notFound();

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const svg = await QRCode.toString(`${site}/qatnashish/${code}`, { type: "svg", margin: 1, errorCorrectionLevel: "M" });

  return (
    <main className="qr-page">
      <p className="eyebrow">{session.clubs.name}</p>
      <h1>{session.topic}</h1>
      <p className="muted" style={{ margin: 0 }}>
        {formatDateTime(session.starts_at)}
      </p>
      <div className="qr-box" role="img" aria-label={t.club.qrLabel} dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="muted" style={{ margin: 0, maxWidth: 380, fontSize: 14 }}>
        {t.club.qrHint}
      </p>
    </main>
  );
}
