import { nanoid } from "nanoid";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { LangflowClient } from "@datastax/langflow-client";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Movies } from "./Movies";
import { IntegrationSpinner } from "./IntegrationSpinner";
import { Player } from "./Player";
import { Markdown } from "./Markdown";
import { ForgotPassword } from "./ForgotPassword";
import { Map } from "./Map";

let lastLangflowResponse = "";

export const Ai = createAI({
  actions: {
    continueConversation: async ({ content }: any) => {
      "use server";
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
          showForgotPassword: {
            description:
              "When the user says they forgot their password, use this tool",
            parameters: z.object({}),
            generate: async function* () {
              return <ForgotPassword />;
            },
          },
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
                  <IntegrationSpinner /> Fetching movies...
                </div>
              );

              const langflowClient = new LangflowClient({
                baseUrl: process.env.LANGFLOW_BASE_URL,
              });
              const response = await langflowClient
                .flow("1c28f5e0-e1f2-43b4-ac81-1f5c314569d7")
                .run(query);

              lastLangflowResponse =
                response.chatOutputText() || "Nothing found";

              history.done([
                ...history.get(),
                {
                  role: "assistant",
                  content: `Movies are: ${lastLangflowResponse}`,
                },
              ]);

              return (
                <ul>
                  {lastLangflowResponse.split("\n").map((movie, index) => (
                    <li key={index}>
                      <Markdown>{movie.trim()}</Markdown>
                    </li>
                  ))}
                </ul>
              );
            },
          },
          showMap: {
            description:
              "When the user asks for a location where to watch movies, use this tool",
            parameters: z.object({}),
            generate: async function* () {
              return <Map apiKey={process.env.GOOGLE_MAPS_API_KEY!} />;
            },
          },
          showTrailer: {
            description: "When the user asks for a trailer, use this tool",
            parameters: z.object({
              movieName: z.string(),
            }),
            generate: async function* ({ movieName }) {
              console.log("=== Starting movie search ===");
              console.log(`Searching for movie: ${movieName}`);
              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Searching for movie...
                </div>
              );
              const movieId = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
                  movieName
                )}&language=en-US`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                  },
                }
              )
                .then((r) => r.json())
                .then((d) => {
                  console.log("=== Movie search response ===");
                  console.log(d);
                  return d.results[0]?.id;
                });

              console.log("=== Movie ID ===");
              console.log(movieId);

              if (!movieId) {
                console.log("=== Movie not found ===");
                return (
                  <div className="flex items-center gap-4">
                    <p>Could not find a movie with the name: {movieName}</p>
                  </div>
                );
              }

              console.log("=== Starting trailer search ===");
              yield (
                <div className="flex items-center gap-4">
                  <IntegrationSpinner /> Searching for trailer...
                </div>
              );
              const trailer = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                  },
                }
              )
                .then((r) => r.json())
                .then(
                  (d) =>
                    d.results.find(
                      (v: { type: string }) =>
                        v.type === "Teaser" || v.type === "Trailer"
                    ).key
                );

              history.done([
                ...history.get(),
                {
                  role: "assistant",
                  content: `Trailer for ${movieName}`,
                },
              ]);

              if (trailer) {
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
              } else {
                return (
                  <div className="flex items-center gap-4">
                    <p>Could not find a trailer for {movieName}</p>
                  </div>
                );
              }
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
              console.log("lastLangflowResponse:", lastLangflowResponse);
              const titles = lastLangflowResponse.split("\n");
              console.log("Parsed titles:", titles);
              const movies = await Promise.all(
                titles.slice(0, 4).map(async (title) => {
                  console.log("Processing title:", title);
                  const cleanedTitle = title.replace(/^\d+\.\s*/, "").trim();
                  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
                    cleanedTitle
                  )}&include_adult=false&language=en-US&page=1`;
                  console.log("Fetching from URL:", url);
                  try {
                    const options = {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                      },
                    };
                    const response = await fetch(url, options);
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("API response for", title, ":", data);
                    if (data.results && data.results.length > 0) {
                      const movie = data.results[0];
                      console.log("Found movie:", movie);
                      return {
                        title: movie.title,
                        poster_path: movie.poster_path,
                        _id: movie.id.toString(),
                      };
                    }
                    console.log("No movie found for:", title);
                  } catch (error) {
                    console.error(`Error fetching data for ${title}:`, error);
                  }
                  return {
                    title: "Unknown Movie",
                    poster_path: "/placeholder.jpg",
                    _id: "unknown",
                  };
                })
              ).then((results) => {
                const filteredResults = results.filter(Boolean);
                console.log("Filtered movie results:", filteredResults);
                return filteredResults;
              });
              console.log("Final movies array:", movies);

              console.log({ movies, titles, lastLangflowResponse });
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
