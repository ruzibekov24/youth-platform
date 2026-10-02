import type { Metadata } from "next";
import { BackLink, PageHead } from "@/components/app/blocks";
import { IdeaForm } from "@/components/app/forms";
import { ShieldIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { ROLES, t } from "@/lib/strings.uz";
import { createIdea } from "../actions";

export const metadata: Metadata = { title: `${t.app.miya.form.title} · ${t.brand}` };

export default async function NewIdeaPage() {
  await requireUser();
  const f = t.app.miya.form;
  return (
    <>
      <BackLink href="/miya" />
      <PageHead title={f.title} lead={f.lead} />
      <IdeaForm action={createIdea} roles={ROLES} />
      <p className="meta qr-note" style={{ marginTop: 16 }}>
        <ShieldIcon />
        <span>{t.app.miya.moderation}</span>
      </p>
    </>
  );
}
