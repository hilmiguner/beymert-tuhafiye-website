import type { Json } from "@/types/database";

type RichMark = {
  type: "bold" | "italic";
};

type RichNode = {
  type:
    | "doc"
    | "paragraph"
    | "heading"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "blockquote"
    | "horizontalRule"
    | "hardBreak"
    | "text";
  attrs?: {
    level?: 2 | 3;
    start?: number;
  };
  content?: RichNode[];
  marks?: RichMark[];
  text?: string;
};

const maxRichTextLength = 100_000;

const allowedNodeTypes = new Set<RichNode["type"]>([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "horizontalRule",
  "hardBreak",
  "text",
]);

const blockTypes = new Set<RichNode["type"]>([
  "paragraph",
  "heading",
  "blockquote",
  "listItem",
]);

function sanitizeMarks(value: unknown): RichMark[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const marks = value
    .filter(
      (mark): mark is { type: string } =>
        Boolean(mark) &&
        typeof mark === "object" &&
        "type" in mark &&
        typeof mark.type === "string",
    )
    .filter((mark) => mark.type === "bold" || mark.type === "italic")
    .map((mark) => ({ type: mark.type as RichMark["type"] }));

  return marks.length > 0 ? marks : undefined;
}

function sanitizeNode(value: unknown): RichNode | null {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return null;
  }

  const source = value as Record<string, unknown>;
  if (
    typeof source.type !== "string" ||
    !allowedNodeTypes.has(source.type as RichNode["type"])
  ) {
    return null;
  }

  const type = source.type as RichNode["type"];

  if (type === "text") {
    if (typeof source.text !== "string") return null;

    return {
      type,
      text: source.text,
      marks: sanitizeMarks(source.marks),
    };
  }

  const node: RichNode = { type };

  if (type === "heading") {
    const attrs =
      source.attrs && typeof source.attrs === "object"
        ? (source.attrs as Record<string, unknown>)
        : {};
    const level = attrs.level === 3 ? 3 : 2;
    node.attrs = { level };
  }

  if (type === "orderedList") {
    const attrs =
      source.attrs && typeof source.attrs === "object"
        ? (source.attrs as Record<string, unknown>)
        : {};
    const start =
      typeof attrs.start === "number" &&
      Number.isInteger(attrs.start) &&
      attrs.start > 0 &&
      attrs.start <= 999
        ? attrs.start
        : 1;
    node.attrs = { start };
  }

  if (Array.isArray(source.content)) {
    const content = source.content
      .map(sanitizeNode)
      .filter((child): child is RichNode => child !== null);

    if (content.length > 0) {
      node.content = content;
    }
  }

  return node;
}

function collectText(node: RichNode, chunks: string[]) {
  if (node.type === "text") {
    chunks.push(node.text ?? "");
    return;
  }

  if (node.type === "hardBreak") {
    chunks.push("\n");
    return;
  }

  const before = chunks.length;
  for (const child of node.content ?? []) {
    collectText(child, chunks);
  }

  if (blockTypes.has(node.type) && chunks.length > before) {
    chunks.push("\n\n");
  }
}

export function parseRichTextFormValue(
  value: FormDataEntryValue | null,
): { json: Json; text: string } | null {
  if (typeof value !== "string" || value.length > maxRichTextLength) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    const sanitized = sanitizeNode(parsed);

    if (!sanitized || sanitized.type !== "doc") {
      return null;
    }

    const chunks: string[] = [];
    collectText(sanitized, chunks);

    return {
      json: sanitized as unknown as Json,
      text: chunks.join("").trim(),
    };
  } catch {
    return null;
  }
}
