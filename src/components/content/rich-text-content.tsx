import type { ReactNode } from "react";

import type { Json } from "@/types/database";

type JsonObject = { [key: string]: Json | undefined };

function asObject(value: Json | undefined): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function renderChildren(content: Json | undefined, key: string): ReactNode {
  if (!Array.isArray(content)) return null;

  return content.map((child, index) =>
    renderNode(child, key + "-" + index),
  );
}

function renderText(node: JsonObject, key: string) {
  const value = typeof node.text === "string" ? node.text : "";
  const marks = Array.isArray(node.marks) ? node.marks : [];

  let rendered: ReactNode = value;

  for (const mark of marks) {
    const object = asObject(mark);
    if (!object || typeof object.type !== "string") continue;

    if (object.type === "bold") {
      rendered = <strong>{rendered}</strong>;
    }

    if (object.type === "italic") {
      rendered = <em>{rendered}</em>;
    }
  }

  return <span key={key}>{rendered}</span>;
}

function renderNode(value: Json, key: string): ReactNode {
  const node = asObject(value);
  if (!node || typeof node.type !== "string") return null;

  if (node.type === "text") {
    return renderText(node, key);
  }

  const children = renderChildren(node.content, key);

  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const attrs = asObject(node.attrs);
      const level = attrs?.level === 3 ? 3 : 2;
      return level === 3 ? (
        <h3 key={key}>{children}</h3>
      ) : (
        <h2 key={key}>{children}</h2>
      );
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList": {
      const attrs = asObject(node.attrs);
      const start =
        typeof attrs?.start === "number" ? attrs.start : undefined;
      return (
        <ol key={key} start={start}>
          {children}
        </ol>
      );
    }
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    default:
      return null;
  }
}

export function RichTextContent({
  value,
  fallback,
  className = "",
}: {
  value: Json | null;
  fallback?: string | null;
  className?: string;
}) {
  const hasRichDocument =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "type" in value &&
    value.type === "doc";

  if (!hasRichDocument) {
    return fallback ? (
      <p className={className}>{fallback}</p>
    ) : null;
  }

  return (
    <div
      className={
        "space-y-4 leading-7 text-muted " +
        "[&_h2]:bt-display [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-foreground " +
        "[&_h3]:bt-display [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground " +
        "[&_p]:my-4 [&_strong]:font-extrabold [&_strong]:text-foreground [&_em]:italic " +
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 " +
        "[&_li]:my-1 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 " +
        "[&_blockquote]:pl-5 [&_blockquote]:italic [&_hr]:my-8 [&_hr]:border-border " +
        className
      }
    >
      {renderNode(value, "root")}
    </div>
  );
}
