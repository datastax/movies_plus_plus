"use server";

import { nanoid } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { Movies } from "./Movies";
import { IntegrationSpinner } from "./IntegrationSpinner";
import { Player } from "./Player";
import { Markdown } from "./Markdown";

let lastLangflowResponse = "";

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
          return <Markdown>{content}</Markdown>;
        },
        tools: {
          getMovies: {
            description:
              "A tool used to get a list of movies matching a user's query",
            parameters: z.object({
              query: z.string(),
            }),
            generate: async function* ({ query }) {
              console.log("Looking for movies", { query });
              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Asking Langflow...
                </div>
              );
              const movies = await fetch(
                process.env.LANGFLOW_URL!,
                {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    input_value: query,
                  }),
                }
              )
                .then((r) => r.json())
                .then((d) => d.outputs[0].outputs[0].results.message.text);

              lastLangflowResponse = movies;
              //console.log(movies)

              return <Markdown>{movies}</Markdown>;
            },
          },
          showTrailer: {
            description: "When the user asks for a trailer, use this tool",
            parameters: z.object({
              movieName: z.string(),
            }),
            generate: async function* ({ movieName }) {
              const client = new DataAPIClient(
                process.env.ASTRA_DB_APPLICATION_TOKEN!
              );
              const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);

              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Getting more info about {movieName}...
                </div>
              );
              const movie: any = await db
                .collection("movies")
                .findOne({}, { vectorize: movieName });

              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Found movie, getting trailer...
                </div>
              );
              const trailer = await fetch(
                `https://api.themoviedb.org/3/movie/${movie._id}/videos?language=en-US&api_key=${process.env.TMDB_API_KEY}`
              )
                .then((r) => r.json())
                .then(
                  (d) =>
                    d.results.find(
                      (v: { type: string }) =>
                        v.type === "Teaser" || v.type === "Trailer"
                    ).key
                );

              return (
                <Player
                  playsinline
                  muted
                  width="100%"
                  controls
                  height="auto"
                  style={{
                    height: "auto",
                    flexShrink: 0,
                    flexGrow: 1,
                    aspectRatio: "16/9",
                  }}
                  playing
                  url={`https://www.youtube-nocookie.com/embed/${trailer}`}
                />
              );
            },
          },
          createGenerativeUi: {
            parameters: z.object({
              moviesFromContext: z
                .string()
                .describe(
                  "A comma separated list of movies from the chat context"
                ),
            }),
            description:
              "A tool used to generate UI in response to a user explicitly asking for UI",
            generate: async function* () {
              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Getting movie posters...
                </div>
              );
              // parse the Langflow response to get the movie titles
              const titles = lastLangflowResponse.split("\n").map((m: string) => m.substring(2));
              console.log(titles)
              const client = new DataAPIClient(
                process.env.ASTRA_DB_APPLICATION_TOKEN!
              );
              const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);
              const movies: any = await db
                .collection("movies")
                .find(
                  { title: { $in: titles }},
                  {
                    limit: 4,
                  }
                )
                .toArray();
              console.log(movies)
              return <Movies movies={movies} />;
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
