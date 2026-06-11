"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMessages } from "@/lib/i18n";

const COOKIE_KEY = "dami_cookie_consent";
const t = getMessages();

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-dami-100 bg-white p-4 shadow-lg dark:border-dami-800 dark:bg-[#141012] md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-dami md:border">
      <p className="text-sm text-gray-700 dark:text-dami-200">
        {t.cookie.message}{" "}
        <Link href="/legal/cerez" className="text-dami-500 underline">
          {t.legal.footerCookies}
        </Link>
      </p>
      <button onClick={accept} className="btn-primary mt-3 w-full text-sm">
        {t.cookie.accept}
      </button>
    </div>
  );
}
