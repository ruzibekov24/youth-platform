import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { NewIdeaForm } from "@/components/miya-forms";
import { requireUser } from "@/lib/auth";
import { t } from "@/lib/strings.uz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.miya.form.title} · ${t.brand}` };

export default async function NewIdeaPage() {
  await requireUser();
  return (
    <main className="flex-1 py-10">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">{t.miya.form.title}</h1>
        <p className="mt-1 mb-8 text-muted">{t.miya.form.lead}</p>
        <NewIdeaForm />
      </Container>
    </main>
  );
}
