import { Suggestion } from "./Suggestion";
import { jetbrainsMono } from "./fonts";

export function Suggestions() {
   return (
      <div
         className={`grid sm-flex  overflow-x-auto md:grid-cols-3 gap-4 ${jetbrainsMono.className}`}
      >
         <Suggestion>Scary movies set in the woods</Suggestion>
         <Suggestion>Movies that feature large monsters</Suggestion>
         <Suggestion>Movies with a strong female lead</Suggestion>
      </div>
   );
}
