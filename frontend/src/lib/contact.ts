/** Dami Beauty official seller & contact — footer, legal pages, WhatsApp */

export const SELLER_NAME = "Resul Gündoğdu";
export const SELLER_VKN = "4290939043";
export const CONTACT_ADDRESS =
  "Sancaktepe Mah. Fatih Cad. No 189/193 A Blok Daire 22 Bağcılar İstanbul";

export const CONTACT_PHONE_DISPLAY = "+90 530 122 42 37";
export const CONTACT_PHONE_RAW = "905301224237";
export const CONTACT_EMAIL = "gundogduresul@outlook.com.tr";

/** wa.me / tel links — env override for staging only */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT_PHONE_RAW;
