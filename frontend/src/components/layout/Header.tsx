import { HeaderClient } from "./HeaderClient";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-dami-800/30 bg-dami-900/95 backdrop-blur-sm">
      <HeaderClient />
    </header>
  );
}
