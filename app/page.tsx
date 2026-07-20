import { redirect } from "next/navigation";

/** Fallback if middleware rewrite is skipped; homepage is served from public/landing.html */
export default function HomePage() {
  redirect("/landing.html");
}
