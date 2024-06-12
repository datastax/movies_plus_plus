"use server";

import { nanoid } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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
              const responseFromLangflow = await fetch(
                "http://127.0.0.1:7863/api/v1/run/e291a07a-4335-435b-9da5-eb8508b9c4aa",
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    input_value: prompt,
                  }),
                  method: "POST",
                }
              )
                .then((r) => r.json())
                .then((d) => d.outputs[0].outputs[0].results.result);

              return responseFromLangflow;
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
