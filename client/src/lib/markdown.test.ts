import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders bold and italic text", () => {
    const html = renderMarkdown("**bold** and *italic*");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("renders paragraphs and lists", () => {
    const html = renderMarkdown("Hello\n\n- one\n- two");
    expect(html).toContain("<p>Hello</p>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<li>two</li>");
    expect(html).toContain("</ul>");
  });

  it("adds target and rel to external http links", () => {
    const html = renderMarkdown("[text](https://example.com)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="external noopener noreferrer"');
    expect(html).toContain(">text</a>");
  });

  it("does not add target to mailto links", () => {
    const html = renderMarkdown("[email](mailto:foo@bar.com)");
    expect(html).toContain('href="mailto:foo@bar.com"');
    expect(html).toContain(">email</a>");
    expect(html).not.toContain('target="_blank"');
  });

  it("neutralizes javascript: links", () => {
    const html = renderMarkdown("[click](javascript:alert(1))");
    expect(html).not.toContain("<a");
    expect(html).toContain("click");
  });

  it("neutralizes data: links", () => {
    const html = renderMarkdown(
      "[click](data:text/html,<script>alert(1)</script>)",
    );
    expect(html).not.toContain("<a");
    expect(html).toContain("click");
  });

  it("removes disallowed tags while keeping text", () => {
    const html = renderMarkdown(
      'Hello <script>alert(1)</script> <img src="x" onerror="alert(1)"> world',
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("Hello");
    expect(html).toContain("world");
  });

  it("treats protocol-relative URLs as external", () => {
    const html = renderMarkdown("[text](//example.com)");
    expect(html).toContain('href="//example.com"');
    expect(html).toContain('target="_blank"');
  });

  it("strips headings to plain text", () => {
    const html = renderMarkdown("# Heading");
    expect(html).not.toContain("<h1");
    expect(html).toContain("Heading");
  });
});
