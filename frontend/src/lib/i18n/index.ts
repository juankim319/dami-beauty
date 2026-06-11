import { tr } from "./locales/tr";

export type Locale = "tr";
export type Messages = typeof tr;

export function getLocale(): Locale {
  return "tr";
}

export function getMessages() {
  return tr;
}

export const t = getMessages();

export { tr };
