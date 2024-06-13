"use client";

import { useState } from "react";
import { Movie } from "./Movie";

type Props = {
  movies: { title: string; poster_path: string; _id: string }[];
};

export function Movies({ movies }: Props) {
  const [hoveredMovieIndex, setHoveredMovieIndex] = useState(-1);
  return (
    <div className="grid grid-cols-8 gap-8">
      {movies.map((m, i) => (
        <a
          onMouseEnter={() => setHoveredMovieIndex(i)}
          onMouseLeave={() => setHoveredMovieIndex(-1)}
          className={`${
            hoveredMovieIndex !== -1 && hoveredMovieIndex !== i
              ? "opacity-50"
              : ""
          } transition-all`}
          key={m._id}
          target="_blank"
          href={`https://www.themoviedb.org/movie/${m._id}}`}
        >
          <Movie
            title={m.title}
            posterUrl={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
          />
        </a>
      ))}
    </div>
  );
}
