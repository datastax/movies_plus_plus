"use client";

import { jetbrainsMono } from "./fonts";
import { Suggestions } from "./Suggestions";
import { useState } from "react";
import { useMovieSearch } from "./useMovieSearch";

type Props = {
  shouldShowSuggestions: boolean;
};

export function SearchForm({ shouldShowSuggestions }: Props) {
  const [input, setInput] = useState("");
  const { search } = useMovieSearch();
  return (
    <form className="grid gap-4 w-full" action={() => search(input)}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`${jetbrainsMono.className} focus:text-white focus:border-white text-[grey] w-full p-4 rounded-lg bg-black border border-[#404040]`}
        placeholder="Type something to search for movies..."
      />
      {shouldShowSuggestions && <Suggestions />}
    </form>
  );
}
