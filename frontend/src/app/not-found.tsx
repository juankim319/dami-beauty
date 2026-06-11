import Link from "next/link";
import { getMessages } from "@/lib/i18n";

const t = getMessages();

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-dami-50 px-4 text-center">
      <p className="text-6xl">🎀</p>
      <h1 className="mt-4 text-2xl font-bold text-dami-800">{t.notFound.title}</h1>
      <p className="mt-2 text-dami-600">{t.notFound.body}</p>
      <Link href="/" className="btn-primary mt-6">{t.notFound.home}</Link>
    </div>
  );
}
