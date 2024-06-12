import { useActions, useUIState } from "ai/rsc";

export function useMovieSearch() {
  const [, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return {
    search: async (prompt: string) => {
      setConversation((oldState: any) => [
        ...oldState,
        { role: "user", display: prompt },
      ]);
      const response = await continueConversation({
        role: "user",
        content: prompt,
      });
      setConversation((oldState: any) => [...oldState, response]);
    },
  };
}
