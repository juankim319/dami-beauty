import { HeaderClient } from "./HeaderClient";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-dami-200 bg-white/95 backdrop-blur-sm dark:border-dami-700 dark:bg-dami-900/95">
      <HeaderClient />
    </header>
  );
}
