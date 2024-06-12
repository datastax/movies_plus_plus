"use client";

import { LinkIcon } from "./LinkIcon";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";
import { jetbrainsMono } from "./fonts";

const movies = Array.from({ length: 0 }, () => ({
  Series_Title: "Baz",
  Poster_Url: "https://picsum.photos/230/330?q=" + (() => Math.random())(),
}));

export default function Home() {
  return (
    <main
      className={`mx-auto py-8 ${
        movies.length === 0 ? "flex items-center h-screen" : ""
      }`}
    >
      <header className="flex items-center gap-32">
        <Logo />
        <SearchForm shouldShowSuggestions={!movies.length} />
      </header>
      <div className="grid grid-cols-4 gap-8 py-8">
        {movies.map((m) => (
          <figure className="grid gap-2">
            <img
              className="rounded-lg w-full"
              alt={m.Series_Title}
              src={m.Poster_Url}
            />
            <figcaption className="grid gap-1">
              <span className="text-white font-bold">{m.Series_Title}</span>
              <span
                className={`flex items-center text-sm text-[grey] gap-1 ${jetbrainsMono.className}`}
              >
                <LinkIcon />
                Source
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
