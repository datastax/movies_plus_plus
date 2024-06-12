"use server";

import { nanoid } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { Movie } from "./Movie";
import { Movies } from "./Movies";

export const Ai = createAI({
  actions: {
    continueConversation: async ({ content }: any) => {
      const history = getMutableAIState();
      const result = await streamUI({
        model: openai("gpt-3.5-turbo"),
        messages: [...history.get(), { role: "user", content }],
        tools: {
          getMovies: {
            parameters: z.object({
              prompt: z.string(),
            }),
            description: "Tell the user about movies that match the prompt",
            generate: async function* ({ prompt }) {
              yield "Searching...";
              const client = new DataAPIClient(
                process.env.ASTRA_DB_APPLICATION_TOKEN!
              );
              const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);
              const movies: any = await db
                .collection("movies")
                .find({}, { vectorize: prompt, limit: 8 })
                .toArray();

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
