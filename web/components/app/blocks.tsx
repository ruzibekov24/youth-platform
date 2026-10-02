import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon, FlagIcon } from "@/components/icons";
import { t } from "@/lib/strings.uz";

// Ilova sahifalari uchun kichik umumiy bloklar.

export function PageHead({ title, lead, action }: { title: string; lead?: string; action?: React.ReactNode }) {
  return (
    <div className="ph">
      <div>
        <h1>{title}</h1>
        {lead && <p className="ph-lead">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function SampleNotice() {
  return (
    <p className="notice">
      <span className="nm">{t.sample}</span> {t.app.sampleNotice}
    </p>
  );
}

export function Section({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sec">
      <div className="sec-h">
        <h2>{title}</h2>
        {href && (
          <Link href={href} className="more">
            {linkLabel ?? t.app.today.all} <ChevronRightIcon />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="back">
      <ArrowLeftIcon /> {t.app.back}
    </Link>
  );
}

// Har bir ommaviy obyektda "Xabar berish" bor (M9 da ishga tushadi).
export function ReportLink({ label = t.app.report }: { label?: string }) {
  return (
    <button type="button" className="report" disabled>
      <FlagIcon /> {label}
    </button>
  );
}
