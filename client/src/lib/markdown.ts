import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const allowedTags = ["p", "br", "ul", "ol", "li", "strong", "em", "a"];

const allowedAttributes: Record<string, string[]> = {
  a: ["href", "target", "rel", "title"],
};

const allowedSchemes = ["http", "https", "mailto"];

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const renderer = new marked.Renderer();

renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  let attributes = `href="${escapeHtmlAttribute(href)}"`;
  if (title) {
    attributes += ` title="${escapeHtmlAttribute(title)}"`;
  }
  if (isExternal) {
    attributes += ' target="_blank" rel="external noopener noreferrer"';
  }

  return `<a ${attributes}>${text}</a>`;
};

marked.use({ renderer });

export function renderMarkdown(raw: string): string {
  const html = marked.parse(raw, {
    async: false,
    breaks: false,
    gfm: false,
  }) as string;

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes,
    disallowedTagsMode: "discard",
    exclusiveFilter: (frame) => {
      if (frame.tag === "a" && !frame.attribs.href) {
        return "excludeTag";
      }
      return false;
    },
  });
}
