import { jetbrainsMono } from "./fonts";
import { Suggestions } from "./Suggestions";

type Props = {
  shouldShowSuggestions: boolean;
};

export function SearchForm({ shouldShowSuggestions }: Props) {
  return (
    <form className="grid gap-4 w-full">
      <input
        type="text"
        className={`${jetbrainsMono.className} focus:text-white focus:border-white text-[grey] w-full p-4 rounded-lg bg-black border border-[#404040]`}
        placeholder="Type something to search for movies..."
      />
      {shouldShowSuggestions && <Suggestions />}
    </form>
  );
}
