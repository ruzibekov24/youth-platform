import type { Metadata } from "next";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterChip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = {
  title: `${t.gallery.title} · ${t.brand}`,
  robots: { index: false },
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-8">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

const swatches = [
  ["bg-bg border border-line", "bg"],
  ["bg-surface", "surface"],
  ["bg-line", "line"],
  ["bg-ink", "ink"],
  ["bg-muted", "muted"],
  ["bg-accent", "accent"],
  ["bg-accent-soft", "accent-soft"],
  ["bg-ok", "ok"],
  ["bg-warn", "warn"],
  ["bg-danger", "danger"],
];

export default function DesignGallery() {
  return (
    <main className="flex-1 py-12">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{t.gallery.title}</h1>
        <p className="mt-2 text-muted">{t.gallery.intro}</p>

        <Block title="Ranglar">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {swatches.map(([cls, name]) => (
              <div key={name}>
                <div className={`h-14 rounded-xl ${cls}`} />
                <p className="mt-1.5 text-xs text-muted">{name}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Tipografiya">
          <p className="text-4xl font-semibold tracking-tight">Sarlavha 1</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">Sarlavha 2</p>
          <p className="mt-2 text-base">Asosiy matn: aniq, qisqa va doʻstona.</p>
          <p className="mt-2 text-sm text-muted">Yordamchi matn va izohlar.</p>
        </Block>

        <Block title="Tugmalar">
          <div className="flex flex-wrap gap-3">
            <Button>Asosiy</Button>
            <Button variant="secondary">Ikkinchi darajali</Button>
            <Button variant="ghost">Yengil</Button>
            <Button variant="danger">Oʻchirish</Button>
            <Button disabled>Faol emas</Button>
            <ButtonLink href="/design" variant="secondary">
              Havola-tugma
            </ButtonLink>
          </div>
        </Block>

        <Block title="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge>Oddiy</Badge>
            <Badge tone="accent">Klub</Badge>
            <Badge tone="ok">Ochiq</Badge>
            <Badge tone="warn">3 kun qoldi</Badge>
            <Badge tone="danger">Yopilgan</Badge>
            <SampleBadge />
          </div>
        </Block>

        <Block title="Karta">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between">
                <Badge tone="accent">Klub</Badge>
                <SampleBadge />
              </div>
              <h3 className="mt-3 text-lg font-semibold">Speaking Club</h3>
              <p className="mt-1 text-sm text-muted">
                Har hafta ingliz tilida erkin suhbat.
              </p>
            </Card>
            <EmptyState
              title="Hozircha boʻsh"
              text="Birinchi klubga qoʻshiling, shu yerda koʻrinadi."
              action={<ButtonLink href="/design">Klublarni koʻrish</ButtonLink>}
            />
          </div>
        </Block>

        <Block title="Forma">
          <div className="grid max-w-md gap-4">
            <Field label="Ism" hint="Laqab ham boʻladi.">
              <Input placeholder="Ismingiz" />
            </Field>
            <Field label="Hudud">
              <Select defaultValue="">
                <option value="" disabled>
                  Tanlang
                </option>
                <option>Toshkent</option>
                <option>Samarqand</option>
              </Select>
            </Field>
            <Field label="Qisqa tavsif">
              <Textarea placeholder="Nima haqida?" />
            </Field>
          </div>
        </Block>

        <Block title="Filtr">
          <div className="flex flex-wrap gap-2">
            <FilterChip href="/design" active>
              Hammasi
            </FilterChip>
            <FilterChip href="/design">Stipendiya</FilterChip>
            <FilterChip href="/design">Dastur</FilterChip>
            <FilterChip href="/design">Tanlov</FilterChip>
          </div>
        </Block>
      </Container>
    </main>
  );
}
