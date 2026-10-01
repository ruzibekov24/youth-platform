import { Landing } from "@/components/landing";
import { Today } from "@/components/today";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  return user ? <Today user={user} /> : <Landing />;
}
