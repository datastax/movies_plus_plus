"use client";

import { useUIState } from "ai/rsc";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";

export default function Home() {
  const [result] = useUIState();
  return (
    <main
      className={`mx-auto w-full py-8 ${
        !result.length ? "flex items-center h-screen" : "pt-[100px]"
      }`}
    >
      <header
        className={`${
          result.length > 0 ? "fixed top-0" : ""
        } flex w-full items-center gap-32 p-8 bg-black bg-opacity-80 backdrop-blur-lg`}
      >
        <Logo />
        <SearchForm shouldShowSuggestions={!result.length} />
      </header>
      {result.length > 0 && (
        <div className="p-8 grid gap-4">
          {result.map((m: any) => m.display)}
        </div>
      )}
    </main>
  );
}
