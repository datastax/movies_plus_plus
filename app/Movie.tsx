import { LinkIcon } from "./LinkIcon";
import { jetbrainsMono } from "./fonts";

type Props = {
  title: string;
  posterUrl: string;
};

export function Movie({ title, posterUrl }: Props) {
  return (
    <figure className="grid gap-2">
      <img className="rounded-lg w-full" alt={title} src={posterUrl} />
      <figcaption className="grid gap-1">
        <span className="text-white font-bold">{title}</span>
        <span
          className={`flex items-center text-sm text-[grey] gap-1 ${jetbrainsMono.className}`}
        >
          <LinkIcon />
          Source
        </span>
      </figcaption>
    </figure>
  );
}
