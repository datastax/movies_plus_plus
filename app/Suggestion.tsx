import { PropsWithChildren } from "react";

export function Suggestion({ children }: PropsWithChildren) {
  return (
    <button
      className="bg-[#250e09] rounded-lg text-[#F45D3A] p-4"
      type="button"
    >
      {children}
    </button>
  );
}
