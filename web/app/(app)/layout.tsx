import { AppShell } from "@/components/app/shell";

// Hamma ilova sahifalari bazadan o'qiydi va sessiyaga bog'liq: build paytida statik yig'ilmaydi.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
