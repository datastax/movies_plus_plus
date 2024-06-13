"use client";

import { useUIState } from "ai/rsc";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";

export default function Home() {
  const [result] = useUIState();
  return (
    <main
      className={`mx-auto w-full ${
        !result.length ? "flex items-center h-screen" : "flex-col-reverse flex"
      }`}
    >
      <header
        className={`
        h-[122px] max-w-screen-lg mx-auto flex w-full items-center gap-8 p-8 bg-black bg-opacity-80 backdrop-blur-lg`}
      >
        <Logo />
        <SearchForm shouldShowSuggestions={!result.length} />
      </header>
      {result.length > 0 && (
        <div className="p-8 w-full flex h-[calc(100vh-122px)] flex-col justify-end text-left overflow-auto max-w-screen-lg mx-auto gap-4">
          {result.map((m: any) => m.display)}
        </div>
      )}
    </main>
  );
}
