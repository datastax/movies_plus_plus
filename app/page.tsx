"use client";

import { useUIState } from "ai/rsc";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";

export default function Home() {
  const [result] = useUIState();
  return (
    <main
      className={`mx-auto w-full py-8 ${
        !result.length ? "flex items-center h-screen" : ""
      }`}
    >
      <header
        className={`${
          result.length > 0 ? "fixed top-0" : ""
        } flex bg-black bg-opacity-90 backdrop-blur-lg w-full items-center gap-32 p-8`}
      >
        <Logo />
        <SearchForm shouldShowSuggestions={!result.length} />
      </header>
      {result.length > 0 && <div className="h-[58px]"></div>}
      {result.length > 0 && (
        <div className="p-8 grid gap-8">
          {result.map((m: any) => m.display)}
        </div>
      )}
    </main>
  );
}
