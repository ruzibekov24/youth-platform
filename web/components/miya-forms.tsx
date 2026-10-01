"use client";

import { useActionState } from "react";
import { createIdea, requestJoin, type FormState } from "@/app/miya/actions";
import { ButtonLink, Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ROLES, t } from "@/lib/strings.uz";

const idle: FormState = { status: "idle" };

export function NewIdeaForm() {
  const [state, action, pending] = useActionState(createIdea, idle);
  const f = t.miya.form;

  if (state.status === "ok") {
    return (
      <div role="status">
        <h2 className="text-xl font-semibold">{f.sentTitle}</h2>
        <p className="mt-2 text-muted">{f.sentText}</p>
        <div className="mt-6">
          <ButtonLink href="/profil" variant="secondary">
            {t.profile.title}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <Field label={f.fTitle} hint={f.fTitleHint}>
        <Input name="title" required minLength={3} maxLength={80} />
      </Field>
      <Field label={f.fProblem} hint={f.fProblemHint}>
        <Textarea name="problem" required minLength={10} maxLength={500} />
      </Field>
      <Field label={f.fDescription} hint={f.fDescriptionHint}>
        <Textarea name="description" required minLength={10} maxLength={2000} className="min-h-40" />
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">{f.fRoles}</legend>
        <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
          {ROLES.map((r) => (
            <label key={r} className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" name="roles" value={r} className="size-5" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
      {state.status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {f.submit}
      </Button>
    </form>
  );
}

export function JoinForm({ ideaId, roles }: { ideaId: string; roles: string[] }) {
  const [state, action, pending] = useActionState(requestJoin.bind(null, ideaId), idle);
  const j = t.miya.join;

  if (state.status === "ok") {
    return (
      <p className="font-medium text-ok" role="status">
        {j.sent}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <Field label={j.role}>
        <Select name="role" required defaultValue="">
          <option value="" disabled>
            …
          </option>
          {[...new Set([...roles, t.common.other])].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={j.message}>
        <Textarea name="message" required maxLength={500} className="min-h-24" />
      </Field>
      {state.status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {j.submit}
      </Button>
    </form>
  );
}
