import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        ol: ({ children }) => (
          <ol className="list-decimal list-inside grid gap-4">{children}</ol>
        ),
        ul: ({ children }) => (
          <ul className="list-inside grid gap-4">{children}</ul>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
