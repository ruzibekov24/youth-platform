import { redirect } from "next/navigation";

// Eski manzil: "Bugun" endi Asosiy ekranning bir qismi.
export default function TodayRedirect() {
  redirect("/asosiy");
}
