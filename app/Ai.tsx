"use server";

import { nanoid } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { DataAPIClient } from "@datastax/astra-db-ts";
import Markdown from "react-markdown";
import ReactPlayer from "./Player";

export const Ai = createAI({
  actions: {
    continueConversation: async ({ content }: any) => {
      const history = getMutableAIState();
      const result = await streamUI({
        model: openai("gpt-4o"),
        messages: [...history.get(), { role: "user", content }],
        text: ({ content, done }) => {
          if (done) {
            history.done([...history.get(), { role: "assistant", content }]);
          }
          return content;
        },
        tools: {
          showTrailer: {
            description: "Show a trailer",
            parameters: z.object({
              movieName: z.string(),
            }),
            generate: async function* ({ movieName }) {
              const client = new DataAPIClient(
                process.env.ASTRA_DB_APPLICATION_TOKEN!
              );
              const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);
              yield "Searching for movie " + movieName + "...";
              const movie: any = await db
                .collection("movies")
                .findOne({}, { vectorize: movieName });

              yield "Found movie, getting trailer...";
              const trailer = await fetch(
                `https://api.themoviedb.org/3/movie/${movie._id}/videos?language=en-US&api_key=${process.env.TMDB_API_KEY}`
              )
                .then((r) => r.json())
                .then((d) => d.results[0].key);

              return (
                <ReactPlayer
                  playsinline
                  muted
                  width="100%"
                  controls
                  height="auto"
                  style={{ height: "auto", aspectRatio: "16/9" }}
                  playing
                  url={`https://www.youtube-nocookie.com/embed/${trailer}`}
                />
              );
            },
          },
          getMovies: {
            parameters: z.object({
              prompt: z.string(),
            }),
            description: "Get a list of movies.",
            generate: async function* ({ prompt }) {
              yield "Searching...";

              const movies = await fetch(
                "http://127.0.0.1:7864/api/v1/run/e291a07a-4335-435b-9da5-eb8508b9c4aa?stream=false",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                  },
                  body: JSON.stringify({
                    input_value: prompt,
                  }),
                }
              )
                .then((r) => r.json())
                .then((d) => {
                  console.dir({ d }, { depth: Infinity });
                  return d.outputs[0].outputs[0].results.result;
                });

              return (
                <div className="grid gap-4">
                  <Markdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="grid gap-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="grid gap-2">{children}</ol>
                      ),
                    }}
                  >
                    {movies}
                  </Markdown>
                </div>
              );
            },
          },
        },
      });

      return {
        id: nanoid(),
        role: "assistant",
        display: result.value,
      };
    },
  },
  initialAIState: [],
  initialUIState: [],
});
