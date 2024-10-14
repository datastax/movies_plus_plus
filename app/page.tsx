"use client";

import { useUIState } from "ai/rsc";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";
import { useLayoutEffect } from "react";

export default function Home() {
  const [result] = useUIState();

  useLayoutEffect(() => {
    const resultDiv = document.querySelector(".convo");
    if (resultDiv) {
      const scrollToBottom = () => {
        setTimeout(() => {
          resultDiv.scrollTop = resultDiv.scrollHeight;
        }, 100); // Small delay to allow images to load
      };

      // Initial scroll
      scrollToBottom();

      // Set up a MutationObserver to watch for changes in the result div
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            scrollToBottom();
          }
        });
      });
      observer.observe(resultDiv, { childList: true, subtree: true });

      // Add event listeners for image and iframe load events
      resultDiv.addEventListener("load", scrollToBottom, true);

      // Clean up the observer and event listeners when the component unmounts
      return () => {
        observer.disconnect();
        resultDiv.removeEventListener("load", scrollToBottom, true);
      };
    }
  }, []);

  return (
    <main
      className={`mx-auto w-full md:flex grid gap-4 ${
        !result.length ? "items-center h-screen" : "flex-col-reverse"
      }`}
    >
      <header
        className={`
        h-[155px] md:h-[122px] grid max-w-screen-lg mx-auto md:flex w-full items-center gap-4 md:gap-8 p-4 md:p-8 bg-black bg-opacity-80 backdrop-blur-lg`}
      >
        <Logo />
        <SearchForm shouldShowSuggestions={!result.length} />
      </header>
      {result.length > 0 && (
        <div className="convo row-start-1 p-4 md:p-8 w-full flex h-[calc(100vh-170px)] md:h-[calc(100vh-122px)] flex-col text-left overflow-auto max-w-screen-lg mx-auto gap-4">
          {result.map((m: any) => m.display)}
        </div>
      )}
    </main>
  );
}
