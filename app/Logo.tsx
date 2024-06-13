import { DirectorIcon } from "./DirectorIcon";

export function Logo() {
  return (
    <a href="/">
      <figure className="flex items-center w-[192px] gap-2">
        <DirectorIcon />
        MOVIES++
      </figure>
      <span className="text-sm text-[grey]">Powered by DataStax</span>
    </a>
  );
}
