"use client";

import { useUIState } from "ai/rsc";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";

export default function Home() {
  const [result] = useUIState();
  return (
    <main
      className={`mx-auto py-8 ${
        !result.length ? "flex items-center h-screen" : ""
      }`}
    >
      <header className="flex items-center gap-32 px-8">
        <Logo />
        <SearchForm shouldShowSuggestions={!result.length} />
      </header>
      {result.length > 0 && (
        <div className="p-8">{result.map((m: any) => m.display)}</div>
      )}
    </main>
  );
}
